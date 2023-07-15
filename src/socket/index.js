import io from 'socket.io-client';
import { SERVER_ADDRESS } from '../config';

let socket;

export const initialise = () => {
  socket = io(SERVER_ADDRESS);
  console.log(`Connecting socket...`);
};

export const id = () => socket.id;

export const disconnect = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};

export const emit = (event, data, callback) => {
  if (socket) socket.emit(event, data, callback);
};

export const listen = (event, listener) => {
  if (!socket) throw new Error('Cannot create listener due to no socket');
  socket.on(event, listener);
  return () => socket.off(event, listener);
};
