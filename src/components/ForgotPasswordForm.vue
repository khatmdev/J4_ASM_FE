<template>
  <div class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">Quên Mật Khẩu</h3>
              <p class="text-muted text-center mb-4">
                Nhập địa chỉ email của bạn để nhận hướng dẫn đặt lại mật khẩu.
              </p>
              <form @submit.prevent="handleSubmit" class="was-validated">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="email"
                      placeholder="Nhập địa chỉ email"
                      required
                  />
                  <div class="invalid-feedback">Vui lòng nhập địa chỉ email hợp lệ.</div>
                </div>
                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span v-else>Gửi yêu cầu</span>
                </button>
              </form>
              <div class="mt-4 text-center">
                <router-link to="/login" class="text-decoration-none">Quay lại trang đăng nhập</router-link>
              </div>
              <div v-if="message" :class="['mt-3 alert', messageType === 'success' ? 'alert-success' : 'alert-danger']">
                {{ message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/api/api.js";

export default {
  data() {
    return {
      email: "",
      loading: false,
      message: null,
      messageType: null,
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.message = null;
      try {
        const response = await apiClient.post("/forgot-password", { email: this.email });
        this.message = response.data.message;
        this.messageType = "success";
      } catch (error) {
        this.message = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
        this.messageType = "danger";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
