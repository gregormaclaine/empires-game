import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { BackArrow, Button, LobbyPlayerTile } from '../components';
import * as socket from '../socket';
import { begin_character_picking, begun_character_picking } from '../store/game_slice';
import { leave_lobby, update_players } from '../store/room_slice';

const RoomCodeWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: -20vh;
  margin-bottom: 8vh;
`;

const RoomCode = styled.span`
  font-family: Dosis;
  font-weight: 800;
  font-size: 5rem;
  color: white;
  opacity: 0.95;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.8);
  padding: 8px 32px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const PlayerTilesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 70vw;

  & > * {
    margin: 8px 8px;
  }
`;

const StartButton = styled(Button)`
  position: fixed;
  bottom: 8vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
`;

function LobbyView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const room = useSelector(state => state.room);
  const admin = room.players.find(p => p.id === socket.id())?.host || false;

  useEffect(() => {
    const closers = [
      socket.listen('lobby:update-players', ({ players }) => {
        dispatch(update_players(players));
      }),
      socket.listen('lobby:choose-character', () => {
        dispatch(begun_character_picking());
        history.replace('/choose-character');
      })
    ];
    return () => closers.map(c => c());
  });

  useEffect(() => {
    if (room.status !== 'joined' || !room.code) history.replace('/');
  }, [room, history]);

  const exit = () => {
    socket.emit('lobby:leave');
    dispatch(leave_lobby());
    history.replace('/');
  }

  const start = () => {
    dispatch(begin_character_picking(({ status }) => {
      if (status === 'success') history.replace('/choose-character');
    }));
  }

  return (
    <div>
      <BackArrow onClick={exit} />
      <RoomCodeWrapper>
        <RoomCode>{room.code}</RoomCode>
      </RoomCodeWrapper>
      <PlayerTilesWrapper>
        {room.players.map(player => (
          <LobbyPlayerTile {...player} key={player.id} admin={admin} />
        ))}
      </PlayerTilesWrapper>
      {admin && (
        <StartButton onClick={start}>
          <span>Start Game</span>
        </StartButton>
      )}
    </div>
  );
}

export default LobbyView;
