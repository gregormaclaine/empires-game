import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger'

import room from './room_slice';
import game from './game_slice';

export default configureStore({
  reducer: { room, game },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(createLogger({ collapsed: true }))
});
