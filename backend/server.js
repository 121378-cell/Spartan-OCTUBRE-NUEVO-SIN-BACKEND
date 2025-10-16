const express = require('express');
const planRoutes = require('./routes/planRoutes');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// A sample root endpoint
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

// Use the plan routes, which handle /plan/asignar and /plan/compromiso
app.use('/plan', planRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});