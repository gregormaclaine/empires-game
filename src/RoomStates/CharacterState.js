const RoomState = require('./RoomState');

class CharacterState extends RoomState {
  constructor(room, params) {
    super(room);
    this.characters = new WeakMap();
  }

  get choosers_left() {
    return this.room.sockets.reduce((acc, cur) => acc + !this.characters.has(cur), 0);
  }

  apply_listeners(socket, is_host) {
    this.listeners.apply(socket, 'lobby:choose-character', ({ character }, callback) => {
      this.characters.set(socket, character);
      callback({ status: 'success', message: 'Character chosen' });
      console.log(`${this.room.sn(socket)} has selected their character: '${character}'. ${this.choosers_left} users left...`);

      if (this.choosers_left === 0) {
        console.log(`Emitting event to begin the game`);
        this.room.io.to(this.room.socket_room).emit('lobby:game_starting');
        this.room.change_state('game', { characters: this.characters });
      }
    });
  }
}

module.exports = CharacterState;
