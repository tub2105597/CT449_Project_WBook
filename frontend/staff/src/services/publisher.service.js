import createApiClient from '@/services/api.service';

class PublisherService {
    constructor(baseURL = '/api/publisher') {
        this.api = createApiClient(baseURL);
    }

    async getAllPublishers(query) {
        try {
            const params = new URLSearchParams(query).toString();
            const response = await this.api.json.get(`/?${params}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getPublisher(id) {
        try {
            const response = await this.api.json.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async addPublisher(data) {
        try {
            const response = await this.api.json.post(`/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updatePublisher(id, data) {
        try {
            const response = await this.api.json.patch(`/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deletePublisher(id) {
        try {
            const response = await this.api.json.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new PublisherService();