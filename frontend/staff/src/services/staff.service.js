import createApiClient from '@/services/api.service';

class StaffService {
    constructor(baseUrl = '/api/staff') {
        this.api = createApiClient(baseUrl);
    }

    async getStaff(id) {
        try {
            const response = await this.api.json.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error while fetching staff', error);
            throw error;
        }
    }

    async getStaffs() {
        try {
            const response = await this.api.json.get('/');
            return response.data;
        } catch (error) {
            console.error('Error while fetching staffs', error);
            throw error;
        }
    }

    async createStaff(payload) {
        try {
            const response = await this.api.json.post('/', payload);
            return response.data;
        } catch (error) {
            console.error('Error while creating staff', error);
            throw error;
        }
    }

    async updateStaff(id, payload) {
        try {
            const response = await this.api.json.patch(`/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error while updating staff', error);
            throw error;
        }
    }

    async deleteStaff(id) {
        try {
            const response = await this.api.json.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error while deleting staff', error);
            throw error;
        }
    }
}

export default new StaffService();