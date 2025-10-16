const express = require('express');
const planRoutes = require('./routes/planRoutes');
const { CheckInferenciaIA } = require('./services/aiClient');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// A sample root endpoint
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

// Endpoint to check for AI-driven risk alerts
app.post('/check-risk', async (req, res) => {
  const data = req.body;

  if (!data || !data.features) {
    return res.status(400).json({ error: 'Invalid input. "features" are required.' });
  }

  const result = await CheckInferenciaIA(data);
  res.json(result);
});

// Use the plan routes, which handle /plan/asignar and /plan/compromiso
app.use('/plan', planRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});