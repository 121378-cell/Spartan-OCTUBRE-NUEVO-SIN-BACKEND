const axios = require('axios');

// The URL for the AI service running in the Docker container.
const AI_SERVICE_URL = 'http://localhost:8000/predict_alert';

/**
 * Calls the AI inference service to check for a red alert based on input data.
 *
 * @param {object} data The input data for the model. Expected to be in the format
 *                      required by the AI service's PredictionRequest, e.g.,
 *                      { features: [[1.0, 2.0, 3.0, 4.0]] }.
 * @returns {Promise<object>} A promise that resolves to an object containing
 *                            the alert status, e.g., { AlertaRoja: true }.
 */
async function CheckInferenciaIA(data) {
  try {
    // Make a POST request to the AI service's prediction endpoint.
    const response = await axios.post(AI_SERVICE_URL, data, {
      // Set a timeout to prevent the application from hanging indefinitely.
      timeout: 5000, // 5 seconds
    });

    // The AI service returns a JSON object like { "AlertaRoja": true }
    return { AlertaRoja: response.data.AlertaRoja };

  } catch (error) {
    // Log the error for debugging purposes.
    console.error('AI Service call failed:', error.message);

    // If the request fails (e.g., timeout, network error, AI service is down),
    // implement the fallback mechanism.
    // This ensures the main application can continue to function.
    return { AlertaRoja: false };
  }
}

module.exports = { CheckInferenciaIA };