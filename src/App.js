import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import styled, { ThemeProvider } from 'styled-components';
import { HomeView, PlayView, CreateView, JoinView, LobbyView } from './views';
import { THEME } from './config';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.lightblue};

  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <ThemeProvider theme={THEME}>
      <Container>
        <Router>
          <Switch>
            <Route path='/play' exact component={PlayView} />
            <Route path='/lobby' exact component={LobbyView} />
            <Route path='/create' exact component={CreateView} />
            <Route path='/join' exact component={JoinView} />
            <Route path='/' exact component={HomeView} />
          </Switch>
        </Router>
        <ToastContainer position="top-center" autoClose={4000} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
