<template>
  <div>
    <div class="mt-3">
      <label for="videoTitle" class="form-label">Video Title?</label>
      <select id="videoTitle" class="form-select" v-model="selectedTitle">
        <option v-for="video in videoTitles" :key="video" :value="video">
          {{ video }}
        </option>
      </select>
    </div>
    <div class="table-responsive mt-3">
      <table class="table table-bordered">
        <thead class="table-light">
        <tr>
          <th>Username</th>
          <th>Fullname</th>
          <th>Email</th>
          <th>Favorite Date</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in favoriteUsers" :key="user.email">
          <td>{{ user.username }}</td>
          <td>{{ user.fullname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.favoriteDate }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import apiClient from "@/api/api.js";
import { formatDate } from "@/utils/dateUtils";

export default {
  data() {
    return {
      videoTitles: [],
      selectedTitle: "",
      favoriteUsers: [],
    };
  },
  watch: {
    selectedTitle(newTitle) {
      if (newTitle) {
        this.fetchFavoriteUsers(newTitle);
      }
    },
  },
  async created() {
    try {
      const response = await apiClient.get("/admin/report/video-titles");
      this.videoTitles = response.data;
      this.selectedTitle = this.videoTitles[0];
    } catch (error) {
      console.error("Error fetching video titles:", error);
    }
  },
  methods: {
    async fetchFavoriteUsers(videoTitle) {
      try {
        const response = await apiClient.get(`/admin/report/favorite-users`, {
          params: { videoTitle },
        });
        console.log(response.data);
        this.favoriteUsers = response.data.map(user => ({
          ...user,
          favoriteDate: formatDate(user.favoriteDate), // Sử dụng hàm utils
        }));
      } catch (error) {
        console.error("Error fetching favorite users:", error);
      }
    },
  },
};
</script>
