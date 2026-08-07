import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Crucial for sending and receiving cookies
});

// Optionally, add response interceptors for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
