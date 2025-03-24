import createApiClient from '@/services/api.service';

class CategoryService {
    constructor(baseURL = '/api/category') {
        this.api = createApiClient(baseURL);
    }

    async getAllCategories(query) {
        try {
            const params = new URLSearchParams(query).toString();
            const response = await this.api.json.get(`/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getCategory(id) {
        try {
            const response = await this.api.json.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async addCategory(data) {
        try {
            const response = await this.api.json.post(`/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateCategory(id, data) {
        try {
            const response = await this.api.json.patch(`/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteCategory(id) {
        try {
            const response = await this.api.json.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

export default new CategoryService();