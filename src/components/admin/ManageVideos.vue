<template>
  <div class="container mt-4 mb-4">
    <h1 class="mb-4">Manage Videos</h1>

    <!-- Tabs navigation -->
    <ul class="nav nav-tabs" id="videoTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            :class="{ active: currentTab === 'edition' }"
            @click="currentTab = 'edition'"
        >
          VIDEO EDITION
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            :class="{ active: currentTab === 'list' }"
            @click="currentTab = 'list'"
        >
          VIDEO LIST
        </button>
      </li>
    </ul>

    <!-- Tabs content -->
    <div v-if="currentTab === 'edition'" class="tab-content mt-3">
      <form @submit.prevent="handleSave">
      <div class="row">
        <div class="col-md-6 text-center">
          <div class="border p-3">
            <div v-if="isValidYouTubeId === null">
              <h5 class="text-muted">POSTER</h5>
            </div>
            <div v-else-if="isValidYouTubeId === false">
              <h5 class="text-muted">ID không khớp</h5>
            </div>
            <div v-else>
              <img
                  :src="posterUrl"
                  alt="YouTube Poster"
                  class="img-fluid"
                  @error="handleImageError"
              />
            </div>
          </div>
        </div>

        <!-- Form fields -->
          <div class="col-md-6">
            <div class="mb-3">
              <label for="id" class="form-label">YouTube ID</label>
              <input
                  v-model="form.id"
                  type="text"
                  id="id"
                  class="form-control"
                  placeholder="Enter YouTube ID"
                  required
              />
            </div>
            <div class="mb-3">
              <label for="title" class="form-label">Video Title</label>
              <input
                  v-model="form.title"
                  type="text"
                  id="title"
                  class="form-control"
                  placeholder="Enter video title"
                  required
              />
            </div>
            <div class="mb-3">
              <label for="views" class="form-label">View Count</label>
              <input
                  v-model.number="form.views"
                  type="number"
                  id="views"
                  class="form-control"
                  min="0"
              />
            </div>
            <div class="mb-3">
              <label>Status</label><br />
              <div class="form-check form-check-inline">
                <input
                    v-model="form.active"
                    class="form-check-input"
                    type="radio"
                    id="active"
                    :value="true"
                />
                <label for="active" class="form-check-label">Active</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                    v-model="form.active"
                    class="form-check-input"
                    type="radio"
                    id="inactive"
                    :value="false"
                />
                <label for="inactive" class="form-check-label">Inactive</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea
                  v-model="form.description"
                  class="form-control"
                  id="description"
                  rows="3"
                  placeholder="Enter description"
              ></textarea>
            </div>
          </div>
        </div>
        <!-- Buttons -->
        <div class="text-end mt-3">
          <button type="submit" class="btn btn-success">
            {{ form.id && existingVideo ? "Update" : "Create" }}
          </button>
          <button type="button" @click="resetForm" class="btn btn-secondary">Reset</button>
        </div>
      </form>
    </div>

    <!-- Video List -->
    <div v-else class="tab-content mt-3">
      <h2>Video List</h2>
      <table class="table table-bordered text-center">
        <thead>
        <tr>
          <th>#</th>
          <th>YouTube ID</th>
          <th>Video Title</th>
          <th>View Count</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="video in videos" :key="video.id">
          <td>{{videos.indexOf(video) + 1}}</td>
          <td>{{ video.id }}</td>
          <td>{{ video.title }}</td>
          <td>{{ video.views }}</td>
          <td>{{ video.active ? "Active" : "Inactive" }}</td>
          <td>
            <button class="btn btn-link" @click="editVideo(video)">Edit</button>
            <button class="btn btn-link text-danger" @click="deleteVideo(video.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="d-flex justify-content-center mt-3">
        <button
            class="btn btn-outline-primary me-2"
            :disabled="currentPage === 1"
            @click="previousPage"
        >
          Previous
        </button>
        <div>
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <button
            class="btn btn-outline-primary ms-2"
            :disabled="currentPage === totalPages"
            @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/api/api.js";
export default {
  data() {
    return {
      currentTab: "edition", // 'edition' or 'list'
      form: {
        id: null,
        title: "",
        views: 0,
        active: true,
        description: "",
      },
      videos: [], // List of videos
      existingVideo: null, // Check if video exists
      isValidYouTubeId: null, // Trạng thái ID hợp lệ (true, false, hoặc null)
      posterUrl: "", // URL của ảnh poster
      defaultPosterUrl: "https://img.youtube.com/vi/default.jpg", // Ảnh mặc định của YouTube
      currentPage: 1, // Trang hiện tại
      totalPages: 1, // Tổng số trang
    };
  },
  watch: {
    // Theo dõi sự thay đổi của YouTube ID
    "form.id": function (newId) {
      if (this.isYouTubeIdValidFormat(newId)) {
        this.isValidYouTubeId = true;
        this.posterUrl = `https://img.youtube.com/vi/${newId}/hqdefault.jpg`;
      } else {
        this.isValidYouTubeId = false;
        this.posterUrl = this.defaultPosterUrl;
      }
    },
  },
  methods: {
    fetchVideos(page = 1) {
      apiClient
          .get(`/admin/videos?page=${page}`)
          .then((response) => {
            this.videos = response.data.list; // Lấy danh sách video
            this.currentPage = response.data.currentPage; // Cập nhật trang hiện tại
            this.totalPages = response.data.totalPages; // Cập nhật tổng số trang
          })
          .catch((error) => {
            console.error("Error fetching videos:", error);
          });
    },

    handleSave() {
      const apiCall = this.form.id && this.existingVideo
          ? apiClient.put(`/admin/videos/${this.form.id}`, this.form)
          : apiClient.post("/admin/videos", this.form);

      apiCall
          .then(() => {
            this.fetchVideos(this.currentPage); // Làm mới danh sách trang hiện tại
            this.resetForm();
            this.currentTab = "list";
          })
          .catch((error) => {
            console.error("Error saving video:", error);
          });
    },
    deleteVideo(id) {
      apiClient
          .delete(`/admin/videos/${id}`)
          .then(() => {
            this.fetchVideos(this.currentPage); // Làm mới danh sách trang hiện tại
          })
          .catch((error) => {
            console.error("Error deleting video:", error);
          });
    },
    editVideo(video) {
      this.form = { ...video }; // Populate the form for editing
      this.existingVideo = true; // Set flag for update
      this.currentTab = "edition"; // Switch to the edition tab
    },
    resetForm() {
      this.form = {
        id: null,
        title: "",
        views: 0,
        active: true,
        description: "",
      };
      this.existingVideo = null;
      this.isValidYouTubeId = null;
      this.posterUrl = this.defaultPosterUrl;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.fetchVideos(this.currentPage + 1);
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.fetchVideos(this.currentPage - 1);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchVideos(page);
      }
    },
    // Kiểm tra định dạng cơ bản của YouTube ID
    isYouTubeIdValidFormat(id) {
      const idPattern = /^[a-zA-Z0-9_-]{11}$/;
      return idPattern.test(id);
    },

    // Xử lý sự cố nếu ảnh không tải được
    handleImageError() {
      this.isValidYouTubeId = false;
      this.posterUrl = this.defaultPosterUrl;
    },
  },
  mounted() {
    this.fetchVideos(1);
  },
};
</script>
