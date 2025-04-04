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
                    <legend class="text-center fw-bold">Thông tin mượn sách</legend>
                    <div class="form-group d-flex flex-column mb-4">
                        <label for="maDG" class="text-muted mb-1">Số điện thoại độc giả:</label>
                        <Field type="text" name="soDienThoai" id="maDG" class="form-control" v-model="status.maDG"/>
                    </div>
                    <div class="form-group d-flex flex-column mb-4">
                        <p class="text-muted mb-1">Sách mượn:</p>
                        <button type="button" class="btn btn-white mb-3" @click="showBookModal = true">
                            Chọn sách cần mượn
                        </button>
                        <div v-if="selectedBooks.length" class="d-flex flex-column gap- list-group list-group-numbered">

                            <div v-for="book in selectedBooks" :key="book._id" class="d-flex gap-3 align-items-center ml-3">
                                <div class="col-2">
                                    <img :src="'http://127.0.0.1:8080' + book.hinhAnh[0].duongDan" alt="book" class="book-img" />
                                </div>
                                <div class="col-8 align-self-start">
                                    <p class="m-0 fw-bold">#{{ book._id }}</p>
                                    <p class="m-0">Tên sách: {{ book.tenSach }}</p>
                                </div>
                                <div class="col-2">
                                    <button type="button" class="btn btn-sm btn-danger" @click="selectedBooks.splice(selectedBooks.indexOf(book), 1)">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div class="form-group mb-4">
                        <label for="ngayMuon" class="text-muted">Ngày mượn: </label>
                        <Field type="date" name="ngayMuon" id="ngayMuon" class="form-control" v-model="status.ngayMuon" />
                    </div>
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-lg btn-success update-btn float-end">Xác nhận</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>

<teleport to="body">
    <div v-if="showBookModal" class="modal-overlay">
        <div class="modal-content">
            <h5 class="text-center mb-3">Chọn sách cần mượn</h5>
            <div class="row">
                <ul class="list-group list-group-numbered">
                    <div class="book-list">
                        <div v-for="book in books" :key="book._id" class="mb-3">
                            <div class="row">
                                 <div class="col-2">
                                    <img :src="'http://127.0.0.1:8080' + book.hinhAnh[0].duongDan" alt="book" class="book-img" />
                                </div>
                                <div class="col-8 align-self-start">
                                    <p class="m-0 fw-bold">#{{ book._id }}</p>
                                    <p class="m-0">Tên sách: {{ book.tenSach }}</p>
                                </div>
                                <div class="col-2">
                                    <input 
                                        type="checkbox" 
                                        :value="book" 
                                        :checked="selectedBooks.some(selectedBook => selectedBook._id === book._id)" 
                                        @change="toggleSelection(book)" 
                                        class="form-check-input me-2"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </ul>
            </div>
            <div class="text-center mt-3 d-flex justify-content-end gap-3">
                <button class="btn btn-md btn-success" @click="showBookModal = false">Xác nhận</button>
                <button class="btn btn-md btn-secondary" @click="showBookModal = false">Đóng</button>
            </div>  
        </div>
    </div>
</teleport>

</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { Form, Field } from 'vee-validate';
import Swal from 'sweetalert2';

import bookService from '@/services/book.service';
import statusService from '@/services/status.service';

const router = useRouter();
const isAdd = ref(false);
const loading = ref(false);
const books = ref([]);
let status = ref({
    maSach: [],
    maDG: '',
    ngayMuon: '',
});

const showBookModal = ref(false);
const selectedBooks = ref([]);

const toggleSelection = (book) => {
    const index = selectedBooks.value.findIndex(selectedBook => selectedBook._id === book._id);
    if (index === -1) {
        selectedBooks.value.push(book); // Thêm sách nếu chưa có
    } else {
        selectedBooks.value.splice(index, 1); // Xóa sách nếu đã có
    }
};

async function onSubmit() {
    const result = await Swal.fire({
        title: 'Xác nhận',
        text: 'Quyển sách này sẽ được mượn?', 
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: false,
        confirmButtonColor: '#198754'
    });

    if (!result.isConfirmed) return;

    loading.value = true;

    // if(status.value.ngayMuon < new Date()) {
    //     await Swal.fire({
    //         title: 'Thất bại',
    //         text: 'Mượn sách thất bại',
    //         icon: 'error',
    //         text: 'Ngày mượn không hợp lệ',
    //         confirmButtonColor: '#198754'
    //     });
    //     return;
    // }

    const payload = {
        maDG: status.value.maDG,
        maSach: selectedBooks.value.map(book => book._id),
        ngayMuon: status.value.ngayMuon
    };

    //Add book
    const response = await statusService.addStatus(payload);

    if (response.status === 'success') {
        await Swal.fire({
            title: 'Thành công',
            text: 'Mượn sách thành công',
            icon: 'success',
            confirmButtonColor: '#198754'
        });
        isAdd.value = true;
        router.push({ name: 'status-list' });
    } else {
        await Swal.fire({
            title: 'Thất bại',
            text: 'Mượn sách thất bại',
            icon: 'error',
            confirmButtonColor: '#198754'
        });
    }

    loading.value = false;
}

onBeforeRouteLeave(async () => {
    if (isAdd.value) return true;
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
    await fetchBooks();
});

</script>

<style scoped>
.page {
    width: 100%;
    max-width: 700px;
    min-height: 600px;
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
    transform: scale(1.2); /* Tăng kích thước checkbox */
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