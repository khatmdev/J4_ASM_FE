<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-sm w-100" style="max-width: 500px;">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0 text-center">Edit Profile</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="updateProfile">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
                type="text"
                id="username"
                v-model="user.id"
                class="form-control"
                disabled
            />
          </div>

          <div class="mb-3">
            <label for="fullname" class="form-label">Full Name</label>
            <input
                type="text"
                id="fullname"
                v-model="user.fullname"
                class="form-control"
            />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
                type="email"
                id="email"
                v-model="user.email"
                class="form-control"
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
                type="password"
                id="password"
                v-model="user.password"
                class="form-control"
            />
          </div>

          <div class="mb-3">
            <label for="role" class="form-label">Role</label>
            <input
                type="text"
                id="role"
                v-model="user.admin"
                class="form-control"
                disabled
            />
          </div>

          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary">
              Update
            </button>
          </div>
        </form>

        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/api/api.js"; // API Client đã cấu hình axios

export default {
  data() {
    return {
      user: {
        id: "",
        fullname: "",
        email: "",
        password: "",
        admin: ""
      },
      errorMessage: "", // Thông báo lỗi
      successMessage: "", // Thông báo thành công
    };
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await apiClient.get("/profile");
        this.user = response.data;
        const role = this.user.admin ? 'Admin' : 'User';
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.handleError("You are not logged in. Please login first.");
        } else {
          this.handleError("Failed to load profile.");
        }
      }

    },

    async updateProfile() {
      this.resetMessages();

      try {
        // Kiểm tra email trùng
        const isEmailTaken = await this.checkEmailAvailability(this.user.email);
        if (isEmailTaken) {
          return this.handleError("Email is already taken. Please use a different email.");
        }

        await apiClient.put("/profile", this.user);
        this.handleSuccess("Profile updated successfully!");
      } catch (error) {
        this.handleError("Failed to update profile.");
      }
    },

    async checkEmailAvailability(email) {
      try {
        const response = await apiClient.get(`/profile/email-check?email=${email}`);
        return response.data.exists;
      } catch (error) {
        this.handleError("Error checking email availability.");
        return false;
      }
    },

    handleError(message) {
      this.errorMessage = message;
      this.successMessage = "";
    },

    handleSuccess(message) {
      this.successMessage = message;
      this.errorMessage = "";
    },

    resetMessages() {
      this.errorMessage = "";
      this.successMessage = "";
    },
  },

  created() {
    this.fetchProfile();
  },
};
</script>

<style scoped>
</style>
