const express = require('express');
const app = express();

// Middleware (optional)
app.use(express.json());

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

module.exports = app;
