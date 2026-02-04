const rawUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Standardize URL to always end with /api
export const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
