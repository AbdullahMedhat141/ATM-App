/**
 * Base API service for making HTTP requests
 * Includes fallback to localStorage for testing without API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://YOUR_MOCKAPI_ID.mockapi.io/api/v1';
const USE_MOCK_API = API_BASE_URL.includes('YOUR_MOCKAPI_ID') || !API_BASE_URL.includes('mockapi.io');

// LocalStorage fallback for testing
const STORAGE_KEY = 'atm_app_data';

function getLocalStorageData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setLocalStorageData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Initialize mock data if not exists
function initializeMockData() {
  const data = getLocalStorageData();
  if (!data.users) {
    data.users = {
      '2': {
        id: '2',
        balance: 1600,
        transactions: [
          {
            id: 1,
            type: 'Deposit',
            amount: 100,
            currency: 'ILS',
            date: new Date().toISOString(),
          },
        ],
      },
    };
    setLocalStorageData(data);
  }
  return data;
}

/**
 * Makes a GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} Response data
 */
export async function get(endpoint) {
  // Use localStorage fallback if API not configured
  if (USE_MOCK_API) {
    const data = initializeMockData();
    const match = endpoint.match(/\/users\/(\d+)/);
    if (match) {
      const userId = match[1];
      const user = data.users[userId];
      if (user) {
        return Promise.resolve(user);
      }
      // Return default user if not found
      return Promise.resolve({
        id: userId,
        balance: 0,
        transactions: [],
      });
    }
    return Promise.resolve(null);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP error! status: ${response.status}${errorText ? `: ${errorText}` : ''}`);
    }
    return await response.json();
  } catch (error) {
    console.error('GET request failed:', error);
    // Fallback to localStorage on network error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.warn('Falling back to localStorage due to network error');
      const data = initializeMockData();
      const match = endpoint.match(/\/users\/(\d+)/);
      if (match) {
        const userId = match[1];
        return data.users[userId] || { id: userId, balance: 0, transactions: [] };
      }
    }
    throw error;
  }
}

/**
 * Makes a POST request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Data to send
 * @returns {Promise<any>} Response data
 */
export async function post(endpoint, data) {
  if (USE_MOCK_API) {
    // For localStorage, POST is handled differently
    return Promise.resolve(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      // Check if it's a limit error
      if (response.status === 429 || response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'You have reached the maximum limit allowed by the mock API.');
      }
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP error! status: ${response.status}${errorText ? `: ${errorText}` : ''}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('POST request failed:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return Promise.resolve(data);
    }
    throw error;
  }
}

/**
 * Makes a PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Data to send
 * @returns {Promise<any>} Response data
 */
export async function put(endpoint, data) {
  if (USE_MOCK_API) {
    // Update localStorage
    const storageData = getLocalStorageData();
    const match = endpoint.match(/\/users\/(\d+)/);
    if (match) {
      const userId = match[1];
      if (!storageData.users) storageData.users = {};
      storageData.users[userId] = { ...storageData.users[userId], ...data };
      setLocalStorageData(storageData);
      return Promise.resolve(storageData.users[userId]);
    }
    return Promise.resolve(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP error! status: ${response.status}${errorText ? `: ${errorText}` : ''}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('PUT request failed:', error);
    // Fallback to localStorage on network error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.warn('Falling back to localStorage due to network error');
      const storageData = getLocalStorageData();
      const match = endpoint.match(/\/users\/(\d+)/);
      if (match) {
        const userId = match[1];
        if (!storageData.users) storageData.users = {};
        storageData.users[userId] = { ...storageData.users[userId], ...data };
        setLocalStorageData(storageData);
        return storageData.users[userId];
      }
    }
    throw error;
  }
}

/**
 * Makes a DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} Response data
 */
export async function del(endpoint) {
  if (USE_MOCK_API) {
    // For localStorage, just return success
    return Promise.resolve({ success: true });
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP error! status: ${response.status}${errorText ? `: ${errorText}` : ''}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error;
  }
}
