import axios from "axios";

const apiClient = axios.create({
    baseURL: "/api", // Cập nhật URL đúng với backend
    withCredentials: true, // Để hỗ trợ Access-Control-Allow-Credentials
    headers: {
        "Content-Type": "application/json",
    },
});

// Axios interceptor để thêm token vào header của tất cả các yêu cầu
apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('jwtToken'); // Lấy JWT từ localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
