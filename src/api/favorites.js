import apiClient from "./api.js";

const FavoriteService = {
    getFavorites() {
        return apiClient.get("/favorites");
    },

    unlikeVideo(videoId) {
        return apiClient.delete(`/favorites/unlike/${videoId}`);
    },

    like(videoId){
        return apiClient.put(`/favorites/like/${videoId}`)
    },

    shareVideo(videoId, recipientEmails, appPassword) {
        return apiClient.post("/favorites/share", {
            videoId,
            recipientEmails,
            appPassword,
        });
    },
};

export default FavoriteService;
