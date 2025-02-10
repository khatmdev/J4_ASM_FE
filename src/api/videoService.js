import apiClient from "./api";

export const getVideos = (page = 1) => {
    return apiClient.get(`/videos`, { params: { page } });
};
export const getVideoDetails = (videoId) => {
    return apiClient.get(`/videos/${videoId}`);
};

