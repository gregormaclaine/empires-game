import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components';

const ButtonWrapper = styled.div`
  width: min-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 5vh;
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
`;

function HomeView() {
  return (
    <ButtonWrapper>
      <ButtonLink to='/join'>
        <Button yellow>
          <span>Join a Game</span>
        </Button>
      </ButtonLink>
      <ButtonLink to='/create'>
        <Button>
          <span>Create a New Game</span>
        </Button>
      </ButtonLink>
    </ButtonWrapper>
  );
}

export default HomeView;
