import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://car-rental-backend.adaptable.app",
});

export default axiosInstance;
