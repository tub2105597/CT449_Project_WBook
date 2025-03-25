import createApiClient from '@/services/api.service';

class StatusService {
    constructor(baseUrl = '/api/status') {
        this.api = createApiClient(baseUrl);
    }

    async getStatuses(query) {
        try {
            const response = await this.api.json.get('', { params: query });
            return response.data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    async addStatus(data) {
        return this.api.json.post('', data);
    }

    async updateStatus(id, data) {
        return this.api.json.patch(`/${id}`, data);
    }
}

export default new StatusService();