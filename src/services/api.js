import axios from "axios";

const API = axios.create({
  baseURL: "https://wallet-buddy-nuor.onrender.com",
});

// 🔥 Add interceptor (AUTO attach token)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 📥 APIs
export const getExpenses = () => API.get("/expenses");
export const addExpense = (data) => API.post("/expenses", data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);

// existing analytics
export const getAnalytics = () => API.get("/analytics/categories");
export const getSmartAnalytics = () => API.get("/analytics/smart");

// 🔥 NEW (daily + monthly)
export const getDailyAnalytics = () => API.get("/analytics/daily");
export const getMonthlyTotal = () => API.get("/analytics/monthly");

export default API;