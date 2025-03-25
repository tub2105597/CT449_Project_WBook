import createApiClient from '@/services/api.service';

class UserService {
    constructor(baseUrl = '/api/user') {
        this.api = createApiClient(baseUrl);
    }

    async getUser(id) {
        try {
            const response = await this.api.json.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, data) {
        try {
            const response = await this.api.json.put(`/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.message);
        }
    }

}

export default new UserService();