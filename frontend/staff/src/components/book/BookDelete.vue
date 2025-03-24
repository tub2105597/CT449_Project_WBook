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
                    <legend class="text-center fw-bold">Xoá sách</legend>
                    <div class="form-group d-flex mb-2">
                        <p class="text-muted fs-6 fw-bold">Tên sách: &nbsp;</p>
                        <p class="card-text ">{{ book.tenSach }}</p>
                    </div>
                    <div class="form-group d-flex mb-2">
                        <p class="text-muted fs-6 fw-bold">Tên thể loại: &nbsp;</p>
                        <p class="card-text ">{{ book.maTL.tenTL }}</p>
                    </div>
                    <div class="form-group d-flex mb-2">
                        <p class="text-muted fs-6 fw-bold">Tên tác giả: &nbsp;</p>
                        <p class="card-text ">{{ book.maTG.tenTG }}</p>
                    </div>
                    <div class="form-group d-flex mb-2">
                        <p class="text-muted fs-6 fw-bold">Tên nhà xuất bản: &nbsp;</p>
                        <p class="card-text ">{{ book.maNXB.tenNXB }}</p>
                    </div>
                    <div class="form-group d-flex mb-2">
                        <p class="text-mutedn fs-6 fw-bold">Năm xuất bản: &nbsp;</p>
                        <p class="card-text ">{{ book.namXuatBan }}</p>
                    </div>
                    <div class="form-group d-flex mb-2">
                        <p class="text-muted fs-6 fw-bold">Số lượng tồn kho: &nbsp;</p>
                        <p class="card-text ">{{ book.soQuyen }}</p>
                    </div>
                    <ErrorMessage name="soQuyen" class="text-danger" />
                    <div class="form-group d-flex mb-2">
                        <p class="text-muted fs-6 fw-bold">Đơn giá: &nbsp;</p>
                        <p class="card-text ">{{ book.donGia }}</p>
                    </div>
                    <ErrorMessage name="donGia" class="text-danger" />
                    <div class="form-group d-flex mb-2">
                        <p class="text-muted fs-6 fw-bold">Mô tả: &nbsp;</p>
                        <p class="card-text ">{{ book.moTa }}</p>
                    </div>
                    <div class="form-group mb-2">
                        <label for="hinhAnh" class="text-muted fs-6 fw-bold">Hình ảnh: </label>
                            <div class="d-flex flex-wrap p-2 mb-2 border-0"
                                style="border: 1px solid #ced4da; border-radius: 5px;">
                                <img v-for="(image, index) in previewImages" :key="index"
                                    :src="typeof image === 'string' ? image : image.duongDan"
                                    class="img-fluid"
                                    style="height: 150px; object-fit: cover; margin: 5px;" />
                            </div>
                    </div>
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-lg btn-success update-btn float-end"
                            @click.prevent="onSubmit">Xác nhận</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Form } from 'vee-validate';
import Swal from 'sweetalert2';

import bookService from '@/services/book.service';

const router = useRouter();
const route = useRoute();``
const loading = ref(false);
let book = ref({
    tenSach: '',
    maTL: { tenTL: '' },
    maTG: { tenTG: '' },
    maNXB: { tenNXB: '' },
    namXuatBan: '',
    soQuyen: '',
    donGia: '',
    moTa: '',
    hinhAnh: []
});
const previewImages = ref([]); // Danh sách ảnh xem trước

async function onSubmit() {
    const result = await Swal.fire({
        title: 'Xác nhận',
        text: "Bạn chắc chắn muốn chỉnh sửa thông tin sách này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: false,
        confirmButtonColor: '#198754'
    });

    if (!result.isConfirmed) return;

    loading.value = true;

    // Kiểm tra có ảnh mới được upload không
    const response = await bookService.deleteBook(book.value._id);

    if (response.status === 'success') {
        await Swal.fire({
            title: 'Thành công',
            text: 'Xóa sách thành công',
            icon: 'success',
            confirmButtonColor: '#198754'
        });
        isAdd.value = true;
        router.push({ name: 'book-list' });
    } else {
        await Swal.fire({
            title: 'Thất bại',
            text: 'Xóa sách thất bại',
            icon: 'error',
            confirmButtonColor: '#198754'
        });
    }

    loading.value = false;
}

async function fetchBook() {
    try {
        const bookId = useRoute().params.id;
        const response = await bookService.getBook(bookId);
        if (response.status === 'success') {
            book.value = response.data.book;

            // Nối thêm đường dẫn vào ảnh cũ
            previewImages.value = book.value.hinhAnh.map(img => ({
                duongDan: `http://127.0.0.1:8080${img.duongDan}`,
                isNew: false
            }));

        } else {
            book.value = {};
            previewImages.value = [];  
        }
    } catch (error) {
        console.log('Lỗi khi lấy thông tin sách:', error);
    }
}

onBeforeMount(async () => {
    await fetchBook();
    console.log(book.value);
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

.update-btn {
    transform: scale3d(0.8, 0.8, 0.8);
    transition: all 0.3s;
}

.update-btn:hover {
    transform: scale3d(0.9, 0.9, 0.9);
    transition: all 0.3s;
}

.form-check-input:checked {
    background-color: #198754;
    border-color: #198754;
}
</style>