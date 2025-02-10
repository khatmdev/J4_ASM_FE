<template>
  <div class="table-responsive mt-3">
    <table class="table table-bordered">
      <thead class="table-light">
      <tr>
        <th>Video Title</th>
        <th>Favorite Count</th>
        <th>Latest Date</th>
        <th>Oldest Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="favorite in favorites" :key="favorite.videoTitle">
        <td>{{ favorite.videoTitle }}</td>
        <td>{{ favorite.favoriteCount }}</td>
        <td>{{ favorite.latestDate }}</td>
        <td>{{ favorite.oldestDate }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiClient from "@/api/api.js";
import { formatDate } from "@/utils/dateUtils";
export default {
  data() {
    return {
      favorites: [],
    };
  },
  async created() {
    try {
      const response = await apiClient.get("/admin/report/favorites");
      this.favorites = response.data.map(favorite => ({ // API trả về danh sách DTO
        ...favorite,
        latestDate: formatDate(favorite.latestDate),
        oldestDate: formatDate(favorite.oldestDate),
      }));
    } catch (error) {
      console.error("Error fetching favorites report:", error);
    }
  },
};
</script>
