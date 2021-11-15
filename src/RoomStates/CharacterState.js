const RoomState = require('./RoomState');

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'

class CharacterState extends RoomState {
  constructor(room) {
    super(room);
    this.characters = new WeakMap();
  }

  apply_listeners(socket, is_host) {
    this.listeners.apply(socket, 'lobby:choose-character', ({ character }, callback) => {
      if (character.split('').some(c => !alphabet.includes(c))) {
        return callback({ status: 'fail', message: 'Character name must be alphanumeric' });
      }

      this.characters.set(socket, character);
      callback({ status: 'success', message: 'Character chosen' })
    });
  }
}

module.exports = CharacterState;
