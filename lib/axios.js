import axios from 'axios';

const API_BASE_URL = '/api';
const PUBLIC_AUTH_PATHS = ['/auth/send-otp', '/auth/verify-otp', '/auth/create-profile'];

const isPublicAuthPath = (url = '') =>
  PUBLIC_AUTH_PATHS.some((path) => url === path || url.endsWith(path));

const serializePayload = (data) => {
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    return Object.fromEntries(data.entries());
  }

  if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams) {
    return Object.fromEntries(data.entries());
  }

  return data;
};

const normalizeAxiosError = (error) => {
  if (error instanceof Error) {
    return error;
  }

  const message =
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.message ||
    (typeof error?.toString === 'function' ? error.toString() : null) ||
    'Request failed';

  const wrappedError = new Error(message);
  wrappedError.name = 'AxiosRequestError';
  wrappedError.response = error?.response;
  wrappedError.config = error?.config;
  wrappedError.originalError = error;

  return wrappedError;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor - attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    if (isPublicAuthPath(config.url)) {
      if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
      return config;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeAxiosError(error))
);

// Response interceptor - handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const normalizedError = normalizeAxiosError(error);
    const originalRequest = normalizedError.config;

    if (
      normalizedError.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicAuthPath(originalRequest?.url)
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(normalizedError);
        }

        const formData = new FormData();
        formData.append('refresh_token', refreshToken);

        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, formData);
        const { access_token, refresh_token } = res.data;

        localStorage.setItem('access_token', access_token);
        if (refresh_token) localStorage.setItem('refresh_token', refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const wrappedRefreshError = normalizeAxiosError(refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(wrappedRefreshError);
      }
    }

    return Promise.reject(normalizedError);
  }
);

export default axiosInstance;
