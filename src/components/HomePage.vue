<template>
  <div class="container mt-4">
    <h2 class="text-center">Các Tiểu Phẩm Nổi Bật</h2>
    <div class="row">
      <div v-for="video in videos" :key="video.id" class="col-md-4 mb-4">
        <div class="card">
          <router-link :to="{ name: 'VideoDetails', params: { id: video.id }, query: { email } }">
            <img
                :src="`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`"
                class="card-img-top"
                :alt="video.title"
            />
          </router-link>
          <div class="card-body">
            <h5 class="card-title">{{ video.title }}</h5>
            <p class="card-text">
              <button
                  :class="['btn', 'btn-sm', video.liked ? 'btn-danger' : 'btn-primary']"
                  @click="handleLike(video.id, video.liked)"
              >
                <i :class="video.liked ? 'fa fa-heart-broken' : 'fa fa-thumbs-up'"></i>
                {{ video.liked ? "Unlike" : "Like" }}
              </button>
              <button class="btn btn-secondary btn-sm" @click="handleShare(video.id)">
                <i class="fa fa-share"></i> Share
              </button>
            </p>
          </div>
        </div>
      </div>
      <!-- Điều hướng phân trang -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" v-if="currentPage > 1">
            <button class="page-link" @click="changePage(1)">|<</button>
          </li>
          <li class="page-item" v-if="currentPage > 1">
            <button class="page-link" @click="changePage(currentPage - 1)"><<</button>
          </li>
          <li
              v-for="i in totalPages"
              :key="i"
              class="page-item"
              :class="{ active: i === currentPage }"
          >
            <button class="page-link" @click="changePage(i)">{{ i }}</button>
          </li>
          <li class="page-item" v-if="currentPage < totalPages">
            <button class="page-link" @click="changePage(currentPage + 1)">>></button>
          </li>
          <li class="page-item" v-if="currentPage < totalPages">
            <button class="page-link" @click="changePage(totalPages)">>|</button>
          </li>
        </ul>
      </nav>
    </div>
    <!-- Share Modal -->
    <share-modal
        v-if="showShareModal"
        :video-id="selectedVideoId"
        :email="email"
        @close="closeShareModal"
    />
  </div>
</template>

<script>
import { getVideos } from "@/api/videoService";
import { ref } from "vue";
import ShareModal from "@/components/ShareModal.vue";
import {useUserStore} from "@/stores/userStore.js";
import favorites from "@/api/favorites.js";
export default {
  components: { ShareModal },
  setup() {
    const email = ref("");
    const videos = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(0);
    const showShareModal = ref(false);
    const selectedVideoId = ref(null);
    const isLoading = ref(false);
    const userStore = useUserStore();

    const fetchVideos = async (page = 1) => {
      isLoading.value = true;
      try {
        const response = await getVideos(page);

        // Lấy đối tượng "data" bên trong phản hồi
        const data = response.data.data; // Dữ liệu nằm trong `data.data`

        // Gắn email
        email.value = response.data.email;

        // Gắn danh sách video
        videos.value = data.list?.map((video) => ({
          ...video,
          liked: video.liked !== undefined ? video.liked : null, // Xử lý trường hợp null
        }));

        // Gắn currentPage và totalPages
        currentPage.value = data.currentPage;
        totalPages.value = data.totalPages;
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        alert("Không thể tải video. Vui lòng thử lại sau!");
      } finally {
        isLoading.value = false;
      }
    };

    const changePage = (page) => {
      fetchVideos(page);
    };

    const handleLike = async (videoId, isLiked) => {
      if (!userStore.isLoggedIn) {
        // Kích hoạt modal yêu cầu đăng nhập
        userStore.showLoginModal = true;
        return;
      }
      // Gửi yêu cầu like/unlike đến server (sẽ thực hiện nếu đã đăng nhập)
      console.log(isLiked ? `Unlike video ${videoId}` : `Like video ${videoId}`);
      try{
        if (isLiked) {
          await favorites.unlikeVideo(videoId);
        } else{
          await favorites.like(videoId);
        }
        // Tìm video trong danh sách và cập nhật trạng thái
        const videoIndex = videos.value.findIndex((video) => video.id === videoId);
        if (videoIndex !== -1) {
          videos.value[videoIndex].liked = !isLiked;
        }
      } catch (error){
        console.error("Failed to update like status:", error);
        alert("Không thể cập nhật trạng thái like. Vui lòng thử lại sau!");
      }
    };

    const handleShare = async (videoId) => {
      if (!userStore.isLoggedIn) {
        // Kích hoạt modal yêu cầu đăng nhập
        userStore.showLoginModal = true;
        return;
      }
      // Hiển thị modal chia sẻ nếu đã đăng nhập

      selectedVideoId.value = videoId;
      showShareModal.value = true;
    };


    const closeShareModal = () => {
      showShareModal.value = false;
      selectedVideoId.value = null;
    };

    fetchVideos();

    return {
      email,
      videos,
      currentPage,
      totalPages,
      showShareModal,
      selectedVideoId,
      changePage,
      handleLike,
      handleShare,
      closeShareModal,
    };
  },
};
</script>