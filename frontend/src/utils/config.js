// Конфигурация API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  VACANCIES: `${API_BASE_URL}/api/vacancies`,
  AREAS: `${API_BASE_URL}/api/areas`,
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL; 