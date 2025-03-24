import createApiClient from '@/services/api.service';

class ImageService {
    constructor() {
        this.api = createApiClient('/api/image'); // Tạo instance đúng
    }

    async uploadImages(images) {
        try {
            const formData = new FormData();
            images.forEach(image => formData.append('images', image));

            const response = await this.api.formData.post('/upload', formData);
            console.log('API Response:', response.data); // 🛠 Kiểm tra dữ liệu trả về
            return response.data;
        } catch (error) {
            console.error('ImageService.uploadImages error:', error);
            throw error;
        }
    }
}

export default new ImageService();
