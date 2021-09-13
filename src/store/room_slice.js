import { createSlice } from '@reduxjs/toolkit';
import * as socket from '../socket';

export const room_slice = createSlice({
  name: 'room',
  initialState: {
    status: '', // '' | 'joining' | 'joined',
    error: null,
    players: [],
    code: null
  },
  reducers: {
    set_error: (state, error) => void (state.error = error),
    joining_game: state => void (state.status = 'joining'),
    joined_game: (state, {payload: { room_code, players }}) => {
      return { ...state, status: 'joined', code: room_code, players };
    }
  }
});

const { set_error, joining_game, joined_game } = room_slice.actions;

export const create_game = player_name => dispatch => {
  dispatch(joining_game());
  socket.emit('lobby:create-game', { player_name, config: {} }, ({ status, message, room_code, players }) => {
    dispatch(status === 'success' ? joined_game({ room_code, players }) : set_error(message));
  });
}

export default room_slice.reducer;
