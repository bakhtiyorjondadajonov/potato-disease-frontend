import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const pingBackend = async () => {
  try {
    const res = await api.get("/ping");
    return res.status === 200;
  } catch {
    return false;
  }
};

export const predictPotato = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/predict", formData);
  return res.data;
};

export const analyzePlant = async (plantType, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/analyze/${plantType}`, formData);
  return res.data;
};

export const getSeverity = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/severity", formData);
  return res.data;
};

export const getAdvice = async (disease, confidence, plantType = "potato") => {
  const res = await api.post("/advice", {
    disease,
    confidence,
    plant_type: plantType,
  });
  return res.data;
};

export const getCropCalendar = async (disease, confidence, season = "current", location = "general", plantType = "potato") => {
  const res = await api.post("/crop-calendar", {
    disease,
    confidence,
    season,
    location,
    plant_type: plantType,
  });
  return res.data;
};

export default api;
