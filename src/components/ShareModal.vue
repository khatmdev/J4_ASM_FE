<template>
  <div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="shareVideo">
          <div class="modal-header">
            <h5 class="modal-title">Chia sẻ qua Email</h5>
            <button
                type="button"
                class="btn-close"
                @click="$emit('close')"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="email" class="form-label"
              >Email của bạn:</label
              >
              <input
                  type="text"
                  id="email"
                  v-model="this.$props.email"
                  class="form-control"
                  readonly
              />
            </div>
            <div class="mb-3">
              <label for="recipientEmails" class="form-label"
              >Danh sách email người nhận</label
              >
              <input
                  type="text"
                  id="recipientEmails"
                  v-model="recipientEmails"
                  placeholder="Nhập email, phân cách bởi dấu phẩy ','"
                  class="form-control"
                  required
              />
            </div>
            <div class="mb-3">
              <label for="appPassword" class="form-label"
              >Gmail App Password</label
              >
              <input
                  type="password"
                  id="appPassword"
                  v-model="appPassword"
                  placeholder="Nhập mật khẩu ứng dụng Gmail"
                  class="form-control"
                  required
              />
              <small class="form-text text-muted">
                * Đây là mật khẩu ứng dụng đặc biệt, không phải mật khẩu chính của Gmail. Bạn có thể tạo App Password
                trong
                <a href="https://myaccount.google.com/security" target="_blank">
                  Google Account Security
                </a>
                bằng cách bật xác minh 2 bước.
              </small>
            </div>
          </div>
          <div class="modal-footer">
            <button
                type="button"
                class="btn btn-secondary"
                @click="$emit('close')"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FavoriteService from "@/api/favorites.js";

export default {
  props: ["videoId", "email"],
  data() {
    return {
      recipientEmails: "",
      appPassword: "",
    };
  },
  methods: {
    async shareVideo() {
      try {
        await FavoriteService.shareVideo(
            this.videoId,
            this.recipientEmails,
            this.appPassword
        );
        alert("Video shared successfully!");
        this.$emit("close");
      } catch (error) {
        console.error("Error sharing video:", error);
        alert("Failed to share video.");
      }
    },
  },
};
</script>
