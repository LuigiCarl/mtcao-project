const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    // If the response is not OK, try to parse JSON error body safely
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      if (contentType.includes('application/json')) {
        const err = await response.json();
        throw new Error(err.message || `API Error: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - Non-JSON response: ${text.slice(0,200)}`);
    }

    // Successful response: ensure it's JSON before parsing
    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    throw new Error(`API returned non-JSON success response: ${text.slice(0,200)}`);
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      if (contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || `API Error: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - Non-JSON response: ${text.slice(0,200)}`);
    }

    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    throw new Error(`API returned non-JSON success response: ${text.slice(0,200)}`);
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      if (contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || `API Error: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - Non-JSON response: ${text.slice(0,200)}`);
    }

    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    throw new Error(`API returned non-JSON success response: ${text.slice(0,200)}`);
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      if (contentType.includes('application/json')) {
        const err = await response.json();
        throw new Error(err.message || `API Error: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - Non-JSON response: ${text.slice(0,200)}`);
    }

    if (contentType.includes('application/json')) {
      return response.json();
    }

    return { success: true };
  },
};

export default API_BASE_URL;
