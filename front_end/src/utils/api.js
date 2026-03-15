// Minimum configuration for server connection
const API_BASE_URL = "http://localhost:5001/api";

/**
 * Optimized helper for API requests
 * Handles common fetch boilerplate and error catching
 */
export const apiRequest = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
};
