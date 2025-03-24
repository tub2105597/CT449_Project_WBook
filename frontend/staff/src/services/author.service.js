import createApiClient from '@/services/api.service';

class AuthorService {
    constructor(baseURL = '/api/author') {
        this.api = createApiClient(baseURL);
    }

    async getAllAuthors(query) {
        try {
            const params = new URLSearchParams(query).toString();
            const response = await this.api.json.get(`/?${params}`);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    async getAuthor(id) {
        try {
            const response = await this.api.json.get(`/${id}`);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    async addAuthor(data) {
        try {
            const response = await this.api.json.post(`/`, data);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateAuthor(id, data) {
        try {
            const response = await this.api.json.patch(`/${id}`, data);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteAuthor(id) {
        try {
            const response = await this.api.json.delete(`/${id}`);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default new AuthorService();