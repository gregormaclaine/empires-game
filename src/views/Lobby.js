import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { LobbyPlayerTile } from '../components';
import * as socket from '../socket';
import { update_players, leave_lobby } from '../store/room_slice';

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
      socket.listen('lobby:kicked', ({ message }) => {
        dispatch(leave_lobby());
        history.push('/');
        toast.error(message);
      })
    ];
    return () => closers.map(c => c());
  });

  useEffect(() => {
    if (room.status !== 'joined' || !room.code) history.push('/');
  }, [room, history]);

  return (
    <div>
      <RoomCodeWrapper>
        <RoomCode>{room.code}</RoomCode>
      </RoomCodeWrapper>
      <PlayerTilesWrapper>
        {room.players.map(player => (
          <LobbyPlayerTile {...player} key={player.id} admin={admin} />
        ))}
      </PlayerTilesWrapper>
    </div>
  );
}

export default LobbyView;
