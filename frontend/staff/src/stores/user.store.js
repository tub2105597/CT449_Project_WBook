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

            if (response.data.data.vaiTro === 'nhanVien' || response.data.data.vaiTro === 'quanTri') {
                maNV.value = response.data.data.maNV;
                vaiTro.value = response.data.data.vaiTro;
                localStorage.setItem('bookgo-staff-isLogin', true);

                await Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công',
                    showConfirmButton: false,
                    timer: 1500,
                    confirmButtonColor: '#198754',
                });
            } else {
                throw new Error('Thông tin đăng nhập không hợp lệ');
            }
        } catch (error) {
            maNV.value = '';
            vaiTro.value = '';
            localStorage.removeItem('bookgo-staff-isLogin');
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
            maNV.value = '';
            vaiTro.value = '';
            localStorage.removeItem('bookgo-staff-isLogin');

            await Swal.fire({
                icon: 'success',
                title: 'Đăng xuất thành công',
                showConfirmButton: false,
                timer: 1500,
                confirmButtonColor: '#198754',
            });
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