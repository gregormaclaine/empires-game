import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { shade } from 'color-helpers';

const ButtonWrapper = styled.div`
  width: min-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 5vh;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;

  background-color: ${props => props.theme[props.yellow ? 'yellow' : 'green']};
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #${props => shade(props.theme[props.yellow ? 'yellow' : 'green'], -0.1)};
  }

  & > span {
    font-weight: 600;
    font-size: 2rem;
    color: ${props => props.theme.blue};
    text-shadow: 0.5px 0.5px 0 rgba(0, 0, 0, 0.2);
    white-space: nowrap;
  }
`;

function HomeView() {
  return (
    <ButtonWrapper>
      <Button to='/play' yellow>
        <span>Join a Game</span>
      </Button>
      <Button to='/create'>
        <span>Create a New Game</span>
      </Button>
    </ButtonWrapper>
  );
}

export default HomeView;
