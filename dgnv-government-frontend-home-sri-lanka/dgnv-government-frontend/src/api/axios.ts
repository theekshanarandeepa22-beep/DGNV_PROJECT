import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9095",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
