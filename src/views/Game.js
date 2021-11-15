import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CreateView() {
  const history = useHistory();
  const { room, game } = useSelector(({ room, game }) => ({ room, game }));

  useEffect(() => {
    if (room.status !== 'joined' || !room.code) history.replace('/');
  }, [room, history]);

  useEffect(() => {
    if (game.state !== 'game') history.replace('/')
  }, [game.state, history]);

  return (
    <div>
      <i>Pretend there is a game here ;)</i>
    </div>
  );
}

export default CreateView;
