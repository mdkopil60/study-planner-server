const user = {
  email: 'demo@example.com',
  password: 'password123',
  name: 'Demo User'
};

fetch('http://localhost:5000/api/auth/sign-up/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:3000'
  },
  body: JSON.stringify(user)
})
.then(res => res.json())
.then(data => {
  console.log('Success:', data);
})
.catch(err => {
  console.error('Error:', err);
});
