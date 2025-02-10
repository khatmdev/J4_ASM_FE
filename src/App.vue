<template>
  <div id="app">
    <navbar-component v-if="!isAdmin"/>
    <navbar-admin v-else/>
    <main class="content">
      <router-view />
    </main>
    <Footer/>
    <RequireLoginModal />
  </div>
</template>

<script>
import RequireLoginModal from "@/components/RequireLoginModal.vue";
import NavbarComponent from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import {useUserStore} from "@/stores/userStore.js";
import NavbarAdmin from "@/components/admin/NavbarAdmin.vue";
import {computed} from "vue";

export default {
  components: {
    NavbarAdmin,
    Footer,
    NavbarComponent,
    RequireLoginModal,
  },
  setup(){
    const store = useUserStore();
    const isAdmin = computed(() => store.isAdmin );
    return{
      isAdmin,
    };
  }
};
</script>

<style>
/* Tổng bố cục App.vue */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Toàn bộ chiều cao màn hình */
}

/* Nội dung chính */
.content {
  flex: 1; /* Đẩy footer xuống cuối khi nội dung ít */
  overflow: auto; /* Cuộn khi nội dung dài */
  min-height: 880px; /* Đặt chiều cao tối thiểu */
  box-sizing: border-box; /* Bao gồm padding trong kích thước */
}

/* Footer */
footer {
  background-color: #343a40;
  color: white;
  padding: 1rem;
  text-align: center;
}
</style>

