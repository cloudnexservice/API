// API Configuration
// Handles environment-based API URL configuration for development and production
// In development, use localhost backend; in production, use HTTPS domain

// Determine the API base URL based on the environment
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === "development") {
    // Development: use localhost backend
    return process.env.REACT_APP_API_URL || "http://localhost:8080";
  } else {
    // Production: use HTTPS domain (e.g., with Cloudflare)
    // Make sure the domain is set in .env.production as REACT_APP_API_URL
    // This ensures no mixed-content issues (HTTPS frontend → HTTPS backend)
    return process.env.REACT_APP_API_URL || window.location.origin;
  }
};

export const API_BASE_URL = getApiBaseUrl();
export const API_ENDPOINTS = {
  USERS: "/api/users",
  HEALTH_CHECK: "/user"
};

console.log(`⚙️ API Configuration: ${API_BASE_URL}`);
