<template>
  <div class="video-details container mt-4">
    <div class="row">
      <div class="col-md-8">
        <!-- Video Player -->
        <div class="video-player">
          <iframe
              :src="`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`"
              width="100%"
              height="600"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
          ></iframe>
        </div>

        <!-- Video Info -->
        <div class="video-info mt-3">
          <h3>{{ video.title }}</h3>
          <div class="video-views text-muted small">
            <i class="fa fa-eye"></i> {{ video.views }} views
          </div>
          <p>{{ video.description }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="video-actions mt-3">
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
        </div>
      </div>

      <!-- Recently Viewed Videos -->
      <div class="col-md-4">
        <h4 class="mb-3 text-primary">Các Tiểu Phẩm Đã Xem</h4>
        <ul class="list-group">
          <router-link
              v-for="recentVideo in sortedRecentlyViewed"
              :key="recentVideo.id"
              :to="{ name: 'VideoDetails', params: { id: recentVideo.id } , query: { email }}"
              class="list-group-item list-group-item-action d-flex align-items-center p-3 text-decoration-none"
          >
            <img
                :src="`https://img.youtube.com/vi/${recentVideo.id}/hqdefault.jpg`"
                alt="Poster"
                class="rounded shadow-sm"
                width="70"
                height="50"
            />
            <div class="ms-3">
              <span class="text-dark fw-bold">{{ recentVideo.title }}</span>
            </div>
          </router-link>
        </ul>
      </div>
    </div>

    <!-- Share Modal -->
    <share-modal
        v-if="showShareModal"
        :video-id="video.id"
        :email="email"
        @close="closeShareModal"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { getVideoDetails } from "@/api/videoService.js";
import ShareModal from "@/components/ShareModal.vue";
import favorites from "@/api/favorites.js";
import {useUserStore} from "@/stores/userStore.js";
import shareModal from "@/components/ShareModal.vue";

export default {
  computed: {
    shareModal() {
      return shareModal
    }
  },
  components: { ShareModal },
  props: {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }
  },
  setup(props) {
    const video = ref({});
    const recentlyViewed = ref([]);
    const showShareModal = ref(false);
    const userStore = useUserStore();

    const fetchVideoDetails = async (videoId) => {
      try {
        const response = await getVideoDetails(videoId);
        video.value = response.data;
        updateRecentlyViewed(video.value);
      } catch (error) {
        console.error("Failed to fetch video details:", error);
      }
    };

    const updateRecentlyViewed = (video) => {
      const currentUser = userStore.getUsername; // Lấy username hiện tại
      console.log(userStore.getUsername);
      if (!currentUser || currentUser === "Guest") return; // Không lưu nếu chưa đăng nhập

      // Lấy danh sách recentlyViewed của người dùng hiện tại
      const userRecentlyViewed =
          JSON.parse(localStorage.getItem(`recentlyViewed_${currentUser}`)) || [];

      // Kiểm tra video đã tồn tại trong danh sách hay chưa
      const existsIndex = userRecentlyViewed.findIndex((item) => item.id === video.id);

      if (existsIndex !== -1) {
        // Nếu đã tồn tại, xóa phần tử cũ
        userRecentlyViewed.splice(existsIndex, 1);
      }

      // Thêm video mới vào đầu danh sách
      userRecentlyViewed.unshift({
        id: video.id,
        title: video.title,
        timestamp: Date.now(),
      });

      // Giới hạn danh sách tối đa 7 video
      if (userRecentlyViewed.length > 7) {
        userRecentlyViewed.pop();
      }

      // Lưu danh sách vào localStorage với khóa riêng theo username
      localStorage.setItem(
          `recentlyViewed_${currentUser}`,
          JSON.stringify(userRecentlyViewed)
      );

      // Cập nhật danh sách hiển thị
      recentlyViewed.value = userRecentlyViewed;
    };


    const sortedRecentlyViewed = computed(() =>
        [...recentlyViewed.value].sort((a, b) => b.timestamp - a.timestamp)
    );

    const handleLike = async (videoId, isLiked) => {
      if (!userStore.isLoggedIn) {
        // Kích hoạt modal yêu cầu đăng nhập
        userStore.showLoginModal = true;
        return;
      }

      try {
        // Gửi yêu cầu like/unlike đến server
        if (isLiked) {
          await favorites.unlikeVideo(videoId);
        } else {
          await favorites.like(videoId);
        }

        video.value.liked = !video.value.liked;
      } catch (error) {
        console.error("Failed to update like status:", error);
        alert("Không thể cập nhật trạng thái like. Vui lòng thử lại sau!");
      }
    };

    const handleShare = async () => {
      if (!userStore.isLoggedIn) {
        // Kích hoạt modal yêu cầu đăng nhập
        userStore.showLoginModal = true;
        return;
      }
      // Hiển thị modal chia sẻ nếu đã đăng nhập
      showShareModal.value = true;
    };

    const closeShareModal = () => {
      showShareModal.value = false;
    };

    watch(
        () => props.id, // Theo dõi `props.id`
        (id) => {
          if (id) fetchVideoDetails(id);
        },
        { immediate: true }
    );

    watch(
        () => userStore.getUsername, // Theo dõi sự thay đổi của người dùng hiện tại
        (username) => {
          if (!username || username === "Guest") {
            recentlyViewed.value = []; // Xóa danh sách nếu chưa đăng nhập
          } else {
            // Lấy danh sách từ localStorage
            recentlyViewed.value =
                JSON.parse(localStorage.getItem(`recentlyViewed_${username}`)) || [];
          }
        },
        { immediate: true } // Chạy ngay khi khởi tạo
    );


    return {
      video,
      sortedRecentlyViewed,
      showShareModal,
      handleLike,
      handleShare,
      closeShareModal,
    };
  },
};
</script>