import axios from "axios";

// Định nghĩa baseURL cho API
const API_BASE_URL = "http://localhost:8000/api";

// Cấu hình axios mặc định
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Hàm đăng nhập
export const loginUser = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi kết nối server!";
    }
};

// 🔹 Thêm API đăng ký
export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post("/auth/register", { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi đăng ký!";
    }
};

// Xuất API để dùng ở nhiều nơi
export default api;
