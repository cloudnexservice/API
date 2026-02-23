// API Service for user management
// Centralized axios-based API calls for CRUD operations

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "./config.js";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// API Methods for Users
export const userAPI = {
  // Fetch all users
  getAll: async () => {
    try {
      console.log(`📤 Fetching users from ${API_BASE_URL}${API_ENDPOINTS.USERS}`);
      const response = await apiClient.get(API_ENDPOINTS.USERS);
      console.log("✅ Users fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching users:", error.message);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  // Create a new user
  create: async (userData) => {
    try {
      console.log(`📤 Creating user:`, userData);
      const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
      console.log("✅ User created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating user:", error.message);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // Update an existing user
  update: async (userId, userData) => {
    try {
      console.log(`📤 Updating user ${userId}:`, userData);
      const response = await apiClient.put(`${API_ENDPOINTS.USERS}/${userId}`, userData);
      console.log("✅ User updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating user ${userId}:`, error.message);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  // Delete a user
  delete: async (userId) => {
    try {
      console.log(`📤 Deleting user ${userId}`);
      const response = await apiClient.delete(`${API_ENDPOINTS.USERS}/${userId}`);
      console.log("✅ User deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting user ${userId}:`, error.message);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  },

  // Health check (existing endpoint)
  healthCheck: async () => {
    try {
      console.log(`📤 Health check: ${API_BASE_URL}${API_ENDPOINTS.HEALTH_CHECK}`);
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_CHECK);
      console.log("✅ Health check passed:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Health check failed:", error.message);
      throw error;
    }
  }
};

export default apiClient;
