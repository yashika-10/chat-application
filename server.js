const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const path = require('path');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  let userName = '';

  socket.on('register', (name) => {
    userName = name;
    io.emit('notify', `${name} joined the chat`);
  });

  socket.on('chat message', ({ username, message }) => {
    io.emit('chat message', `${username}: ${message}`);
  });

  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('typing', isTyping ? userName : '');
  });

  socket.on('disconnect', () => {
    if (userName) {
      io.emit('notify', `${userName} has left the chat`);
    }
  });
});

http.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
