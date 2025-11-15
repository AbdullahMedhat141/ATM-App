/**
 * Base API service for making HTTP requests
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://690868602d902d0651b02a38.mockapi.io/api/v1';

export async function get(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP error! status: ${response.status}${errorText ? `: ${errorText}` : ''}`);
    }
    return await response.json();
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
}

export async function post(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
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
    throw error;
  }
}

export async function put(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
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
    throw error;
  }
}

export async function del(endpoint) {
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
