import axiosInstance from '../Component/Config/axiosConfig';

export const chatWithAi = async (message) => {
    try {
        const response = await axiosInstance.post('/api/ai/chat', { message });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi AI API", error);
        throw error;
    }
};
