import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger'

import room from './room_slice';

export default configureStore({
  reducer: { room },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(createLogger({ collapsed: true }))
});
