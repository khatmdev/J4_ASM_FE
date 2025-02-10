<script>
import authService from '@/api/auth';

export default {
  data() {
    return {
      user: {
        username: '',
        fullname: '',
        email: '',
        password: '',
      },
      repassword: '',
      errorMessage: '',
      passwordError: '', // Thông báo lỗi xác nhận mật khẩu
    };
  },
  methods: {
    validatePasswords() {
      if (this.user.password !== this.repassword) {
        this.passwordError = 'Mật khẩu xác nhận không khớp.';
        return false;
      }
      this.passwordError = '';
      return true;
    },
    async register() {
      if (!this.validatePasswords()) {
        return; // Không gửi form nếu mật khẩu không hợp lệ
      }
      try {
        const response = await authService.post(this.user);
        alert(response.data.message);
        this.$router.push('/login'); // Chuyển hướng đến trang login
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
  },
};
</script>

<template>
  <div class="bg-light-subtle d-flex align-items-center justify-content-center">
    <div class="container text-light mt-5">
      <div class="col d-flex justify-content-center">
        <div class="col-sm-6 blur border border-secondary rounded p-4">
              <h2 class="text-center">Đăng ký</h2>
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input v-model="user.username" type="text" id="username" class="form-control"
                     placeholder="Nhập Username"
                     required />
            </div>
            <div class="mb-3">
              <label for="fullname" class="form-label">Họ và Tên</label>
              <input v-model="user.fullname" type="text" id="fullname" class="form-control"
                     placeholder="Nhập họ tên đầy đủ"
                     required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input v-model="user.email" type="email" id="email" class="form-control"
                     placeholder="Nhập Địa chỉ email hợp lệ (name@example.com)"
                     required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <input v-model="user.password" type="password" id="password" class="form-control"
                     placeholder="Nhập mật khẩu"
                     required />
            </div>
            <div class="mb-3">
              <label for="repassword" class="form-label">Xác nhận mật khẩu</label>
              <input v-model="repassword" type="password" id="repassword" class="form-control"
                     placeholder="Nhập lại mật khẩu"
                     required />
              <div v-if="passwordError" class="text-danger mb-3">
                {{ passwordError }}
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Đăng ký</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-light-subtle {
  background: url('@/assets/img/leaf_autumn.jpg') no-repeat center center fixed;
  background-size: cover;
  height: 92.5vh;
}

.blur{
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}
</style>
