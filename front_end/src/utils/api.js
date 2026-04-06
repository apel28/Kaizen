import { API_BASE_URL } from "../config/apiConfig";

export { API_BASE_URL };

const buildUrl = (endpoint) => {
  // If it's already a full URL, use it as-is
  if (endpoint.startsWith("http")) {
    return endpoint;
  }
  
  // Ensure endpoint starts with /api
  const path = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

export const apiPost = async (endpoint, data) => {
  try {
    const url = buildUrl(endpoint);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      const msg =
        result.error ||
        result.message ||
        response.statusText ||
        "Something went wrong";
      throw new Error(msg);
    }

    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
};

export const apiGet = async (endpoint) => {
  try {
    const url = buildUrl(endpoint);
    
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unauthorized");
    }

    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
};

export const apiPut = async (endpoint, data) => {
  try {
    const url = buildUrl(endpoint);
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

export const apiDelete = async (endpoint) => {
  try {
    const url = buildUrl(endpoint);
    
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
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
