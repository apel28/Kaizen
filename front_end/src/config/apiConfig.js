// Frontend API Configuration
// Automatically selects the correct API base URL based on environment

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV 
    ? 'http://localhost:5001'  // Development: backend on port 5001
    : `${window.location.origin}` // Production: same domain as frontend
);

export const API_ENDPOINTS = {
  signup: `${API_BASE_URL}/api/signup`,
  signin: `${API_BASE_URL}/api/signin`,
  dashboard: `${API_BASE_URL}/api/dashboard`,
  profile: `${API_BASE_URL}/api/profile`,
  appointment: `${API_BASE_URL}/api/appointment`,
  experience: `${API_BASE_URL}/api/experience`,
  qualification: `${API_BASE_URL}/api/qualification`,
  availability: `${API_BASE_URL}/api/availability`,
  prescription: `${API_BASE_URL}/api/prescription`,
  patientData: `${API_BASE_URL}/api/patient-data`,
  testOrders: `${API_BASE_URL}/api/test-orders`,
  testReports: `${API_BASE_URL}/api/test-reports`,
  notifications: `${API_BASE_URL}/api/notifications`,
  admin: `${API_BASE_URL}/api/admin`,
};
