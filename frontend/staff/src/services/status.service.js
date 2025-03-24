import createApiClient from '@/services/api.service';

class StatusService {
    constructor(baseURL = '/api/status') {
        this.api = createApiClient(baseURL);
    }

    async getAllStatuses(query) {
        try {
            const params = new URLSearchParams(query).toString();
            const response = await this.api.json.get(`/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getStatus(id) {
        try {
            const response = await this.api.json.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async addStatus(data) {
        try {
            const response = await this.api.json.post(`/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateStatus(id, data) {
        try {
            const response = await this.api.json.patch(`/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteStatus(id) {
        try {
            const response = await this.api.json.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new StatusService();