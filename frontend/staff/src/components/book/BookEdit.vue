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
                    <legend class="text-center fw-bold">Chỉnh sửa thông tin sách</legend>
                    <div class="form-group mb-2">
                        <label for="tenSach" class="text-muted">Tên sách: </label>
                        <Field type="text" name="tenSach" id="tenSach" class="form-control" v-model="book.tenSach" />
                    </div>
                    <ErrorMessage name="tenSach" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="tenTL" class="text-muted">Tên thể loại: </label>
                        <Field as="select" name="tenTL" id="tenTL" class="form-control" v-model="book.maTL">
                            <option value="">Chọn thể loại</option>
                            <option v-for="category in categories" :key="category._id" :value="category._id">
                                {{ category.tenTL }}
                            </option>
                        </Field>
                    </div>
                    <ErrorMessage name="tenTL" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="tenTG" class="text-muted">Tên tác giả: </label>
                        <Field as="select" name="tenTG" id="tenTG" class="form-control" v-model="book.maTG">
                            <option value="">Chọn tác giả</option>
                            <option v-for="author in authors" :key="author._id" :value="author._id">
                                {{ author.tenTG }}
                            </option>
                        </Field>
                    </div>
                    <ErrorMessage name="tenTG" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="tenNXB" class="text-muted">Tên nhà xuất bản: </label>
                        <Field as="select" name="tenNXB" id="tenNXB" class="form-control" v-model="book.maNXB">
                            <option value="">Chọn nhà xuất bản</option>
                            <option v-for="publisher in publishers" :key="publisher._id" :value="publisher._id">
                                {{ publisher.tenNXB }}
                            </option>
                        </Field>
                    </div>
                    <ErrorMessage name="tenNXB" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="namXuatBan" class="text-muted">Năm xuất bản: </label>
                        <Field type="text" name="namXuatBan" id="namXuatBan" class="form-control"
                            v-model="book.namXuatBan" />
                    </div>
                    <ErrorMessage name="namXuatBan" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="soQuyen" class="text-muted">Số lượng tồn kho: </label>
                        <Field type="text" name="soQuyen" id="soQuyen" class="form-control" v-model="book.soQuyen" />
                    </div>
                    <ErrorMessage name="soQuyen" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="donGia" class="text-muted">Đơn giá: </label>
                        <Field type="text" name="donGia" id="donGia" class="form-control" v-model="book.donGia" />
                    </div>
                    <ErrorMessage name="donGia" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="moTa" class="text-muted">Mô tả: </label>
                        <Field as="textarea" name="moTa" id="moTa" class="form-control" v-model="book.moTa" />
                    </div>
                    <div class="form-group mb-2">
                        <label for="hinhAnh" class="text-muted">Hình ảnh: </label>
                            <div class="d-flex flex-wrap bg-white p-2 mb-2"
                                style="border: 1px solid #ced4da; border-radius: 5px;">
                                <img v-for="(image, index) in previewImages" :key="index"
                                    :src="typeof image === 'string' ? image : image.duongDan"
                                    class="img-fluid"
                                    style="height: 150px; object-fit: cover; margin: 5px;" />
                            </div>
                        <input type="file" name="hinhAnh" id="hinhAnh" class="form-control" multiple
                            @change="handleImageUpload" />
                    </div>
                    <ErrorMessage name="hinhAnh" class="text-danger" />
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-lg btn-success update-btn float-end">Cập nhật</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import Swal from 'sweetalert2';

import bookService from '@/services/book.service';
import authorService from '@/services/author.service';
import categoryService from '@/services/category.service';
import publisherService from '@/services/publisher.service';
import imageService from '@/services/image.service';

const router = useRouter();
const route = useRoute();``
const isAdd = ref(false);
const loading = ref(false);
let book = ref({});
const authors = ref([]);
const categories = ref([]);
const publishers = ref([]);
const previewImages = ref([]); // Danh sách ảnh xem trước
const imageFiles = ref([]); // Danh sách file ảnh


// const bookFormSchema = yup.object({
//     tenSach: yup.string().required('Tên sách không được để trống'),
//     maTL: yup.string()
//         .matches(/^[0-9a-fA-F]{24}$/, 'Thể loại không hợp lệ')
//         .required('Thể loại không được để trống'),
//     maTG: yup.string()
//         .matches(/^[0-9a-fA-F]{24}$/, 'Tác giả không hợp lệ')
//         .required('Tác giả không được để trống'),
//     maNXB: yup.string()
//         .matches(/^[0-9a-fA-F]{24}$/, 'Nhà xuất bản không hợp lệ')
//         .required('Nhà xuất bản không được để trống'),
//     namXuatBan: yup.number()
//         .required('Năm xuất bản không được để trống')
//         .test('is-valid-year', 'Năm xuất bản không hợp lệ', value => {
//             const currentYear = new Date().getFullYear();
//             return value <= currentYear;
//         }),
//     soQuyen: yup.number().required('Số lượng không được để trống').min(0, 'Số lượng không được nhỏ hơn 0'),
//     donGia: yup.number().required('Đơn giá không được để trống').min(0, 'Đơn giá không được nhỏ hơn 0'),
//     moTa: yup.string().required('Mô tả không được để trống'),
//     hinhAnh: yup.array().min(1, 'Hình ảnh không được để trống')
// });


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
    if (imageFiles.value.length > 0) {
        const images = await imageService.uploadImages(imageFiles.value);
        const newImages = images.data.map(img => ({ duongDan: img.duongDan }));
        book.value.hinhAnh = [...book.value.hinhAnh, ...newImages];
    }


    const bookToUpdate = {
        ...book.value,
        maNXB: book.value.maNXB?._id || book.value.maNXB, 
        maTG: book.value.maTG?._id || book.value.maTG, 
        maTL: book.value.maTL?._id || book.value.maTL,
    };

    console.log('Book to update:', bookToUpdate);

    const response = await bookService.updateBook(route.params.id, bookToUpdate);

    if (response.status === 'success') {
        await Swal.fire({
            title: 'Thành công',
            text: 'Chỉnh sửa thông tin sách thành công',
            icon: 'success',
            confirmButtonColor: '#198754'
        });
        isAdd.value = true;
        router.push({ name: 'book-list' });
    } else {
        await Swal.fire({
            title: 'Thất bại',
            text: 'Chỉnh sửa thông tin sách thất bại',
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

const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Chuyển file thành URL tạm thời để xem trước
    const newImages = files.map(file => ({
        duongDan: URL.createObjectURL(file),
        isNew: true
    }));

    // Giữ ảnh cũ từ API + ảnh mới từ input file
    previewImages.value = [
        ...book.value.hinhAnh.map(img => ({
            duongDan: `http://127.0.0.1:8080${img.duongDan}`,
            isNew: false
        })), 
        ...newImages
    ];

    // Lưu file mới để upload lên server
    imageFiles.value = files;
};




async function fetchBook() {
    try {
        const bookId = useRoute().params.id;
        const response = await bookService.getBook(bookId);
        if (response.status === 'success') {
            book.value = response.data.book;

            // Chuyển các giá trị object thành `_id`
            if (book.value.maNXB && typeof book.value.maNXB === 'object') {
                book.value.maNXB = book.value.maNXB._id;
            }
            if (book.value.maTG && typeof book.value.maTG === 'object') {
                book.value.maTG = book.value.maTG._id;
            }
            if (book.value.maTL && typeof book.value.maTL === 'object') {
                book.value.maTL = book.value.maTL._id;
            }

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


async function fetchAuthors() {
    try {
        const response = await authorService.getAllAuthors();
        if (response.status === 'success') {
            authors.value = JSON.parse(JSON.stringify(response.data.authors));
        } else {
            authors.value = [];
        }
    } catch (error) {
        console.log('Lỗi khi lấy danh sách tác giả:', error);
    }
}

async function fetchCategories() {
    try {
        const response = await categoryService.getAllCategories();
        if (response.status === 'success') {
            categories.value = JSON.parse(JSON.stringify(response.data.categories));
        } else {
            categories.value = [];
        }
    } catch (error) {
        console.log('Lỗi khi lấy danh sách thể loại:', error);
    }
}

async function fetchPublishers() {
    try {
        const response = await publisherService.getAllPublishers();
        if (response.status === 'success') {
            publishers.value = JSON.parse(JSON.stringify(response.data.publishers));
        } else {
            publishers.value = [];
        }
    } catch (error) {
        console.log('Lỗi khi lấy danh sách nhà xuất bản:', error);
    }
}

onBeforeMount(async () => {
    await fetchBook();
    await fetchAuthors();
    await fetchCategories();
    await fetchPublishers();
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