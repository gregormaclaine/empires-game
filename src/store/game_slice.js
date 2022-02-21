import { createSlice } from '@reduxjs/toolkit';
import * as socket from '../socket';

export const game_slice = createSlice({
  name: 'room',
  initialState: {
    state_status: '', // '' | 'between' | 'in'
    state: '', // '' | 'character-choosing' | 'game',
    character: null,
    empires: [],
    error: null
  },
  reducers: {
    set_error: (state, { payload: error }) => ({ ...state, error }),
    beginning_character_picking: state => ({ ...state, state_status: 'between' }),
    begin_character_picking: state => ({ ...state, state_status: 'in', state: 'character-choosing' }),
    chosen_character: (state, { payload: character }) => ({ ...state, character, state_status: 'between' }),
    start_game: state => ({ ...state, state: 'game', state_status: 'in', empires: [] }),
    update_empires: (state, { payload: empires }) => ({ ...state, empires })
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

export const submit_character_name = character => dispatch => {
  socket.emit('character:choose-character', { character }, ({ status, message }) => {
    dispatch(status === 'success' ? SA.chosen_character(character) : SA.set_error(message));
  });
}

export const game_starting = () => dispatch => {
  dispatch(SA.start_game());
}

export const update_empires = empires => dispatch => {
  dispatch(SA.update_empires(empires));
}

export default game_slice.reducer;
