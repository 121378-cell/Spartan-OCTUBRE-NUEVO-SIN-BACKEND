import axios from 'axios';

// Get the base URL from environment variables.
// Vite exposes env variables prefixed with VITE_ on the `import.meta.env` object.
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

/**
 * A pre-configured instance of axios for making API requests.
 * It includes the base URL and a global timeout.
 */
const apiClient = axios.create({
  // Set the base URL for all requests made with this instance.
  baseURL: BASE_API_URL,
  // Set the timeout to 3000 milliseconds (3 seconds) as per requirements.
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;