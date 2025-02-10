<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" :to="'/'">Online Entertainment</router-link>
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
        <ul class="navbar-nav ms-auto">
          <!-- Link Video Yêu Thích với biểu tượng trái tim -->
          <li class="nav-item">
            <router-link
                class="nav-link"
                :to="'/user-favorites'"
                @click.prevent="checkLogin"
            >
              <i class="fas fa-heart"></i> Video yêu thích
            </router-link>
          </li>

          <!-- Dropdown Tài khoản của tôi với biểu tượng người dùng -->
          <li class="nav-item dropdown">
            <a
                class="nav-link dropdown-toggle"
                href="#"
                id="accountDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
              <i class="fas fa-user"></i> Tài khoản của tôi
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
              <li>
                <router-link class="dropdown-item" :to="'/profile'" @click.prevent="checkLogin">
                  Thông tin tài khoản
                </router-link>
              </li>
              <li v-if="!isLoggedIn">
                <router-link class="dropdown-item" :to="'/login'">Đăng nhập</router-link>
              </li>
              <li v-if="isLoggedIn">
                <router-link class="dropdown-item" :to="'/change-password'" @click.prevent="checkLogin">
                  Đổi mật khẩu
                </router-link>
              </li>
              <li v-if="!isLoggedIn">
                <router-link class="dropdown-item" :to="'/forgot-password'" @click.prevent="checkLogin">
                  Quên mật khẩu
                </router-link>
              </li>
              <li v-if="!isLoggedIn">
                <router-link class="dropdown-item" :to="'/register'">Đăng ký</router-link>
              </li>
              <li v-if="isLoggedIn">
                <hr class="dropdown-divider" />
                <router-link class="dropdown-item" :to="'/logout'" @click.prevent="logout">
                  Đăng xuất
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
import { computed } from 'vue';
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

export default {
  name: "NavbarComponent",
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const isLoggedIn = computed(() => userStore.isLoggedIn);
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
      isLoggedIn,
      checkLogin,
      logout,
    };
  },
};
</script>

<style scoped>
.navbar {
  padding-top: 10px;
  padding-bottom: 20px;
}
</style>
