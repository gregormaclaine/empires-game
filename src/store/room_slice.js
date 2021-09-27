import { createSlice } from '@reduxjs/toolkit';
import * as socket from '../socket';

export const room_slice = createSlice({
  name: 'room',
  initialState: {
    status: '', // '' | 'joining' | 'joined',
    error: null,
    players: [],
    code: null,
    is_host: false
  },
  reducers: {
    set_error: (state, { payload: error }) => ({ ...state, error }),
    joining_game: state => ({ ...state, status: 'joining' }),
    creating_game: state => ({ ...state, status: 'joining', is_host: true }),
    joined_game: (state, { payload: { room_code, players } }) => {
      return { ...state, status: 'joined', code: room_code, players };
    },
    update_players: (state, { payload: players }) => ({ ...state, players })
  }
});

const SA = room_slice.actions;

export const create_game = player_name => dispatch => {
  dispatch(SA.creating_game());
  socket.emit('lobby:create-game', { player_name, config: {} }, ({ status, message, room_code, players }) => {
    dispatch(status === 'success' ? SA.joined_game({ room_code, players }) : SA.set_error(message));
  });
}

export const join_game = (player_name, room_code) => dispatch => {
  dispatch(SA.joining_game());
  socket.emit('lobby:join-game', { player_name, room_code }, ({ status, message, room_code, players }) => {
    dispatch(status === 'success' ? SA.joined_game({ room_code, players }) : SA.set_error(message));
  });
}

export const update_players = players => dispatch => dispatch(SA.update_players(players));

export default room_slice.reducer;
