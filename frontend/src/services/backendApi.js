import axios from "axios";

// Default to deployed Vercel backend in production, or localhost in development
const defaultBackendUrl = import.meta.env.DEV
  ? "http://localhost:8080"
  : "https://vaultbackend.vercel.app";

const backendBaseUrl = (import.meta.env.VITE_BACKEND_URL || defaultBackendUrl).replace(/\/$/, "");

const backendApi = axios.create({
  baseURL: backendBaseUrl,
});

export default backendApi;
