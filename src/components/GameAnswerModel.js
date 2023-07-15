import { shade } from 'color-helpers';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from './Button';

export const ModelWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px;
  cursor: auto;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Model = styled.div`
  width: 60vw;
  height: 60vh;

  background-color: #${props => shade(props.theme.green, 0.4)};
  box-shadow: 3px 3px 1px #${props => shade(props.theme.green, 0.2)};
  border-radius: 0.5em;
  padding: 0.8em 1em;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 90vw;
  }
`;

export const ModelTitle = styled.h1`
  margin-bottom: 0;
  text-align: center;
`;

export const ModelSubtitle = styled.h3`
  margin-bottom: 0;
  text-align: center;
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-width: 60%;
  margin: 2em 0;
`;

const Option = styled(Button)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin: 0.2em;

  & > span:first-child {
    font-size: 1.5em;
    margin-bottom: 0.2em;
  }

  & > span:last-child {
    font-size: 0.8em;
    word-wrap: wrap;
  }
`;

function GameAnswerModel({ submit, asker }) {
  const room = useSelector(state => state.room);

  const asker_name = room.players.find(p => p.id === asker)?.name || (
    <i>Unknown</i>
  );

  return (
    <ModelWrapper>
      <Model>
        <ModelTitle>{asker_name} will now guess your character</ModelTitle>
        <ModelSubtitle>
          Please select whether they are correct once they have asked
        </ModelSubtitle>
        <Options>
          <Option red onClick={() => submit(true)}>
            <span>Correct</span>
            <span>They correctly determined your character</span>
          </Option>
          <Option green onClick={() => submit(false)}>
            <span>Incorrect</span>
            <span>They did not work out your character</span>
          </Option>
        </Options>
      </Model>
    </ModelWrapper>
  );
}

export default GameAnswerModel;
