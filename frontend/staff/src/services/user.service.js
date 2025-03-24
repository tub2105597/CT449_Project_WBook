import createApiClient from '@/services/api.service';

class UserService {
    constructor(baseURL = '/api/user') {
        this.api = createApiClient(baseURL);
    }

    async getAllUsers(query) {
        try {
            const params = new URLSearchParams(query).toString();
            const response = await this.api.json.get(`/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUser(id) {
        try {
            const response = await this.api.json.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async addUser(data) {
        try {
            const response = await this.api.json.post(`/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, data) {
        try {
            const response = await this.api.json.patch(`/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();