const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const { PORT } = require('./config');
const GameManager = require('./GameManager');

app.get('/', (req, res) => {
  res.send('Empires Game Server');
});

const game_manager = new GameManager({ io });

io.on('connection', socket => {
  console.log(`socket<${socket.id.slice(0, 6)}> has connected`);

  socket.on('lobby:create-game', ({ player_name, config }, callback) => {
    const room_code = game_manager.create_new_game({ player_name, socket, config });
    const players = [{ name: player_name, id: socket.id, host: true }];
    callback({ status: 'success', room_code, players });
  });

  socket.on('lobby:join-game', ({ room_code, player_name }, callback) => {
    const room = game_manager.get_room(room_code);
    if (!room) return callback({ status: 'fail', message: 'No room found' });

    const { error, players } = room.add_player({ player_name, socket }) || {};
    if (error) return callback({ status: 'fail', message: error });
    callback({ status: 'success', players });
  });

  socket.on('disconnect', () => {
    console.log(`socket<${socket.id.slice(0, 6)}> has disconnected`)
    const room = game_manager.get_room_from_socket(socket);
    if (room) room.remove_player({ socket })
  })
});

server.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
