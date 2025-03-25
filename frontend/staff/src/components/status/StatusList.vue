<template>
    <div class="container bg-light d-flex justify-content-center">
        <div class="page">
            <div class="row mb-3">
                <h3 class="col-6">Thông tin mượn sách</h3>
                <div class="col-6">
                    <router-link :to="{ name: 'status-add' }" class="btn btn-primary float-end create-btn">
                        <i class="fas fa-plus"></i> Mượn sách
                    </router-link>
                </div>
            </div>
            <div class="col mb-3">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Tìm kiếm theo tên người mượn" v-model="search" >
                    <button class="btn btn-outline-success" type="button" id="button-addon2"  @click="searchStatuses()">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Độc giả</th>
                        <th scope="col">Đầu sách</th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Ngày mượn</th>
                        <th scope="col">Ngày trả</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="status in statuses" :key="status.id">
                        <td class="text-truncate">{{ status._id }}</td>
                        <td class="text-truncate">{{ status.maDG.hoLot}} {{ status.maDG.ten }}</td>
                        <td class="text-truncate">{{ status.maSach.tenSach }}</td> 
                        <td class="d-flex justify-content-start">
                            <img :src="'http://127.0.0.1:8080' + status.maSach.hinhAnh[0].duongDan" alt="Hình ảnh" style="height: 50px;">
                        </td>
                        <td class="text-truncate">{{ formatDate(status.ngayMuon) }}</td>
                        <td class="text-truncate">
                            <span v-if="status.ngayTra == status.ngayMuon" class="badge bg-success"></span>
                            <span v-else>{{ formatDate(status.ngayTra) }}</span>
                        </td>
                        <td class="text-truncate">
                            <!-- Nếu ngày mượn == ngày trả -->
                            <span v-if="new Date(status.ngayMuon).getTime() === new Date(status.ngayTra).getTime()" 
                                class="badge bg-primary">
                                Chưa trả
                            </span>

                            <!-- Nếu ngày trả < ngày mượn + 7 ngày HOẶC đã gia hạn nhưng chưa quá hạn 14 ngày -->
                            <span v-else-if="(!status.giaHan && new Date(status.ngayTra).getTime() <= new Date(status.ngayMuon).getTime() + 7 * 24 * 60 * 60 * 1000) 
                                            || (status.giaHan && new Date(status.ngayTra).getTime() <= new Date(status.ngayMuon).getTime() + 14 * 24 * 60 * 60 * 1000)"
                                class="badge bg-success">
                                Đã trả
                            </span>

                            <!-- Nếu ngày trả > ngày mượn + 7 ngày mà không gia hạn, hoặc đã gia hạn nhưng quá 14 ngày -->
                            <span v-else class="badge bg-danger">
                                Quá hạn
                            </span>
                        </td>
                        <td class="d-flex gap-1 align-items-center justify-content-center">
                            <button class="btn btn-sm btn-outline-info" @click="extendStatus(status)">
                                <i class="fas fa-clock"></i>
                            </button>
                            <router-link :to="{ name: 'status-edit', params: { id: status._id } }" class="btn btn-sm btn-outline-warning">
                                <i class="fas fa-edit"></i>
                            </router-link>
                            <button class="btn btn-sm btn-outline-danger" @click="deleteStatus(status._id)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { formatDate } from '@/utils/format.util';
import StatusService from '@/services/status.service';
import Swal from 'sweetalert2';

const statuses = ref([]);
const loading = ref(false);
const search = ref('');

async function fetchStatuses() {
    try {
        const response = await StatusService.getAllStatuses();
        if (response.status === 'success') {
            statuses.value = JSON.parse(JSON.stringify(response.data.statuses));
        } else {
            statuses.value = [];
        }
    console.log('statuses:', statuses.value);
    } catch (error) {
        console.log('Lỗi khi lấy thông tin mượn sách:', error);
    }
}

//Hàm gia hạn mượn sách
async function extendStatus(status) {
    try {
        status.ngayMuon = new Date(status.ngayMuon);
        status.ngayTra = status.ngayMuon.getDate() + 14;

        if (status.ngayTra < new Date()) {
            await Swal.fire({
                icon: 'error',
                title: 'Không thể gia hạn mượn sách',
                text: 'Sách đã quá hạn trả, không thể gia hạn mượn sách!'
            });
        }

        const response = await StatusService.updateStatus(status._id, { ngayTra: status.ngayMuon.setDate(status.ngayMuon.getDate() + 14), giaHan: true });
        if (response.status === 'success') {
            await fetchStatuses();
        } else {
            console.log('Lỗi khi gia hạn mượn sách:', response.message);
        }
    } catch (error) {
        console.log('Lỗi khi gia hạn mượn sách:', error);
    }
}

async function deleteStatus(id) {
    const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa thông tin mượn sách này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        try {
            const response = await StatusService.deleteStatus(id);
            if (response.status === 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Xóa thông tin mượn sách thành công',
                    showConfirmButton: false,
                    timer: 1500
                });
                loading.value = true;
                await fetchStatuses();
            } else {
                console.log('Lỗi khi xóa thông tin mượn sách:', response.message);
            }
        } catch (error) {
            console.log('Lỗi khi xóa thông tin mượn sách:', error);
        }
    }
}

async function searchStatuses() {
    if (!search.value) {
        await fetchStatuses();
        return;
    }

    statuses.value = statuses.value.filter(status => {
        return status.maDG.hoLot.toLowerCase().includes(search.value.toLowerCase()) 
            || status.maDG.ten.toLowerCase().includes(search.value.toLowerCase());
    });
    console.log('search', statuses.value);
}

onBeforeMount(async () => {
    await fetchStatuses();

    console.log('statuses:', statuses.value);
});

</script>

<style scoped>
.page {
    width: 100%;
    max-width: 1200px;
    min-height: 600px;
}

.create-btn {
    transform: scale3d(0.9, 0.9, 0.9);
    transition: transform 0.3s;
}

.create-btn:hover {
    transform: scale3d(1.1, 1.1, 1.1);
}

.text-truncate {
    max-width:100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>