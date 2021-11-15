import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import styled, { ThemeProvider } from 'styled-components';
import { THEME } from './config';
import { ChooseCharacterView, CreateView, GameView, HomeView, JoinView, LobbyView } from './views';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.lightblue};

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

function App() {
  return (
    <ThemeProvider theme={THEME}>
      <Container>
        <Router>
          <Switch>
            <Route path='/game' exact component={GameView} />
            <Route path='/choose-character' exact component={ChooseCharacterView} />
            <Route path='/lobby' exact component={LobbyView} />
            <Route path='/create' exact component={CreateView} />
            <Route path='/join' exact component={JoinView} />
            <Route path='/' exact component={HomeView} />
            <Route>
              <Redirect to='/' />
            </Route>
          </Switch>
        </Router>
        <ToastContainer position="top-center" autoClose={4000} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
