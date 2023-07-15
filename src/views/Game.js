import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  GameAnswerModel,
  GameEmpireBlock,
  GameEndedModel,
  GameFooter,
  RefreshButton
} from '../components';
import * as socket from '../socket';
import { update_empires } from '../store/game_slice';
import { leave_lobby } from '../store/room_slice';

const EmpireBlocks = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;

  height: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
  width: 100vw;

  overflow-y: auto;
  margin-bottom: 80px;
`;

function GameView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { room, game } = useSelector(({ room, game }) => ({ room, game }));
  const [current_state, set_current_state] = useState({
    status: 'waiting', // 'waiting' | 'choosing-target' | 'answering' | 'game-ended',
    asker: null,
    winner: null
  });
  const [refreshing, set_refreshing] = useState(false);

  useEffect(() => {
    if (room.status !== 'joined' || !room.code || game.state !== 'game')
      history.replace('/');
  }, [room, game.state, history]);

  useEffect(() => {
    const closers = [
      socket.listen('game:update-empires', ({ empires }) => {
        dispatch(update_empires(empires));
      }),
      socket.listen('game:choose-target', () => {
        toast.info('It is your turn to choose a player to ask');
        set_current_state({ status: 'choosing-target' });
      }),
      socket.listen('game:make-response', ({ asker }) => {
        set_current_state({ status: 'answering', asker });
      }),
      socket.listen('game:game-ended', ({ winner }) => {
        set_current_state({ status: 'game-ended', winner });
        setTimeout(() => {
          socket.emit('lobby:leave');
          dispatch(leave_lobby());
          history.replace('/');
        }, 5000);
      })
    ];
    return () => closers.map(c => c());
  });

  function choose_target(player) {
    if (current_state.status !== 'choosing-target' || player === socket.id())
      return;
    socket.emit('game:chosen-target', { player }, ({ status, message }) => {
      if (status !== 'success')
        return toast.error(
          message + '\nPlease wait a couple seconds or choose another player'
        );

      toast.success(message);
      set_current_state({ status: 'waiting' });
    });
  }

  function submit_response(correct) {
    if (current_state.status !== 'answering') return;
    socket.emit('game:made-response', { correct }, ({ status, message }) => {
      if (status !== 'success')
        return toast.error(message + '\nPlease try again');

      toast.success(message);
      set_current_state({ status: 'waiting' });
    });
  }

  function refresh_empires() {
    set_refreshing(true);
    socket.emit(
      'game:request-update-empires',
      {},
      ({ status, message, empires }) => {
        if (status !== 'success') return toast.error(message);

        dispatch(update_empires(empires));
        set_refreshing(false);
      }
    );
  }

  useEffect(() => {
    if (refreshing) return;
    if (!game.empires || game.empires.length === 0) {
      set_refreshing(true);
      socket.emit(
        'game:request-update-empires',
        {},
        ({ status, message, empires }) => {
          if (status !== 'success') return toast.error(message);

          dispatch(update_empires(empires));
          set_refreshing(false);
        }
      );
    }
  }, [refreshing, game.empires, dispatch]);

  return (
    <div>
      <EmpireBlocks>
        {game.empires &&
          game.empires.map(empire => (
            <GameEmpireBlock
              key={empire.emperor}
              empire={empire}
              onClick={() => choose_target(empire.emperor)}
              hoverable={
                current_state.status === 'choosing-target' &&
                empire.emperor !== socket.id()
              }
            />
          ))}
      </EmpireBlocks>
      {current_state.status === 'answering' && (
        <GameAnswerModel submit={submit_response} asker={current_state.asker} />
      )}
      {current_state.status === 'game-ended' && (
        <GameEndedModel winner={current_state.winner} />
      )}
      <GameFooter status={current_state.status} />
      <RefreshButton onClick={refresh_empires} />
    </div>
  );
}

export default GameView;
