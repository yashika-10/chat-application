document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  if (username) {
    localStorage.setItem('username', username);
    window.location.href = 'chat.html';
  }
});
