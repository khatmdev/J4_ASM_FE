import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import ProfilePage from "@/components/ProfilePage.vue";
import FavoritesPage from "@/components/FavoritesPage.vue";
import ChangePasswordForm from "@/components/ChangePasswordForm.vue";
import ForgotPasswordForm from "@/components/ForgotPasswordForm.vue";
import VideoDetails from "@/components/VideoDetails.vue";
import { useUserStore } from "@/stores/userStore";

// Admin Components
import AdminDashboard from "@/components/admin/NavbarAdmin.vue";
import ManageUsers from "@/components/admin/ManageUsers.vue";
import ManageVideos from "@/components/admin/ManageVideos.vue";
import AdminReports from "@/components/admin/AdminReports.vue";

const requireAuth = (to, from, next) => {
    const userStore = useUserStore();
    if (!userStore.isLoggedIn) {
        userStore.showLoginModal = true; // Hiển thị modal yêu cầu đăng nhập
        next(false); // Dừng điều hướng
    } else {
        next(); // Tiếp tục nếu đã đăng nhập
    }
};

const requireAdmin = (to, from, next) => {
    const userStore = useUserStore();
    if (!userStore.isLoggedIn || !userStore.isAdmin) {
        next({ name: "Home" }); // Điều hướng về trang chủ nếu không phải admin
    } else {
        next(); // Tiếp tục nếu là admin
    }
};

const routes = [
    // Public Routes
    { path: "/", name: "Home", component: HomePage },
    { path: "/login", name: "Login", component: LoginForm },
    { path: "/register", name: "Register", component: RegisterForm },
    { path: "/forgot-password", name: "ForgotPassword", component: ForgotPasswordForm },
    {
        path: "/video/:id",
        name: "VideoDetails",
        component: VideoDetails,
        props: (route) => ({
            id: route.params.id,
            email: route.query.email,
        }),
    },
    // Authenticated User Routes
    {
        path: "/profile",
        name: "Profile",
        component: ProfilePage,
        beforeEnter: requireAuth,
    },
    {
        path: "/user-favorites",
        name: "Favorites",
        component: FavoritesPage,
        beforeEnter: requireAuth,
    },
    {
        path: "/change-password",
        name: "ChangePassword",
        component: ChangePasswordForm,
        beforeEnter: requireAuth,
    },
    // Admin Routes
    {
        path: "/admin",
        name: "AdminDashboard",
        component: AdminDashboard,
        beforeEnter: requireAdmin,
    },
    {
        path: "/admin/manage-users",
        name: "ManageUsers",
        component: ManageUsers,
        beforeEnter: requireAdmin,
    },
    {
        path: "/admin/manage-videos",
        name: "ManageVideos",
        component: ManageVideos,
        beforeEnter: requireAdmin,
    },
    {
        path: "/admin/reports",
        name: "AdminReports",
        component: AdminReports,
        beforeEnter: requireAdmin,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Reset modal khi người dùng thay đổi route
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (userStore.showLoginModal) {
        userStore.closeModal(); // Tắt modal khi route thay đổi
    }
    next();
});

export default router;
