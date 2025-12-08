import axios from 'axios';
import { API_BASE_URL } from '../config/env';

// Ensure API_URL ends with `/api` exactly once. `VITE_API_BASE_URL` may be
// configured as a host (e.g. `http://localhost:5002`) or as a path (`/api`).
let API_URL = API_BASE_URL || ''
API_URL = API_URL.replace(/\/$/, '')
if (!API_URL.endsWith('/api')) API_URL = API_URL + '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// News API
export const getNews = async (params = {}) => {
  try {
    const response = await api.get('/news', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getNewsById = async (id) => {
  try {
    const response = await api.get(`/news/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with id ${id}:`, error);
    throw error;
  }
};

export const createNews = async (newsData) => {
  try {
    const response = await api.post('/news', newsData);
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const updateNews = async (id, newsData) => {
  try {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  } catch (error) {
    console.error(`Error updating news with id ${id}:`, error);
    throw error;
  }
};

export const deleteNews = async (id) => {
  try {
    await api.delete(`/news/${id}`);
  } catch (error) {
    console.error(`Error deleting news with id ${id}:`, error);
    throw error;
  }
};

export const clapNews = async (id) => {
  try {
    const response = await api.post(`/news/${id}/clap`);
    return response.data;
  } catch (error) {
    console.error(`Error clapping for news with id ${id}:`, error);
    throw error;
  }
};

// Comments API
export const getComments = async (newsId) => {
  try {
    const response = await api.get(`/news/${newsId}/comments`)
    return response.data
  } catch (error) {
    console.error(`Error fetching comments for news ${newsId}:`, error)
    throw error
  }
}

export const createComment = async (newsId, data) => {
  try {
    const response = await api.post(`/news/${newsId}/comments`, data)
    return response.data
  } catch (error) {
    console.error(`Error creating comment for news ${newsId}:`, error)
    throw error
  }
}

export const updateComment = async (commentId, data) => {
  try {
    const response = await api.put(`/comments/${commentId}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error)
    throw error
  }
}

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error)
    throw error
  }
}
