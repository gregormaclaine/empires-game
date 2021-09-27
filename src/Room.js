class Room {
  constructor({ io, room_code, player_name, socket, config, collapse }) {
    this.io = io;
    this.room_code = room_code;
    this.host = socket.id;
    this.config = config;
    this.collapse = collapse;
    this.player_names = new WeakMap();

    socket.join(this.socket_room);
    this.sockets = [socket];
    this.player_names.set(socket, player_name);
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

    // Update other clients on new user join
    const players = this.get_players();
    socket.to(this.socket_room).emit('lobby:update-players', { players });

    console.log(`socket<${socket.id.slice(0, 6)}> (${player_name}) has joined room<${this.room_code}>`);

    return { players };
  }

  remove_player({ socket }) {
    if (!this.sockets.includes(socket)) throw new Error("Can't remove socket from room it's not in");
    
    this.sockets.splice(this.sockets.indexOf(socket), 1);
    this.player_names.delete(socket);

    if (this.sockets.length === 0) return this.collapse();

    // Update other clients on user leaving
    const players = this.get_players();
    this.io.to(this.socket_room).emit('lobby:update-players', { players });

    console.log(`socket<${socket.id.slice(0, 6)}> has left room<${this.room_code}>`);
  }
}

module.exports = Room;
