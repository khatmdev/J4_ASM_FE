<script>
import authService from '@/api/auth';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'LoginForm',
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      },
      errorMessage: null,
    };
  },
  setup() {
    const userStore = useUserStore(); // Sử dụng Pinia store
    return { userStore };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await authService.login(this.credentials); // Gọi API để đăng nhập
        this.userStore.login(response.data.token); // Lưu token vào store
        this.userStore.setAdminStatus(response.data.role);
        alert('Đăng nhập thành công'); // Hiển thị thông báo thành công
        this.$router.push('/'); // Điều hướng về trang chủ
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
      }
    },
  },
};

</script>

<template>
  <div class="bg-light-subtle d-flex align-items-center justify-content-center">
    <div class="container text-light">
      <div class="row">
        <div class="col-sm-6 blur border border-secondary rounded p-3">
          <h2 class="text-center">Form Đăng Nhập</h2>
          <form @submit.prevent="handleLogin" class="was-validated">
            <div class="mb-3">
              <label class="form-label" for="username">Username</label>
              <input v-model="credentials.username" type="text" class="form-control" id="username"
                     placeholder="Nhập Username" required />
              <div class="valid-feedback">Hợp lệ</div>
              <div class="invalid-feedback">Vui lòng nhập Username</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="password">Mật Khẩu</label>
              <input v-model="credentials.password" type="password" class="form-control" id="password"
                     placeholder="Nhập mật khẩu" required />
              <div class="valid-feedback">Hợp lệ</div>
              <div class="invalid-feedback">Vui lòng điền vào trường này</div>
            </div>
            <div class="d-flex">
              <button type="submit" class="btn btn-success">Đăng Nhập</button>
              <router-link to="/forgot-password" class="ms-auto text-success">Quên mật khẩu?</router-link>
              <router-link to="/register" class="ms-auto text-success">Tạo tài khoản mới?</router-link>
            </div>
          </form>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-light-subtle {
  background: url('@/assets/img/bg-login.jpg') no-repeat center center fixed;
  background-size: cover;
  height: 92.5vh;
}

.blur{
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}
</style>