<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" :to="'/'">Admin Panel</router-link>
      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: isActive('/') }" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link"
                         :class="{ active: isActive('/user-favorites') }"
                         to="/user-favorites"> Favorites Video
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link"
                         :class="{ active: isActive('/admin/manage-videos') }"
                         to="/admin/manage-videos">Videos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link"
                         :class="{ active: isActive('/admin/manage-users') }"
                         to="/admin/manage-users">Users
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link"
                         :class="{ active: isActive('/admin/reports') }"
                         to="/admin/reports">Reports
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a
                class="nav-link dropdown-toggle"
                href="#"
                id="accountDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
              <i class="fas fa-user"></i> My Account
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
              <li>
                <router-link class="dropdown-item" :to="'/profile'" @click.prevent="checkLogin">
                  Account Info
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="'/change-password'" @click.prevent="checkLogin">
                  Change Password
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
                <router-link class="dropdown-item" :to="'/logout'" @click.prevent="logout">
                  Log Out
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

export default {
  name: "NavbarAdmin",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();
    // Kiểm tra đường dẫn hiện tại để đặt class "active"
    const isActive = (path) => route.path === path;

    const checkLogin = (event) => {
      if (!userStore.isLoggedIn) {
        event.preventDefault();
        userStore.showLoginModal = true; // Hiển thị modal đăng nhập
      }
    };
    const logout = () => {
      userStore.logout();
      router.push("/login"); // Điều hướng về trang đăng nhập
    };
    return {
      isActive,
      checkLogin,
      logout,
    };
  },
};
</script>

<style>
.nav-link.active {
  font-weight: bold;
  color: #0d6efd !important; /* Bootstrap primary color */
}
</style>
