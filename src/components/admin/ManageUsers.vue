<template>
  <div class="container my-4">
    <h1 class="text-center">User Management</h1>

    <!-- Thông báo phản hồi -->
    <div v-if="message" :class="`alert ${messageType}`" role="alert">
      {{ message }}
    </div>

    <!-- Form Thêm/Sửa User -->
    <form @submit.prevent="saveUser" class="mb-4">
      <div class="mb-3">
        <label for="id" class="form-label">ID:</label>
        <input
            v-model="userForm.id"
            type="text"
            id="id"
            class="form-control"
            :disabled="isEdit"
        />
      </div>
      <div class="mb-3">
        <label for="fullname" class="form-label">Full Name:</label>
        <input
            v-model="userForm.fullname"
            type="text"
            id="fullname"
            class="form-control"
            required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
            v-model="userForm.email"
            type="email"
            id="email"
            class="form-control"
            required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input
            v-model="userForm.password"
            type="text"
            id="password"
            class="form-control"
            :required="!isEdit.value"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Role:</label>
        <div>
          <div class="form-check">
            <input
                v-model="userForm.admin"
                type="radio"
                id="roleAdmin"
                class="form-check-input"
                :value="true"
            />
            <label for="roleAdmin" class="form-check-label">Admin</label>
          </div>
          <div class="form-check">
            <input
                v-model="userForm.admin"
                type="radio"
                id="roleUser"
                class="form-check-input"
                :value="false"
            />
            <label for="roleUser" class="form-check-label">User</label>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary me-2">
        {{ isEdit ? "Update" : "Create" }}
      </button>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        Cancel
      </button>
    </form>

    <!-- Bảng Người Dùng -->
    <table class="table table-hover">
      <thead class="table-light">
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>Full Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ users.indexOf(user) + 1 }}</td>
        <td>{{ user.id }}</td>
        <td>{{ user.fullname }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.admin ? "Admin" : "User" }}</td>
        <td>
          <button
              class="btn btn-warning btn-sm me-2"
              @click="editUser(user)"
          >
            Edit
          </button>
          <button
              class="btn btn-danger btn-sm"
              @click="deleteUser(user.id)"
          >
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Điều Khiển Phân Trang -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <button
          class="btn btn-outline-primary"
          @click="previousPage"
          :disabled="currentPage === 1"
      >
        Previous
      </button>
      <span>Page {{ currentPage}} of {{ totalPages }}</span>
      <button
          class="btn btn-outline-primary"
          @click="nextPage"
          :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import apiClient from "@/api/api.js";

export default {
  setup() {
    const users = ref([]);
    const userForm = ref({
      id: "",
      fullname: "",
      email: "",
      password: "",
      admin: false,
    });
    const isEdit = ref(false);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const message = ref("");
    const messageType = ref("");

    const fetchUsers = () => {
      apiClient
          .get(`/admin/users?page=${currentPage.value}`)
          .then((response) => {
            users.value = response.data.list;
            totalPages.value = response.data.totalPages;
          })
          .catch(() => {
            showMessage("Error fetching users.", "alert-danger");
          });
    };

    const saveUser = () => {
      const apiCall = isEdit.value
          ? apiClient.put(`/admin/users/${userForm.value.id}`, userForm.value)
          : apiClient.post(`/admin/users`, userForm.value);

      apiCall
          .then(() => {
            showMessage(
                `User ${isEdit.value ? "updated" : "created"} successfully.`,
                "alert-success"
            );
            fetchUsers();
            resetForm();
          })
          .catch(() => {
            showMessage("Error saving user.", "alert-danger");
          });
    };

    const deleteUser = (userId) => {
      apiClient
          .delete(`/admin/users/${userId}`)
          .then(() => {
            showMessage("User deleted successfully.", "alert-success");
            fetchUsers();
          })
          .catch(() => {
            showMessage("Error deleting user.", "alert-danger");
          });
    };

    const editUser = (user) => {
      userForm.value = { ...user };
      isEdit.value = true;
    };

    const resetForm = () => {
      userForm.value = {
        id: "",
        fullname: "",
        email: "",
        password: "",
        admin: false,
      };
      isEdit.value = false;
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchUsers();
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchUsers();
      }
    };

    const showMessage = (msg, type) => {
      message.value = msg;
      messageType.value = type;
      setTimeout(() => (message.value = ""), 3000);
    };

    fetchUsers();

    return {
      users,
      userForm,
      isEdit,
      currentPage,
      totalPages,
      message,
      messageType,
      fetchUsers,
      saveUser,
      deleteUser,
      editUser,
      resetForm,
      previousPage,
      nextPage,
      showMessage,
    };
  },
};
</script>
