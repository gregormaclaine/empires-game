import { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import styled, { ThemeProvider } from 'styled-components';
import { THEME } from './config';
import {
  ChooseCharacterView,
  CreateView,
  GameView,
  HomeView,
  JoinView,
  LobbyView
} from './views';
import * as socket from './socket';
import { useDispatch, useSelector } from 'react-redux';
import { leave_lobby } from './store/room_slice';

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
  const dispatch = useDispatch();
  const room = useSelector(state => state.room);

  useEffect(() => {
    const closers = [
      socket.listen('lobby:kicked', ({ message }) => {
        if (room.status !== 'joined') return;
        dispatch(leave_lobby());
        window.location.href = '/#/';
        toast.error(message);
      })
    ];
    return () => closers.map(c => c());
  });

  return (
    <ThemeProvider theme={THEME}>
      <Container>
        <Router>
          <Switch>
            <Route path='/game' exact component={GameView} />
            <Route
              path='/choose-character'
              exact
              component={ChooseCharacterView}
            />
            <Route path='/lobby' exact component={LobbyView} />
            <Route path='/create' exact component={CreateView} />
            <Route path='/join' exact component={JoinView} />
            <Route path='/' exact component={HomeView} />
            <Route>
              <Redirect to='/' />
            </Route>
          </Switch>
        </Router>
        <ToastContainer position='top-center' autoClose={4000} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
