import { createSlice } from '@reduxjs/toolkit';
import * as socket from '../socket';

export const game_slice = createSlice({
  name: 'room',
  initialState: {
    state_status: '', // '' | 'between' | 'in'
    state: '', // '' | 'character-choosing' | '',
    error: null
  },
  reducers: {
    set_error: (state, { payload: error }) => ({ ...state, error }),
    beginning_character_picking: state => ({ ...state, state_status: 'between' }),
    begin_character_picking: state => ({ ...state, state_status: 'in', state: 'character-choosing' })
  }
});

const SA = game_slice.actions;

export const begin_character_picking = callback => dispatch => {
  dispatch(SA.beginning_character_picking());
  socket.emit('lobby:start-character-stage', {}, ({ status, message }) => {
    dispatch(status === 'success' ? SA.begin_character_picking() : SA.set_error(message));
    callback({ status, message });
  });
}

export const begun_character_picking = () => dispatch => {
  dispatch(SA.begin_character_picking());
}

export default game_slice.reducer;
