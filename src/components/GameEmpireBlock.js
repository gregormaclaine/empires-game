import styled from 'styled-components';
import { shade } from 'color-helpers';
import { useSelector } from 'react-redux';

const BlockWrapper = styled.div`
  min-width: 25vw;
  max-width: calc(33vw - 2em);
  flex-grow: 1;
  min-height: 25em;
  height: 40vh;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 1em;
  margin: 3em;
  background-color: #${props => shade(props.theme.lightblue, 0.2)};
  border-radius: 10px;

  @media (max-width: 768px) {
    min-width: 80vw;
    max-width: 80vw;
    min-height: 30vh;

    margin: 1em 0;
    padding: 0.5em 1em;
  }

  ${props => props.hoverable ? `
    cursor: pointer;
    &:hover {
      background-color: #${shade(props.theme.lightblue, 0.1)};
    }
  ` : ''}
`;

const BlockTitle = styled.h1`
  text-align: center;
  width: 100%;
`;

const SubjectsContainer = styled.div``;

const Subject = styled.p`
  font-weight: 600;
`;

function GameEmpireBlock({ empire, onClick, hoverable }) {
  const room = useSelector(state => state.room);

  function to_name(id) {
    return room.players.find(p => p.id === id)?.name || <i>Unknown</i>;
  }

  return (
    <BlockWrapper onClick={onClick} hoverable={hoverable}>
      <BlockTitle>{to_name(empire.emperor)}'s Empire</BlockTitle>
      <SubjectsContainer>
        {empire.subjects.map(subject => (
          <Subject key={subject.id}>
            <span>{to_name(subject.id)}</span>
            <span>was</span>
            <span>{subject.character}</span>
          </Subject>
        ))}
      </SubjectsContainer>
    </BlockWrapper>
  );
}

export default GameEmpireBlock;
