import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useSpeechSynthesis } from 'react-speech-kit';
import styled from 'styled-components';
import { Button } from '../components';
import * as socket from '../socket';
import { game_starting, submit_character_name } from '../store/game_slice';

const ShowCharactersBlock = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 4em;

  & > h3 {
    margin-bottom: 0.5em;
  }

  & > ${Button} {
    margin-top: 2em;
  }
`;

const CharactersList = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

const CharacterItem = styled.div`
  margin: 0.5em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.yellow};
  border-radius: 0.2em;
  border: 1px solid black;
  font-size: 2em;
  padding: 0.4em;
`;

function ChooseCharacterView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { speak } = useSpeechSynthesis({
    onEnd: () => {
      console.log('TEMP: speak func ended');
      set_show_characters(null);
    }
  });
  const { room, game } = useSelector(({ room, game }) => ({ room, game }));
  const [character, set_character] = useState('');
  const [submitted, set_submitted] = useState(false);
  const [all_characters_list, set_all_characters_list] = useState([]);
  const [show_characters, set_show_characters] = useState(false);

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
      socket.listen('character:game-starting', () => {
        dispatch(game_starting());
        history.replace('/lobby');
      }),
      socket.listen('character:show-characters', ({ characters }) => {
        set_all_characters_list(characters);
      })
    ];
    return () => closers.map(c => c());
  });

  function submit_character() {
    if (!character || submitted) return;
    dispatch(submit_character_name(character));
    set_submitted(true);
  }

  function begin_character_showing() {
    console.log(speak);
    speak({ text: all_characters_list.join('!., ') });
    set_show_characters(true);
  }

  function begin_game() {
    socket.emit('character:shown-characters');
  }

  return (
    <div>
      {all_characters_list.length === 0 && !show_characters && (
        <div>
          <label>Character Name:</label>
          <input
            type='text'
            value={character}
            disabled={submitted}
            onChange={e => set_character(e.target.value)}
          />
          <Button onClick={submit_character}>Submit Character</Button>
        </div>
      )}

      {all_characters_list.length > 0 && show_characters === false && (
        <ShowCharactersBlock>
          <h3>All players have chosen their characters</h3>
          <p>
            Ensure that all players can see your screen and when ready press the
            button below to show all characters in a random order.
          </p>
          <Button yellow onClick={begin_character_showing}>
            Show Characters
          </Button>
        </ShowCharactersBlock>
      )}

      {show_characters && (
        <CharactersList>
          {all_characters_list.map(character => (
            <CharacterItem key={character}>
              <span>{character}</span>
            </CharacterItem>
          ))}
        </CharactersList>
      )}

      {show_characters === null && (
        <ShowCharactersBlock>
          <h3>Press the button below to begin the game</h3>
          <Button green onClick={begin_game}>
            Begin Game
          </Button>
        </ShowCharactersBlock>
      )}
    </div>
  );
}

export default ChooseCharacterView;
