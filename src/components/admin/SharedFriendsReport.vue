<template>
  <div>
    <div class="mt-3">
      <label for="sharedVideoTitle" class="form-label">Video Title?</label>
      <select id="sharedVideoTitle" class="form-select" v-model="selectedVideo">
        <option v-for="video in videoTitles" :key="video" :value="video">
          {{ video }}
        </option>
      </select>
    </div>
    <div class="table-responsive mt-3">
      <table class="table table-bordered">
        <thead class="table-light">
        <tr>
          <th>Sender Name</th>
          <th>Sender Email</th>
          <th>Receiver Email</th>
          <th>Sent Date</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="friend in sharedFriends" :key="friend.sentDate">
          <td>{{ friend.senderName }}</td>
          <td>{{ friend.senderEmail }}</td>
          <td>{{ friend.receiverEmail }}</td>
          <td>{{ friend.sentDate }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import apiClient from "@/api/api.js";
import {formatDate} from "@/utils/dateUtils.js";

export default {
  data() {
    return {
      videoTitles: [],
      selectedVideo: null,
      sharedFriends: [],
    };
  },
  watch: {
    selectedVideo(newVideo) {
      if (newVideo) {
        this.fetchSharedFriends(newVideo);
      }
    },
  },
  async created() {
    try {
      const response = await apiClient.get("/admin/report/video-titles");
      this.videoTitles = response.data;
      this.selectedVideo = this.videoTitles[0];
    } catch (error) {
      console.error("Error fetching video titles:", error);
    }
  },
  methods: {
    async fetchSharedFriends(videoTitle) {
      try {
        const response = await apiClient.get(`/admin/report/shared-friends`, {
          params: { videoTitle },
        });
        this.sharedFriends = response.data.map(friend => ({
          ...friend,
          sentDate: formatDate(friend.sentDate), // Sử dụng hàm utils
        }));
      } catch (error) {
        console.error("Error fetching shared friends:", error);
      }
    },
  },
};
</script>
