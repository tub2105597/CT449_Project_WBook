<template>
    <div class="page bg-light d-flex justify-content-center align-items-center"> 
        <div class="container">
            <div class="row mb-3">
                <h3 class="col-6">Danh sách nhân viên</h3>
                <div class="col-6">
                    <router-link :to="{ name : 'staff-add'}" class="btn btn-primary float-end create-btn">
                        <i class="fas fa-plus"></i> Thêm nhân viên mới
                    </router-link>
                </div>
            </div>
            <div class="col mb-3">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Tìm kiếm theo tên nhân viên" v-model="search" @keyup.enter="searchStaffs()">
                    <button class="btn btn-outline-success" type="button" id="button-addon2"  @click="searchStaffs()">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>

            <!-- Bảng hiển thị danh sách nhân viên -->
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col" class="text-center">#</th>
                            <th scope="col" class="text-center">Trạng thái</th>
                            <th scope="col" class="text-center">Mã nhân viên</th>
                            <th scope="col" class="text-center">Họ tên</th>
                            <th scope="col" class="text-center">Địa chỉ</th>
                            <th scope="col" class="text-center">Số điện thoại</th>
                            <th scope="col" class="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(staff, index) in paginatedStaffs" :key="staff._id">
                            <td class="custom-col">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                            <td class="custom-col">
                                <i v-if="staff.kichHoat" class="fas fa-check text-success"></i>
                                <i v-else class="fas fa-times text-danger"></i>
                            </td>
                            <td class="custom-col">{{ staff.maNV }}</td>
                            <td class="custom-col">{{ staff.hoTen }}</td>
                            <td class="custom-col">{{ staff.diaChi }}</td>
                            <td class="custom-col">{{ staff.soDienThoai }}</td>
                            <td class="d-flex gap-1 justify-content-center">
                               <button class="btn btn-outline-primary" @click="lockStaff(staff._id)">
                                    <i class="fas fa-lock"></i>
                                </button>
                                <router-link :to="{ name: 'staff-edit', params: { id: staff._id } }" class="btn btn-outline-warning">
                                    <i class="fas fa-edit"></i>
                                </router-link>
                                <button class="btn btn-outline-danger" @click="deleteStaff(staff._id)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Phân trang -->
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="prevPage">Trước</button>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="nextPage">Sau</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import staffService from '@/services/staff.service';
import Swal from 'sweetalert2';

const staffs = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const search = ref('');

async function fetchStaffs() {
    try {
        const response = await staffService.getStaffs();
        if (response.data && Array.isArray(response.data.staffs)) {
            staffs.value = response.data.staffs;
            console.log("Danh sách nhân viên:", staffs.value);
        } else {
            console.error("Dữ liệu API không hợp lệ:", response.data);
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
    }
}

async function lockStaff(id) {
    try {
        const result = await Swal.fire({
            title: 'Xác nhận khóa tài khoản nhân viên',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#198754',
        });

        if (!result.isConfirmed) return;

        const response = await staffService.updateStaff(id, { kichHoat: false });
            await fetchStaffs();
    } catch (error) {
        console.error('Lỗi khi khóa nhân viên:', error);
    }
}

async function deleteStaff(id) {
    try {
        const result = await Swal.fire({
            title: 'Xác nhận xóa nhân viên',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#dc3545',
        });

        if (!result.isConfirmed) return;

        await staffService.deleteStaff(id);
        fetchStaffs();

    } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
    }
}

const totalPages = computed(() => Math.ceil(staffs.value.length / itemsPerPage));

const paginatedStaffs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return staffs.value.slice(start, start + itemsPerPage);
});

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function goToPage(page) {
    currentPage.value = page;
}

async function searchStaffs() {
    const keyword = search.value?.toString().toLowerCase().trim(); // Chuyển `search` thành chuỗi

    if (!keyword) {
        await fetchStaffs(); // Load lại danh sách nếu ô tìm kiếm rỗng
        return;
    }

    staffs.value = staffs.value.filter(staff =>
        staff.hoTen.toLowerCase().includes(keyword)
    );
}


onBeforeMount(fetchStaffs);
</script>

<style scoped>
.page {
    max-width: 1300px;
}

.custom-col {
    text-align: center;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
