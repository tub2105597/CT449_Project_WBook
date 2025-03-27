import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import authService from '@/services/auth.service';

export const useUserStore = defineStore('user', () => {
    const soDienThoai = ref('');
    const userId = ref('');

    const isAuth = computed(() => {
        return soDienThoai.value !== '' && userId.value !== '';
    });

    async function login(data) {
        try {
            const response = await authService.login(data);

            soDienThoai.value = response.data.data.soDienThoai;
            userId.value = response.data.data.userId;
            localStorage.setItem('bookgo-user-isLogin', true);
        } catch (error) {
            soDienThoai.value = '';
            userId.value = '';
            localStorage.removeItem('bookgo-user-isLogin');
        }
    }

    async function logout() {
        soDienThoai.value = '';
        userId.value = '';
        localStorage.removeItem('bookgo-user-isLogin');
    }

    return {
        soDienThoai,
        userId,
        isAuth,
        login,
        logout,
    };
});