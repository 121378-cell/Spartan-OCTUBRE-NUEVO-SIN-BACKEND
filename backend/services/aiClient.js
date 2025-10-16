const axios = require('axios');

// The URL for the AI service. When running with Docker Compose,
// 'synergycoach_ia' is the hostname for the AI service container.
const AI_SERVICE_URL = 'http://synergycoach_ia:8000/predict_alert';

/**
 * Calls the AI inference service to check for a red alert based on input data.
 *
 * @param {object} data The input data for the model.
 * @returns {Promise<object>} A promise that resolves to an object containing the alert status.
 */
async function CheckInferenciaIA(data) {
  try {
    const response = await axios.post(AI_SERVICE_URL, data, {
      timeout: 5000,
    });
    return { AlertaRoja: response.data.AlertaRoja };
  } catch (error) {
    console.error('AI Service call failed:', error.message);
    // Fallback mechanism
    return { AlertaRoja: false };
  }
}

module.exports = { CheckInferenciaIA };