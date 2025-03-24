
<template>
    <TheHeader />
    <div class="d-flex m-0">
        <SideBar v-show="store.isAuth"/>
        <router-view class="main-section"/>
    </div>
</template>


<script setup>
import TheHeader from '@/components/partials/TheHeader.vue';
import SideBar from './components/partials/SideBar.vue';
import { useUserStore } from './stores/user.store';

const store = useUserStore();
</script>

<style scope>
    .main-section {
        flex-grow: 1; /* Cho phép phần nội dung mở rộng */
        padding: 20px; /* Khoảng cách giữa nội dung và viền */}

</style>
