const RoomState = require('./RoomState');

class CharacterState extends RoomState {
  constructor(room, params) {
    super(room);
    this.characters = new WeakMap();
  }

  get choosers_left() {
    return this.room.sockets.reduce((acc, cur) => acc + !this.characters.has(cur), 0);
  }

  get characters_list() {
    const characters = this.room.sockets.map(s => this.characters.get(s));
    return characters.sort(() => Math.random() - 0.5);
  }

  apply_listeners(socket, is_host) {
    this.listeners.apply(socket, 'character:choose-character', ({ character }, callback) => {
      if (this.characters.has(socket)) return callback({ status: 'fail', message: 'Character has already been chosen' });

      this.characters.set(socket, character);
      callback({ status: 'success', message: 'Character chosen' });
      console.log(`${this.room.sn(socket)} has selected their character: '${character}'. ${this.choosers_left} users left...`);

      if (this.choosers_left === 0) {
        console.log(`All players have submitted their characters`);
        this.room.io.to(this.room.host).emit('character:show-characters', { characters: this.characters_list });
      }
    });

    if (is_host) {
      this.listeners.apply(socket, 'character:shown-characters', (_, callback) => {
        if (this.choosers_left !== 0) return callback({ status: 'fail', message: 'Not all players have chosen their character' });
        console.log(`Character list has been shown; Emitting event to begin the game`);
        this.room.io.to(this.room.socket_room).emit('character:game-starting');
        this.room.change_state('game', { characters: this.characters });
      });
    }
  }
}

module.exports = CharacterState;
