import createApiClient from '@/services/api.service';

class AuthService {
    constructor(baseUrl = '/api/auth/user') {
        this.api = createApiClient(baseUrl);
    }

    login(data) {
        try {
            return this.api.json.post('/login', data);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    logout() {
        try {
            return this.api.json.post('/logout');
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default new AuthService();