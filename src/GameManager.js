const Room = require('./Room');

function random_code() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array(6).fill(0).map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

class GameManager {
  constructor({ io }) {
    this.io = io;
    this.rooms = {};
  }

  create_new_game({ player_name, socket, config }) {
    let room_code = random_code();
    while (this.rooms[room_code]) room_code = random_code();

    const collapse = () => {
      delete this.rooms[room_code];
      console.log(`room<${room_code}> has collapsed`)
    }
    this.rooms[room_code] = new Room({ io: this.io, room_code, player_name, socket, config, collapse });

    console.log(`socket<${socket.id.slice(0, 6)}> (${player_name}) has created room<${room_code}>`);
    return room_code;
  }

  get_room(room_code) {
    return this.rooms[room_code] || null;
  }

  get_room_from_socket(socket) {
    const entry = Object.entries(this.rooms).find(([code, room]) => room.sockets.includes(socket));
    return entry ? entry[1] : null;
  }
}

module.exports = GameManager;
