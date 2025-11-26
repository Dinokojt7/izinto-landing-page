// src/lib/api/axios-client.js
import axios from "axios";

// Use our Next.js API route as proxy to avoid CORS
const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api" // Client-side: use relative path to our API routes
    : process.env.API_BASE_URL ||
      "https://gregarious-marshmallow-0b7661.netlify.app/.netlify/functions/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`,
    );
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ Response received: ${response.status} from ${response.config.url}`,
    );
    return response;
  },
  (error) => {
    // More detailed error logging
    console.error("❌ API Error Details:", {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      },
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      },
    });

    return Promise.reject(error);
  },
);

export default apiClient;
