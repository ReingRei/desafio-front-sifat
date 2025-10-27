import axios from 'axios';
import { handleError, handleSuccess } from './api-interceptor';
import { VITE_API_INVENTORY_BASE_URL } from '../config/data-source';

const baseURL = VITE_API_INVENTORY_BASE_URL;

const inventoryApiClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
});

inventoryApiClient.interceptors.response.use(handleSuccess, handleError);

export default inventoryApiClient;