<script>
import { ref } from "vue";
import FavoriteService from "@/api/favorites.js";
import ShareModal from "@/components/ShareModal.vue";

export default {
  components: { ShareModal },
  setup() {
    // Sử dụng ref để quản lý dữ liệu
    const userFullname = ref(""); // Tên người dùng hiện tại
    const email = ref("");
    const videoList = ref([]); // Danh sách video yêu thích
    const showShareModal = ref(false); // Trạng thái hiển thị modal chia sẻ
    const selectedVideoId = ref(null); // ID video được chọn để chia sẻ

    // Tải danh sách video yêu thích
    const loadFavorites = async () => {
      try {
        const response = await FavoriteService.getFavorites();
        console.log(response.data);
        userFullname.value = response.data.fullname; // Lưu thông tin người dùng
        email.value = response.data.email;
        videoList.value = response.data.videoList; // Lưu danh sách video yêu thích
      } catch (error) {
        console.error("Error loading favorites:", error);
        alert("Failed to load favorites. Please try again later.");
      }
    };

    // Bỏ thích video
    const unlike = async (videoId) => {
      try {
        await FavoriteService.unlikeVideo(videoId);
        videoList.value = videoList.value.filter((video) => video.id !== videoId);
      } catch (error) {
        console.error("Error unliking video:", error);
        alert("Failed to unlike the video.");
      }
    };

    // Mở modal chia sẻ
    const openShareModal = (videoId) => {
      selectedVideoId.value = videoId;
      showShareModal.value = true;
    };

    // Đóng modal chia sẻ
    const closeShareModal = () => {
      showShareModal.value = false;
      selectedVideoId.value = null;
    };

    // Tải danh sách yêu thích khi khởi tạo component
    loadFavorites();

    return {
      userFullname,
      email,
      videoList,
      showShareModal,
      selectedVideoId,
      loadFavorites,
      unlike,
      openShareModal,
      closeShareModal,
    };
  },
};
</script>
<template>
  <div class="container my-5">
    <h2 class="mb-4 text-center text-danger">
      Favorite Videos of <span>{{ userFullname }}</span>
    </h2>
    <div class="row" v-if="videoList?.length > 0">
      <div class="col-md-4 mb-4" v-for="video in videoList" :key="video.id">
        <div class="card shadow-lg">
          <router-link :to="{ name: 'VideoDetails', params: { id: video.id }, query: { email } }">
            <img
                :src="`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`"
                class="card-img-top"
                :alt="video.title"
            />
          </router-link>
          <div class="card-body">
            <h5 class="card-title">{{ video.title }}</h5>
            <p class="card-text">{{ video.description }}</p>
            <button
                class="btn btn-danger ms-2"
                @click="unlike(video.id)"
            >
              <i class="fa-solid fa-heart-crack"></i>
              Unlike
            </button>
            <button
                class="btn btn-secondary ms-2"
                @click="openShareModal(video.id)"
            >
              <i class="fa-solid fa-share-from-square"></i>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">No favorite videos found.</p>
    </div>
    <share-modal
        v-if="showShareModal"
        :video-id="selectedVideoId"
        :email="email"
        @close="closeShareModal"
    />
  </div>
</template>
