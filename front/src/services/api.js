// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,  // ✅ permite enviar cookies
});

// FLAG para evitar loops infinitos
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

// ✅ INTERCEPTOR RESPONSE
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    // Si ya intentamos refresh y volvió a fallar → logout
    if (err.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");

        isRefreshing = false;
        processQueue(null);

        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr, null);
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;