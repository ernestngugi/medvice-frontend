import axios from "axios";
import { BASE_URL } from "./environment";

const axiosBase = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getRequest = async (endpoint) => {
    try {
        const response = await axiosBase.get(endpoint);
        return response;
    } catch (error) {
      throw error.response.data.message || 'An error occurred';
    }
};

export const postRequest = async (endpoint, data) => {
    try {
      const response = await axiosBase.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error.response.data.message || 'An error occurred';
    }
  };

export const deleteRequest = async (endpoint) => {
    try {
        const response = await axiosBase.delete(endpoint);
        return response;
    } catch (error) {
      throw error.response.data.message || 'An error occurred';
    }
}

  export default axiosBase;