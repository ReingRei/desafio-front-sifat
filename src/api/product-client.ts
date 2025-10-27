import axios from 'axios';
import { handleError, handleSuccess } from './api-interceptor';
import { API_BASE_URL } from '../config/data-source';

const baseURL = API_BASE_URL;

const productApiClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
});

productApiClient.interceptors.response.use(handleSuccess, handleError);

export default productApiClient;