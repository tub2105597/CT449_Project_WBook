import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import authService from '@/services/auth.service';
import Swal from 'sweetalert2';

export const useUserStore = defineStore('user', () => {
    const maNV = ref('');
    const vaiTro = ref('');

    const isAuth = computed(() => {
        return maNV.value !== '' && vaiTro.value !== '';
    });

    async function login(data) {
        try {
            const response = await authService.login(data);
            console.log(response);

            maNV.value = response.data.data.maNV;
            vaiTro.value = response.data.data.vaiTro;
            localStorage.setItem('bookgo-staff-isLogin', true);
        } catch (error) {
            maNV.value = '';
            vaiTro.value = '';
            localStorage.removeItem('bookgo-staff-isLogin');
        }
    }

    async function logout() {
        try {
            maNV.value = '';
            vaiTro.value = '';
            localStorage.removeItem('bookgo-staff-isLogin');
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Đăng xuất thất bại',
                confirmButtonColor: '#dc3545',
            });
        }
    }

    return {
        maNV,
        vaiTro,
        isAuth,
        login,
        logout,
    };
});