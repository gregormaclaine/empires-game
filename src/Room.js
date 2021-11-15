const ListenerCollection = require('./ListenerCollection');
const LobbyRoomState = require('./RoomStates/RoomState');
const ChooseCharacterState = require('./RoomStates/CharacterState');
const GameState = require('./RoomStates/GameState');

class Room {
  static ROOM_STATE_CODES = {
    lobby: LobbyRoomState,
    characters: ChooseCharacterState,
    game: GameState
  }

  constructor({ io, room_code, player_name, socket, config, collapse }) {
    this.io = io;
    this.room_code = room_code;
    this.host = socket.id ;
    this.config = config;
    this.collapse = collapse;
    this.player_names = new WeakMap();

    this.listeners = new ListenerCollection();

    socket.join(this.socket_room);
    this.sockets = [socket];
    this.player_names.set(socket, player_name);
    this.apply_listeners({ socket, host: true });

    this.state = new LobbyRoomState(this);
    this.state.apply_listeners(socket, true);
  }

  // ########## GENERAL FUNCTIONS ##########
  get socket_room() {
    return 'room-' + this.room_code;
  }

  // Get socket name for console logging
  sn(socket) {
    const name = this.player_names.get(socket);
    return `socket<${socket.id.slice(0, 6)}>${name ? ` (${name})` : ''}`;
  }

  get_players() {
    return this.sockets.map(socket => ({ 
      name: this.player_names.get(socket),
      id: socket.id,
      host: socket.id === this.host
    }));
  }

  // ########## ADD & REMOVE SOCKETS ##########
  add_player({ player_name, socket }) {
    if (this.get_players().some(p => player_name === p.name))
      return { error: 'Name is already taken' };
    
    socket.join(this.socket_room);
    this.sockets.push(socket);
    this.player_names.set(socket, player_name);
    this.apply_listeners({ socket });
    this.state.apply_listeners(socket)

    // Update other clients on new user join
    const players = this.get_players();
    socket.to(this.socket_room).emit('lobby:update-players', { players });

    console.log(`${this.sn(socket)} has joined room<${this.room_code}>`);
    return { players };
  }

  remove_player({ socket, from_disconnect }) {
    if (!this.sockets.includes(socket)) throw new Error("Can't remove socket from room it's not in");
    
    this.sockets.splice(this.sockets.indexOf(socket), 1);
    this.player_names.delete(socket);

    if (!from_disconnect) {
      // When disconnecting, the socket is automatically removed from all rooms
      socket.leave(this.socket_room);
      this.listeners.remove_socket({ socket });
    }

    if (this.sockets.length === 0) return this.collapse();

    // Update other clients on user leaving
    const players = this.get_players();
    this.io.to(this.socket_room).emit('lobby:update-players', { players });

    console.log(`${this.sn(socket)} has left room<${this.room_code}>`);
  }

  // ########## SOCKET LISTENERS HANDLERS ##########
  apply_listeners({ socket, host }) {
    if (host) {
      this.listeners.apply(socket, 'lobby:kick-player', ({ id }) => {
        const s = this.sockets.find(s => s.id === id);
        if (s) {
          this.remove_player({ socket: s });
          s.emit('lobby:kicked', { message: 'You were kicked by the host' });
        }
      });
    }
    this.listeners.apply(socket, 'lobby:leave', () => this.remove_player({ socket }));
  }

  // ########## ROOM STATE MANAGEMENT ##########
  change_state(room_state, params) {
    const NewRoomState = Room.ROOM_STATE_CODES[room_state];
    if (!NewRoomState) throw new Error(`Can't change room to non-existing state: '${room_state}'`);

    if (this.state) this.state.leave();
    this.state = new NewRoomState(this, params);
  }
}

module.exports = Room;
