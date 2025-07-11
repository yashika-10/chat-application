const username = localStorage.getItem('username');
if (!username) window.location.href = 'index.html';

document.getElementById('user-name').textContent = `Hi, ${username}`;

const socket = io();
socket.emit('register', username);

const form = document.getElementById('chat-form');
const input = document.getElementById('message');
const messages = document.getElementById('messages');
const typingDiv = document.getElementById('typing');

const emojiBtn = document.getElementById('emoji-toggle');
const emojiPicker = document.querySelector('emoji-picker');
const logoutBtn = document.getElementById('logout');

const messageSound = new Audio('https://www.soundjay.com/button/beep-07.wav');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit('chat message', {
      username: username,
      message: input.value.trim()
    });
    input.value = '';
    socket.emit('typing', false);
  }
});

input.addEventListener('input', () => {
  socket.emit('typing', input.value.length > 0);
});

emojiBtn.addEventListener('click', () => {
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
});

emojiPicker.addEventListener('emoji-click', (event) => {
  const emoji = event.detail.unicode;
  input.value += emoji;
  emojiPicker.style.display = 'none';
});

socket.on('chat message', function (msg) {
  const item = document.createElement('div');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
  messageSound.play();
});

socket.on('typing', function (user) {
  typingDiv.textContent = user ? `${user} is typing...` : '';
});

socket.on('notify', function (msg) {
  const note = document.createElement('div');
  note.textContent = msg;
  note.style.color = 'gray';
  note.style.fontStyle = 'italic';
  messages.appendChild(note);
  messages.scrollTop = messages.scrollHeight;
});

logoutBtn.addEventListener('click', function () {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
});
