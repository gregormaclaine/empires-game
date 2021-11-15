const RoomState = require('./RoomState');

class GameState extends RoomState {
  constructor(room, params) {
    super(room);
    this.characters = params.characters;
  }

  apply_listeners(socket, is_host) {
    
  }
}

module.exports = GameState;
