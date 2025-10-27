import axios, { type AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message?: string;
  messages?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleSuccess = (response: any) => response;

export const handleError = (error: AxiosError) => {
  let errorMessage = "Ocorreu um erro desconhecido.";

  if (axios.isAxiosError(error) && error.response) {
    const responseData = error.response.data as ApiErrorResponse;

    if (responseData.messages) {
      const firstErrorKey = Object.keys(responseData.messages)[0];
      errorMessage = responseData.messages[firstErrorKey];
    } else if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error) {
      errorMessage = responseData.error;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  toast.error(errorMessage);

  return Promise.reject(error);
};