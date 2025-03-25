import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import authService from '@/services/auth.service';
import Swal from 'sweetalert2';

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
            await Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: error.message,
                confirmButtonColor: '#dc3545',
            });
        }
    }

    async function logout() {
        try {
            soDienThoai.value = '';
            userId.value = '';
            localStorage.removeItem('bookgo-user-isLogin');
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Đăng xuất thất bại',
                confirmButtonColor: '#dc3545',
            });
        }
    }

    return {
        soDienThoai,
        userId,
        isAuth,
        login,
        logout,
    };
});