import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as socket from '../socket';
import { leave_lobby } from '../store/room_slice';
import { GameFooter } from '../components';

function CreateView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { room, game } = useSelector(({ room, game }) => ({ room, game }));

  useEffect(() => {
    if (room.status !== 'joined' || !room.code || game.state !== 'game')
      history.replace('/');
  }, [room, game.state, history]);

  useEffect(() => {
    const closers = [
      socket.listen('lobby:kicked', ({ message }) => {
        dispatch(leave_lobby());
        history.replace('/');
        toast.error(message);
      })
    ];
    return () => closers.map(c => c());
  });

  return (
    <div>
      <i>Pretend there is a game here ;)</i>
      <GameFooter />
    </div>
  );
}

export default CreateView;
