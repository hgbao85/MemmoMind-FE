import axios from "axios";

// 🔹 Base URL của API
const API_BASE_URL = "https://memmomindbe-test-jgcl.onrender.com/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});



// ✅ Thêm Interceptor để tự động gửi token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Token gửi đi:", config.headers.Authorization);
    } else {
        console.warn("❌ Không có token, có thể yêu cầu sẽ bị lỗi 401!");
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 🔹 Hàm đăng nhập
export const loginUser = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });

        // ✅ Lưu token vào localStorage sau khi đăng nhập thành công
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
            console.log("✅ Token đã được lưu vào localStorage:", response.data.token);
        } else {
            console.warn("❌ Không nhận được token từ server!");
        }

        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi kết nối server!";
    }
};

// 🔹 API đăng ký
export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post("/auth/register", { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi đăng ký!";
    }
};

// 🔹 API Reset Password
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await api.post("/auth/reset-password", { token, newPassword });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi đặt lại mật khẩu!";
    }
};


// 🔹 API Forgot Password
export const forgotPassword = async (email) => {
    try {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi gửi yêu cầu khôi phục mật khẩu!";
    }
};

export default api;
