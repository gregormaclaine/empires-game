import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Button } from '../components';
import * as socket from '../socket';
import { game_starting, submit_character_name } from '../store/game_slice';

function ChooseCharacterView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { room, game } = useSelector(({room, game}) => ({room, game}));
  const [character, set_character] = useState('');
  const [submitted, set_submitted] = useState(false);

  useEffect(() => {
    if (room.status !== 'joined' || !room.code) history.replace('/');
  }, [room, history]);

  useEffect(() => {
    if (game.state !== 'character-choosing') {
      if (submitted) history.replace('/game');
      else history.replace('/lobby');
    }
  }, [game.state, submitted, history]);

  useEffect(() => {
    const closers = [
      socket.listen('lobby:game_starting', () => {
        dispatch(game_starting());
        history.replace('/lobby');
      })
    ];
    return () => closers.map(c => c());
  });

  function submit_character() {
    if (submitted) return;
    dispatch(submit_character_name(character));
    set_submitted(true);
  }

  return (
    <div>
      <label>Character Name:</label>
      <input type='text' value={character} disabled={submitted}
        onChange={e => set_character(e.target.value)}/>
      <Button onClick={submit_character}>Submit Character</Button>
      {game.error && <p>Error: {game.error}</p>}
    </div>
  );
}

export default ChooseCharacterView;
