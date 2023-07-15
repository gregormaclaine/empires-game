import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components';
import { create_game } from '../store/room_slice';

function CreateView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const room = useSelector(s => s.room);
  const [player_name, set_player_name] = useState('');

  useEffect(() => {
    if (room.status === 'joined' && room.code) history.replace('/lobby');
  }, [room, history]);

  const handle_key_press = event => {
    if (event.key === 'Enter') submit();
  };

  const submit = () => {
    if (player_name) dispatch(create_game(player_name));
  };

  return (
    <div>
      <label>Your Name:</label>
      <input
        type='text'
        value={player_name}
        onChange={e => set_player_name(e.target.value)}
        onKeyPress={handle_key_press}
      />
      <Button onClick={submit}>Create Room</Button>
      {room.error && <p>Error: {room.error}</p>}
    </div>
  );
}

export default CreateView;
