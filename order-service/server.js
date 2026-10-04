const express = require('express');

const app = express();

app.use(express.json());

const orders = [
  {
    id: 1,
    userId: 1,
    product: 'Клавиатура',
    amount: 2500
  }
];

app.get('/orders/:id', async (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find(order => order.id === id);

  if (!order) {
    return res.status(404).json({
      error: 'Order not found'
    });
  }

  const startTime = Date.now();

  try {
    const response = await fetch(`http://localhost:3000/users/${order.userId}`);

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return res.status(503).json({
        error: 'User Service unavailable',
        userServiceStatus: response.status,
        userServiceResponseTimeMs: responseTime
      });
    }

    const user = await response.json();

    res.json({
      ...order,
      user,
      userServiceResponseTimeMs: responseTime
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    res.status(503).json({
      error: 'User Service unavailable',
      userServiceResponseTimeMs: responseTime
    });
  }
});

app.post('/orders', (req, res) => {
  const { userId, product, amount } = req.body;

  const order = {
    id: orders.length + 1,
    userId,
    product,
    amount
  };

  orders.push(order);

  res.status(201).json(order);
});

app.listen(3001, () => {
  console.log('Order Service запущен на http://localhost:3001');
});