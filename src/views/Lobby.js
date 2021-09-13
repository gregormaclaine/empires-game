import { useSelector } from 'react-redux';
 
function LobbyView() {
  const room = useSelector(state => state.room);
  return <div><p>{room.code}</p><pre>{JSON.stringify(room.players)}</pre></div>;
}

export default LobbyView;
