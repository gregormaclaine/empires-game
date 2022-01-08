const ListenerCollection = require('../ListenerCollection');

class RoomState {
  constructor(room, params) {
    this.room = room;
    this.listeners = new ListenerCollection();

    this.room.sockets.forEach(socket => {
      this.apply_listeners(socket, socket.id === this.room.host);
    });
  }

  leave() {
    this.room.sockets.forEach(socket => {
      this.listeners.remove_socket({ socket });
    });
  }

  apply_listeners(socket, is_host) {
    if (is_host) {
      this.listeners.apply(socket, 'lobby:start-character-stage', ({}, callback) => {
        this.room.change_state('characters', {});
        socket.to(this.room.socket_room).emit('character:choose-character');
        callback({ status: 'success' });
      });
    }
  }
}

module.exports = RoomState;
