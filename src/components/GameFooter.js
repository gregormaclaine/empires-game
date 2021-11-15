import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import Button from './Button';
import { leave_lobby } from '../store/room_slice';
import * as socket from '../socket';
import { useState } from 'react';

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5em;

  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
`;

const UsernameInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
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
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    & > h2:hover, & > span:hover { opacity: 0.9; }
  }
`;

function GameFooter() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { room, game } = useSelector(({ room, game }) => ({ room, game }));
  const [show_character, set_show_character] = useState(false);

  const leave = () => {
    socket.emit('lobby:leave');
    dispatch(leave_lobby());
    history.replace('/');
  }

  const self_player = room.players.find(p => p.id === socket.id());

  return (
    <Wrapper>
      <Button red onClick={leave} style={{ margin: 10 }}>Leave Game</Button>
      <UsernameInfo>
        <span>Username: <b>{self_player && self_player.name}</b></span>
      </UsernameInfo>
      <CharacterInfo>
        <span>Your Character</span>
        <div onClick={() => set_show_character(!show_character)}>
          {show_character ? <h2>{game.character}</h2> : <span>Click to Show</span>}
        </div>
      </CharacterInfo>
    </Wrapper>
  )
}

export default GameFooter;
