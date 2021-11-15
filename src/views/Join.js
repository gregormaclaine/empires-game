import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components';
import { join_game } from '../store/room_slice';

function JoinView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const room = useSelector(s => s.room);
  const [player_name, set_player_name] = useState('');
  const [room_code, set_room_code] = useState('');

  useEffect(() => {
    if (room.status === 'joined' && room.code) history.replace('/lobby');
  }, [room, history]);

  return (
    <div>
      <label>Your Name:</label>
      <input type='text' value={player_name} onChange={e => set_player_name(e.target.value)}/>
      <br />
      <label>Room Code:</label>
      <input type='text' value={room_code} onChange={e => set_room_code(e.target.value.toUpperCase())}/>
      <Button onClick={() => dispatch(join_game(player_name, room_code))}>Join Room</Button>
      {room.error && <p>Error: {room.error}</p>}
    </div>
  );
}

export default JoinView;
