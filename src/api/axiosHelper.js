import axios from 'axios';
import { useDispatch } from 'react-redux';

// Debug config
const BasicInfo = {
  isDebug: true, // Set to false in production
};

// Axios instance without default Content-Type
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/user',
  timeout: 10000,
});

// Request interceptor (adds token + handles Content-Type)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Only set Content-Type if not sending FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    BasicInfo.isDebug && console.log('Axios Error:', error);
    return Promise.reject(error);
  }
);

// Main hook with helper methods
const useAxiosHelper = () => {
  const dispatch = useDispatch();

  const AxiosGet = async (endPoint) => {
    try {
      const response = await axiosInstance.get(endPoint);
      BasicInfo.isDebug && console.log(`${endPoint} [GET]`, response);
      return response.data;
    } catch (error) {
      handleError(error, endPoint);
    }
  };

  const AxiosPost = async (endPoint, body) => {
    try {
      const response = await axiosInstance.post(endPoint, body);
      BasicInfo.isDebug && console.log(`${endPoint} [POST]`, response);
      return response.data;
    } catch (error) {
      handleError(error, endPoint);
    }
  };

  const AxiosPut = async (endPoint, body) => {
    try {
      const response = await axiosInstance.put(endPoint, body);
      BasicInfo.isDebug && console.log(`${endPoint} [PUT]`, response);
      return response.data;
    } catch (error) {
      handleError(error, endPoint);
    }
  };

  const AxiosDelete = async (endPoint) => {
    try {
      const response = await axiosInstance.delete(endPoint);
      BasicInfo.isDebug && console.log(`${endPoint} [DELETE]`, response);
      return response.data;
    } catch (error) {
      handleError(error, endPoint);
    }
  };

  // Central error handling
  const handleError = (error, path) => {
    BasicInfo.isDebug && console.log(`${path} = `, error);

    const isLoginPath = path?.includes("/login");

    if (!isLoginPath && error?.response?.data?.code === 419) {
      console.warn('Token expired. Redirect to login.');
      // Optional: dispatch logout / token expired handler
    }

    throw error;
  };

  return {
    AxiosGet,
    AxiosPost,
    AxiosPut,
    AxiosDelete,
  };
};

export default useAxiosHelper;
