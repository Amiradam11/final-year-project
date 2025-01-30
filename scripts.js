// scripts.js

function navigateTo(feature) {
  switch (feature) {
    case 'summarize':
      window.location.href = 'summarize.html'; // Redirect to summarize page
      break;
    case 'quiz':
      window.location.href = 'quiz.html'; // Redirect to quiz page
      break;
    case 'chat':
      window.location.href = 'chat.html'; // Redirect to chat page (if you create this page)
      break;
    case 'index':
      window.location.href = 'index.html'; // Redirect to dashboard
      break;
    default:
      console.error('Unknown feature:', feature);
  }
}



document.getElementById('registrationForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    alert('Registration successful! Redirecting to login...');
    window.location.href = 'login.html';
  } else {
    const error = await response.json();
    alert(error.message);
  }
});




document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token); // Save token for authentication
    alert('Login successful! Redirecting to dashboard...');
    window.location.href = 'dashboard.html';
  } else {
    const error = await response.json();
    alert(error.message);
  }
});
