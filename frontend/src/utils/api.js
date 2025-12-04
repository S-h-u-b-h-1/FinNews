import axios from 'axios';
import { API_BASE_URL } from '../config/env';

const API_URL = API_BASE_URL + "/api";

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
