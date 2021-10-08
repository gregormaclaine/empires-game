class Room {
  constructor({ io, room_code, player_name, socket, config, collapse }) {
    this.io = io;
    this.room_code = room_code;
    this.host = socket.id;
    this.config = config;
    this.collapse = collapse;
    this.player_names = new WeakMap();
    this.socket_listeners_closers = new WeakMap();

    socket.join(this.socket_room);
    this.sockets = [socket];
    this.player_names.set(socket, player_name);
    this.apply_socket_listeners({ socket, host: true });
  }

  get socket_room() {
    return 'room-' + this.room_code;
  }

  get_players() {
    return this.sockets.map(socket => ({ 
      name: this.player_names.get(socket),
      id: socket.id,
      host: socket.id === this.host
    }));
  }

  add_player({ player_name, socket }) {
    if (this.get_players().some(p => player_name === p.name))
      return { error: 'Name is already taken' };
    
    socket.join(this.socket_room);
    this.sockets.push(socket);
    this.player_names.set(socket, player_name);
    this.apply_socket_listeners({ socket, host: false });

    // Update other clients on new user join
    const players = this.get_players();
    socket.to(this.socket_room).emit('lobby:update-players', { players });

    console.log(`socket<${socket.id.slice(0, 6)}> (${player_name}) has joined room<${this.room_code}>`);
    return { players };
  }

  remove_player({ socket, from_disconnect }) {
    if (!this.sockets.includes(socket)) throw new Error("Can't remove socket from room it's not in");
    
    this.sockets.splice(this.sockets.indexOf(socket), 1);
    this.player_names.delete(socket);

    if (!from_disconnect) {
      // When disconnecting, the socket is automatically removed from all rooms
      socket.leave(this.socket_room);
      this.remove_socket_listeners({ socket });
    }

    if (this.sockets.length === 0) return this.collapse();

    // Update other clients on user leaving
    const players = this.get_players();
    this.io.to(this.socket_room).emit('lobby:update-players', { players });

    console.log(`socket<${socket.id.slice(0, 6)}> has left room<${this.room_code}>`);
  }

  apply_socket_listener(socket, event, listener) {
    socket.on(event, listener);
    const closer = () => socket.off(event, listener);

    if (this.socket_listeners_closers.has(socket)) {
      const closers = [...this.socket_listeners_closers.get(socket), closer]
      this.socket_listeners_closers.set(socket, closers);
    } else {
      this.socket_listeners_closers.set(socket, [closer]);
    }
  }

  apply_socket_listeners({ socket, host }) {
    if (host) {
      this.apply_socket_listener(socket, 'lobby:kick-player', ({ id }) => {
        const s = this.sockets.find(s => s.id === id);
        if (s) {
          this.remove_player({ socket: s });
          s.emit('lobby:kicked', { message: 'You were kicked by the host' });
        }
      });
    }
    this.apply_socket_listener(socket, 'lobby:leave', () => this.remove_player({ socket }))
  }

  remove_socket_listeners({ socket }) {
    const closers = this.socket_listeners_closers.get(socket);
    if (closers) closers.forEach(c => c());
  }
}

module.exports = Room;
