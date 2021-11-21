const RoomState = require('./RoomState');
const EmpiresTracker = require('../EmpiresTracker');

class GameState extends RoomState {
  constructor(room, params) {
    super(room);
    this.characters = params.characters;

    this.empires = new EmpiresTracker(this);
    const empires = this.empires.get_empires_state();

    this.waiting_state = 'target'; // 'target' | 'answer'

    const rand_index = Math.floor(Math.random() * this.room.sockets.length);
    this.asking_socket = this.room.sockets[rand_index];
    this.asked_socket = null;

    setTimeout(() => this.asking_socket.emit('game:choose-target'), 1000);
  }

  apply_listeners(socket, is_host) {
    this.listeners.apply(socket, 'game:chosen-target', ({ player }, callback) => {
      if (this.asking_socket.id !== socket.id)
        return callback({ status: 'fail', message: 'It is not your turn' });

      if (this.waiting_state !== 'target')
        return callback({ status: 'fail', message: 'The targetted player has already been chosen' });

      if (socket.id === player)
        return callback({ status: 'fail', message: 'You cannot ask yourself' });

      this.asked_socket = this.room.sockets.find(s => s.id === player) || null;
      if (!this.asked_socket)
        return callback({ status: 'fail', message: 'Could not find player' });

      console.log(`${this.room.sn(socket)} has chosen to ask ${this.room.sn(this.asked_socket)}`);
      this.waiting_state = 'answer';
      this.asked_socket.emit('game:make-response', { asker: socket.id });
      callback({ status: 'success', message: 'Successfully chose player to ask' });
    });

    this.listeners.apply(socket, 'game:made-response', ({ correct }, callback) => {
      if (this.waiting_state !== 'answer')
        return callback({ status: 'fail', message: 'The targetted player is still being chosen' });

      if (this.asked_socket.id !== socket.id)
        return callback({ status: 'fail', message: 'It is not your turn' });

      console.log(`${this.room.sn(this.asking_socket)} ${correct ? '' : 'in'}correctly determined ${this.room.sn(socket)}'s character`);
      this.waiting_state = 'target';
      callback({ status: 'success', message: 'Successfully made response' });

      if (correct) {
        
        this.empires.perform_takeover(this.asking_socket.id, this.asked_socket.id);
        const empires = this.empires.get_empires_state();
        this.room.io.to(this.room.socket_room).emit('game:update-empires', { empires });

        const winner = this.empires.get_winner();
        if (winner) {
          this.room.io.to(this.room.socket_room).emit('game:game-ended', { winner });
          this.shutdown();
        }

      } else {

        this.asking_socket = this.asked_socket;
        this.asked_socket = null;
        this.asking_socket.emit('game:choose-target');

      }
    });

    this.listeners.apply(socket, 'game:request-update-empires', ({ }, callback) => {
      callback({ status: 'success', empires: this.empires.get_empires_state() });
    });
  }

  shutdown() {
    this.empires.parent = null;
    this.empires = null;
    this.room = null;
  }
}

module.exports = GameState;
