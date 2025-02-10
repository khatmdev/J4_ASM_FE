<template>
  <footer class="bg-dark text-light py-4">
    <div class="container">
      <div class="row">
        <!-- Thông tin cơ bản -->
        <div class="col-md-4">
          <h5>Online Entertainment</h5>
          <p>Thưởng thức nội dung giải trí mọi lúc, mọi nơi!</p>
        </div>

        <!-- Điều hướng -->
        <div class="col-md-4">
          <h5>Liên Kết Nhanh</h5>
          <ul class="list-unstyled">
            <li><router-link to="/" class="text-light">Trang Chủ</router-link></li>
            <li><router-link to="/about" class="text-light">Giới Thiệu</router-link></li>
            <li><router-link to="/contact" class="text-light">Liên Hệ</router-link></li>
          </ul>
        </div>

        <!-- Liên hệ -->
        <div class="col-md-4">
          <h5>Liên Hệ</h5>
          <p>Email: support@entertainment.com</p>
          <p>Điện thoại: +84 123 456 789</p>
        </div>
      </div>

      <hr class="border-light" />

      <div class="text-center">
        <p>&copy; 2024 Online Entertainment. All Rights Reserved.</p>
        <!-- Hiển thị số lượng visitors -->
        <p>
          Lượt truy cập:
          <span :style="{ color: 'greenyellow', fontWeight: 'bold' }">{{ visitors }}</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "Footer",
  setup() {
    const visitors = ref(0);

    // Fetch số lượng visitors từ server
    const fetchVisitors = async () => {
      try {
        const response = await axios.get("/api/visitors");
        visitors.value = response.data.visitors;
        console.log(visitors);
      } catch (error) {
        console.error("Failed to fetch visitors:", error);
      }
    };

    onMounted(fetchVisitors);

    return {
      visitors,
    };
  },
};
</script>

<style>
footer {
  font-size: 14px;
}
footer h5 {
  font-weight: bold;
}
footer a:hover {
  text-decoration: underline;
}
</style>
