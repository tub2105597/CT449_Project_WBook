<template>
    <div class="container page border border-light-subtle p-3 bg-light shadow-sm">
        <div class="row">
            <div class="sidebar col-3">
                <div class="sidebar-item d-flex gap-2 btn btn-outline-success m-2" :class="{active: isActive.profile}" @click="activeTab('profile')">
                    <span class="" >
                        <i class="fas fa-user"/></span>
                    <span>Thông tin cá nhân</span>
                </div>
                <div class="sidebar-item d-flex gap-2 btn btn-outline-success m-2" :class="{active: isActive.borrow}" @click="activeTab('borrow')">
                    <span class="" >
                        <i class="fas fa-file"/></span>
                    <span>Sách đang mượn</span>
                </div>
                <div class="sidebar-item d-flex gap-2 btn btn-outline-success m-2" :class="{active: isActive.overdue}" @click="activeTab('overdue')">
                    <span class="" >
                        <i class="fas fa-history"/></span>
                    <span>Lịch sử mượn sách </span>
                </div>
                <div class="sidebar-item d-flex gap-2 btn btn-outline-success m-2" :class="{active: isActive.fine}" @click="activeTab('fine')">
                    <span class="" >
                        <i class="fas fa-coins"/></span>
                    <span>Tiền phạt</span>
                </div>    
            </div>
            <div class="col-9">
                <UserInfo :user="user" v-if="isActive.profile"/>
                <StatusBorrow :status="borrowBook" v-if="isActive.borrow"/>
                <StatusHistory :status="historyBook" v-if="isActive.overdue"/>
                <StatusFine :status="overdueBook" v-if="isActive.fine"/>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/user.store';
import userService from '@/services/user.service';
import statusService from '@/services/status.service';
import UserInfo from '@/components/user/UserInfo.vue';
import StatusBorrow from '@/components/status/StatusBorrow.vue';
import StatusHistory from '@/components/status/StatusHitory.vue';
import StatusFine from '@/components/status/StatusFine.vue';

const isActive = ref({
    profile: true,
    borrow: false,
    fine: false
});
const user = ref({});
const borrowBook = ref([]);
const historyBook = ref([]);
const overdueBook = ref([]);
const store = useUserStore();

async function getUser() {
    const response = await userService.getUser(store.userId);
    user.value = response.data.user;
}

async function getStatuses() {
    const response = await statusService.getStatuses({maDG: store.userId});
    if(response.data.statuses) {
        borrowBook.value = response.data.statuses.filter(book => book.ngayTra === book.ngayMuon);
        historyBook.value = response.data.statuses.filter(book => {book.ngayTra !== book.ngayMuon});
        overdueBook.value = response.data.statuses.filter(book => {
            const ngayMuon = new Date(book.ngayMuon).getTime();
            const ngayTra = new Date(book.ngayTra).getTime();
            const thoiGianTraKhongGiaHan = ngayMuon + 7 * 24 * 60 * 60 * 1000;
            const thoiGianTraGiaHan = ngayMuon + 14 * 24 * 60 * 60 * 1000;

            return book.ngayTra && (
                (ngayTra > thoiGianTraKhongGiaHan && !book.giaHan) ||
                (ngayTra > thoiGianTraGiaHan && book.giaHan)
            );
        });
    }
}

async function activeTab(tab) {
    for (let key in isActive.value) {
        isActive.value[key] = false;
    }
    isActive.value[tab] = true;
}

onBeforeMount(() => {
    getUser();
    getStatuses();
});
</script>

<style scoped>
    .page {
        margin-top: 40px;
        max-width: 1200px;
        height: 500px;
    }
</style>

<style scoped>
.custom-col {
    text-align: center;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>