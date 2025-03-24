<template>
    <header>
        <div class='row bg-success text-white p-1'>
            <div class="col-7">
                <div class="d-flex justify-content-left align-items-center">
                    <router-link to="/" class ='p-1'>
                        <img src="../../assets/images/logo.png" alt="logo" class="logo" >
                    </router-link>
                    <router-link to="/" class ='text-white text-decoration-none'>
                        <h3>Hệ thống quản lý mượn sách trực tuyến WBook</h3>
                    </router-link>
                </div>
            </div>
            <div class="col-5">
                <div class="d-flex justify-content-end align-items-end gap-2 m-3" v-if="store.maNV != ''">
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <i class="fas fa-user"></i>
                        <span>{{ store.maNV }}</span>
                    </div>
                    <i class="fas fa-sign-out-alt logout-icon" @click="logout()"></i>
                </div>
                <div class="d-flex justify-content-end align-items-end m-3" v-else>
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <router-link to="/login" class="btn btn-outline-light">Đăng nhập</router-link>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';

const store = useUserStore();
const router = useRouter();
const loading = ref(false);

async function logout() {
    loading.value = true;
    await store.logout();

    console.log('store.isAuth', store.isAuth);

        if (!store.isAuth) {
        router.push({ name: "login-page" });
    }

};

</script>

<style scoped>
    .logo {
        width: 65px;
        margin: 0 10px 0 0;
    }
    
    .logout-icon {
        font-size: 1.3rem;
        color: white;
        transform: translateX(0px);
        transition: all 0.3s;
    }

    .logout-icon:hover {
        transform: translateX(5px);
        transition: all 0.3s;
    }
</style>
