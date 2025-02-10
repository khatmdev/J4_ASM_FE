import apiClient from './api';

export default {
    login(credentials) {
        return apiClient.post('/login', credentials); // Gửi thông tin đăng nhập và nhận token
    },

    register(user) {
        return apiClient.post('/register', user);
    },
};
