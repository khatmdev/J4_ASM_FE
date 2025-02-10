import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: sessionStorage.getItem('jwtToken') || null, // Lưu trữ token thay vì thông tin user
        showLoginModal: false, // Trạng thái hiển thị modal
        admin: sessionStorage.getItem('isAdmin') === 'true', // Trạng thái quyền admin
    }),
    getters: {
        isLoggedIn: (state) => !!state.token, // Kiểm tra trạng thái đăng nhập bằng token
        getUsername: (state) => {
            if (!state.token) return "Guest";
            try {
                const payload = JSON.parse(atob(state.token.split(".")[1])); // Giải mã JWT
                return payload.sub || "User"; // Lấy username từ payload
            } catch {
                return "User";
            }
        },
        isAdmin: (state) => state.admin,
    },
    actions: {
        login(token) {
            this.token = token; // Lưu token vào store
            sessionStorage.setItem('jwtToken', token); // Lưu token vào sessionStorage
            this.showLoginModal = false; // Ẩn modal sau khi đăng nhập
        },
        logout() {
            this.token = null; // Xóa token khỏi store
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('jwtToken'); // Xóa token khỏi sessionStorage
            this.admin = false;
        },
        closeModal() {
            this.showLoginModal = false; // Đóng modal thủ công
        },
        setAdminStatus(status) {
            this.admin = status; // Cập nhật state
            sessionStorage.setItem('isAdmin', status); // Cập nhật sessionStorage
        },

    },
});
