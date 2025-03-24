<template>
    <div class="container bg-light d-flex justify-content-center">
        <div class="page">
            <div class="row mb-3">
                <div class="col-6">
                    <router-link :to="{ name: 'book-list' }" class="text-decoration-none float-start back-btn">
                        <i class="fas fa-arrow-left"></i> &nbsp;Quay lại trang trước
                    </router-link>
                </div>
            </div>
            <div class="px-5 py-3">
                <Form class="form" @submit="onSubmit">
                    <legend class="text-center fw-bold">Chỉnh sửa thông tin mượn sách</legend>
                    <div class="form-group d-flex flex-column mb-4">
                        <label for="maDG" class="text-muted mb-1">Số điện thoại độc giả:</label>
                        <input type="text" name="maDG" id="maDG" class="form-control" v-model="status.maDG.soDienThoai" disabled />
                    </div>
                    <div class="form-group d-flex flex-column mb-4">
                        <p class="text-muted mb-1">Sách mượn:</p>
                        <button type="button" class="btn btn-white mb-3"  disabled>
                            Chọn sách cần mượn
                        </button>
                        <div v-if="selectedBooks.length" class="d-flex flex-column gap- list-group list-group-numbered">

                            <div v-for="book in selectedBooks" :key="book._id" class="d-flex gap-3 align-items-center ml-3 mb-3">
                                <div class="col-2">
                                    <img :src="'http://127.0.0.1:8080' + book.hinhAnh[0].duongDan" alt="book" class="book-img" />
                                </div>
                                <div class="col-8 align-self-start">
                                    <p class="m-0 fw-bold">#{{ book._id }}</p>
                                    <p class="m-0">Tên sách: {{ book.tenSach }}</p>
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div class="form-group mb-4">
                        <label for="ngayMuon" class="text-muted mb-1">Ngày mượn: </label>
                        <Field type="date" name="ngayMuon" id="ngayMuon" class="form-control" v-model="status.ngayMuon" />
                    </div>
                    <div class="form-group mb-4">
                        <label for="ngayTra" class="text-muted mb-1">Ngày trả: </label>
                        <input type="date" name="ngayPhaiTra" id="ngayPhaiTra" class="form-control" v-model="status.ngayTra"/>
                    </div>
                    <div class="form-group mb- d-flex gap-3">
                        <label for="giaHan" class="text-muted">Gia hạn sách: </label>
                        <Field type="checkbox" name="giaHan" id="giaHan" class="form-check form-check-input" v-model="status.giaHan" />
                    </div>
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-lg btn-success update-btn float-end">Xác nhận</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { Form, Field } from 'vee-validate';
import Swal from 'sweetalert2';

import bookService from '@/services/book.service';
import statusService from '@/services/status.service';

const router = useRouter();
const route = useRoute();
const isUpdate = ref(false);
const loading = ref(false);
const books = ref([]);
let status = ref({
    maSach: '',
    maDG: '',
    ngayMuon: '',
    ngayTra: '',
    giaHan: false
});

const selectedBooks = ref([]);

async function onSubmit() {
    const result = await Swal.fire({
        title: 'Xác nhận',
        text: 'Thông tin mượn sách của bạn sẽ được cập nhật, bạn có chắc chắn muốn tiếp tục không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: false,
        confirmButtonColor: '#198754'
    });

    if (!result.isConfirmed) return;

    loading.value = true;

    const payload = {
        maDG: status.value.maDG._id,
        maSach: selectedBooks.value.map(book => book._id),
        ngayMuon: status.value.ngayMuon,
        ngayTra: status.value.ngayTra,
        giaHan: status.value.giaHan
    };

    //Add book
    const response = await statusService.updateStatus(route.params.id, payload);

    if (response.status === 'success') {
        await Swal.fire({
            title: 'Thành công',
            text: 'Cập nhật thông tin mượn sách thành công',
            icon: 'success',
            confirmButtonColor: '#198754'
        });
        isUpdate.value = true;
        router.push({ name: 'status-list' });
    } else {
        await Swal.fire({
            title: 'Thất bại',
            text: 'Cập nhật thông tin mượn sách thất bại',
            icon: 'error',
            confirmButtonColor: '#198754'
        });
    }

    loading.value = false;
}

onBeforeRouteLeave(async () => {
    if (isUpdate.value) return true;
    const result = await Swal.fire({
        title: 'Xác nhận',
        text: 'Thông tin của bạn chưa được lưu, bạn có muốn rời khỏi không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Tiếp tục chỉnh sửa',
        reverseButtons: false,
        confirmButtonColor: '#198754'
    });

    return result.isConfirmed;
})

 async function fetchStatus() {
    const response = await statusService.getStatus(route.params.id);
    if (response.status === 'success') {
        status.value = response.data.status;
        selectedBooks.value.push(status.value.maSach);
        status.value.ngayMuon = new Date(status.value.ngayMuon).toISOString().split('T')[0];
        status.value.ngayTra = new Date(status.value.ngayTra).toISOString().split('T')[0];
    } else {
        console.log('Lỗi khi lấy thông tin mượn sách:', response.message);
    }
}

 async function fetchBooks() {
    const response = await bookService.getAllBooks();
    if (response.status === 'success') {
        books.value = response.data.books.map(book => {
            const { tenSach, _id, hinhAnh } = book;
            return { tenSach, _id, hinhAnh };
        });
    }
}

onBeforeMount(async () => {
    await fetchStatus();
    await fetchBooks();

    console.log('status:', status.value);
});

</script>

<style scoped>
.page {
    width: 100%;
    max-width: 700px;
}

.back-btn {
    color: gray;
    transform: scale3d(0.9, 0.9, 0.9);
    transition: transform 0.3s;
}

.back-btn:hover {
    color: black;
    transform: scale3d(1, 1, 1);
    transition: all 0.3s;
}

.btn-white {
    background-color: white !important;
    color: black;
    border: 1px solid #dee2e6 !important;
}

.btn-white:hover {
    color: #198754;
    font-weight: bold;
    transition: all 0.3s;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050; /* Đảm bảo modal nằm trên các phần khác */
}

.modal-content {
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    max-height: 600px;
    z-index: 1051;
    overflow: scroll;
}

.form-check-input {
    transform: scale(1.0); /* Tăng kích thước checkbox */
    width: 20px; /* Định kích thước cụ thể */
    height: 20px;
    cursor: pointer;
}

img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
}

</style>