// Load environment variables
// If VITE_API_BASE_URL is set (e.g. https://api.example.com) use it.
// Otherwise default to a relative `/api` path so the frontend will call
// the same origin when served from the backend (recommended for single-host deploys).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
