<template>
  <div class="container mt-5">
    <h4 class="mb-4">BÁO CÁO – THỐNG KÊ</h4>

    <!-- Tabs Navigation -->
    <ul class="nav nav-tabs" id="reportTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            :class="{ active: activeTab === 'favorites' }"
            @click="activeTab = 'favorites'"
        >
          Favorites
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            :class="{ active: activeTab === 'favorite-users' }"
            @click="activeTab = 'favorite-users'"
        >
          Favorite Users
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            :class="{ active: activeTab === 'shared-friends' }"
            @click="activeTab = 'shared-friends'"
        >
          Shared Friends
        </button>
      </li>
    </ul>

    <!-- Tabs Content -->
    <div class="tab-content">
      <FavoritesReport v-if="activeTab === 'favorites'" />
      <FavoriteUsersReport v-if="activeTab === 'favorite-users'" />
      <SharedFriendsReport v-if="activeTab === 'shared-friends'" />
    </div>
  </div>
</template>

<script>
import FavoritesReport from "@/components/admin/FavoritesReport.vue";
import FavoriteUsersReport from "@/components/admin/FavoriteUsersReport.vue";
import SharedFriendsReport from "@/components/admin/SharedFriendsReport.vue";

export default {
  components: {
    FavoritesReport,
    FavoriteUsersReport,
    SharedFriendsReport,
  },
  data() {
    return {
      activeTab: "favorites", // Tab mặc định
    };
  },
};
</script>
