import createApiClient from '@/services/api.service';

class BookService {
    constructor(baseUrl = '/api/book') {
        this.api = createApiClient(baseUrl);
    }

    async getBooks(query) {
        try {
            const response = await this.api.json.get('', { params: query });
            return response.data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    async getBook(id) {
        return this.api.get(id);
    }

    async createBook(data) {
        return this.api.post(data);
    }

    async updateBook(id, data) {
        return this.api.put(id, data);
    }

    async deleteBook(id) {
        return this.api.delete(id);
    }
}

export default new BookService();