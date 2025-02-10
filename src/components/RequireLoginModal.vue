<template>
  <div v-if="isVisible" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">Yêu cầu đăng nhập</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Bạn cần đăng nhập để thực hiện thao tác này.</p>
          <router-link to="/register" class="text-primary" @click="closeModal">Bạn chưa có tài khoản? Đăng ký tại đây.</router-link>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
          <router-link to="/login" class="btn btn-primary" @click="closeModal">Đăng nhập</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore";

export default {
  name: "RequireLoginModal",
  computed: {
    isVisible() {
      const userStore = useUserStore();
      return !userStore.token && userStore.showLoginModal; // Kiểm tra nếu chưa có token và modal cần hiển thị
    },
  },
  methods: {
    closeModal() {
      const userStore = useUserStore();
      userStore.closeModal(); // Đóng modal
    },
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
