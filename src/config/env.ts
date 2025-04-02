// Environment Configuration

// API Base URL with fallback to localhost if not set
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Other environment variables can be added here as needed
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
