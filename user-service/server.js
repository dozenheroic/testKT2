const express = require('express');

const app = express();

app.use(express.json());

const users = [
  {
    id: 1,
    name: 'Анастасия',
    email: 'anastasia@example.com'
  },
  {
    id: 2,
    name: 'Иван',
    email: 'ivan@example.com'
  }
];

app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  res.json(user);
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;

  const user = {
    id: users.length + 1,
    name,
    email
  };

  users.push(user);

  res.status(201).json(user);
});

app.listen(3000, () => {
  console.log('User Service запущен на http://localhost:3000');
});