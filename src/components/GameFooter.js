import { useSelector } from 'react-redux';
import styled from 'styled-components';
import * as socket from '../socket';
import { useState } from 'react';
import { shade } from 'color-helpers';

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5em;

  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #${props => shade(props.theme.lightblue, -0.2)};
`;

const UsernameInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;

  background-color: #${props => shade(props.theme.lightblue, 0.2)};
  padding: 0.3em 0.5em;
  border-radius: 5px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 1.2em;
  color: #${props => shade(props.theme.green, 0.3)};
  text-shadow: 1px 1px 0 ${props => props.theme.green};
`;

const RoomCode = styled.span`
  font-weight: 600;
  font-size: 1.2em;
  color: #${props => shade(props.theme.red, -0.2)};
  text-shadow: 0.5px 0.5px 0 #${props => shade(props.theme.red, -0.4)};
`;

const StatusInfo = styled.p`
  font-size: 1.2em;
  text-align: center;
  word-wrap: wrap;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-shadow: 1px 1px 0 #${props => shade(props.theme.lightblue, -0.1)};
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;

  & > div {
    width: 90%;
    height: 2em;
    cursor: pointer;
    flex-grow: 1;
    margin-top: 4px;

    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;

    & > h2 {
      margin: 0;
    }

    & > span {
      display: block;
      font-size: 1em;
      background-color: #eee;
      border-radius: 4px;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    & > h2:hover,
    & > span:hover {
      opacity: 0.9;
    }
  }
`;

const CharacterName = styled.h2`
  margin: 0;
  color: ${props => props.theme.yellow};
`;

function GameFooter({ status }) {
  const { room, game } = useSelector(({ room, game }) => ({ room, game }));
  const [show_character, set_show_character] = useState(false);

  const self_player = room.players.find(p => p.id === socket.id());

  return (
    <Wrapper>
      <UsernameInfo>
        <span>
          Username: <Username>{self_player && self_player.name}</Username>
        </span>
        <span>
          Room Code: <RoomCode>{room.code}</RoomCode>
        </span>
      </UsernameInfo>
      <StatusInfo>
        {{
          waiting: '',
          'choosing-target':
            'You should now choose a person to ask about their character',
          answering: 'It is your turn to give your answer',
          'game-ended':
            'Thanks for playing! Maybe make a new lobby and play again :D'
        }[status] || ''}
      </StatusInfo>
      <CharacterInfo>
        <span>Your Character</span>
        <div onClick={() => set_show_character(!show_character)}>
          {show_character ? (
            <CharacterName>{game.character}</CharacterName>
          ) : (
            <span>Click to Show</span>
          )}
        </div>
      </CharacterInfo>
    </Wrapper>
  );
}

export default GameFooter;
