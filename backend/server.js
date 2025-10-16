const express = require('express');
const planRoutes = require('./routes/planRoutes');
const { CheckInferenciaIA } = require('./services/aiClient');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

app.post('/check-risk', async (req, res) => {
  const data = req.body;
  if (!data || !data.features) {
    return res.status(400).json({ error: 'Invalid input. "features" are required.' });
  }
  const result = await CheckInferenciaIA(data);
  res.json(result);
});

app.use('/plan', planRoutes);

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});