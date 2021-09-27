import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { LobbyPlayerTile } from '../components';
import { update_players } from '../store/room_slice';
import * as socket from '../socket';

const RoomCodeWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: -24vh;
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

  & > * {
    margin: 4px 8px;
  }
`;

function LobbyView() {
  const dispatch = useDispatch();
  const room = useSelector(state => state.room);

  useEffect(() => {
    const close = socket.listen('lobby:update-players', ({ players }) => {
      dispatch(update_players(players));
    });
    return close;
  });

  return (
    <div>
      <RoomCodeWrapper>
        <RoomCode>{room.code}</RoomCode>
      </RoomCodeWrapper>
      <PlayerTilesWrapper>
        {room.players.map(({ name, id, host }) => (
          <LobbyPlayerTile name={name} id={id} key={id} host={host} />
        ))}
      </PlayerTilesWrapper>
    </div>
  );
}

export default LobbyView;
