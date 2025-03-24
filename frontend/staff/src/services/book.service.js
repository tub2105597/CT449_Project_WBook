import createApiClient from '@/services/api.service';

class BookService {
    constructor(baseURL = '/api/book') {
        this.api = createApiClient(baseURL);
    }

    async getAllBooks(query) {
        try {
            const params = new URLSearchParams(query).toString();
            const response = await this.api.json.get(`/`, { params: params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getBook(id) {
        try {
            const response = await this.api.json.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }



    async addBook(data) {
        try {
            const response = await this.api.json.post(`/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateBook(id, data) {
        try {
            const response = await this.api.json.patch(`/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteBook(id) {
        try {
            const response = await this.api.json.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new BookService();