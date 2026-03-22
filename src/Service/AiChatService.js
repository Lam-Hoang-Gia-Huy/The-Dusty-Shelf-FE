import axiosInstance from '../Component/Config/axiosConfig';

export const chatWithAi = async (message, sessionId, userId) => {
    try {
        const payload = sessionId ? { message, sessionId } : { message };
        if (userId) {
            payload.userId = userId;
        }
        const response = await axiosInstance.post('/api/ai/chat', payload);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi AI API", error);
        throw error;
    }
};
