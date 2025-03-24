<template>
    <div class="container bg-light d-flex justify-content-center">
        <div class="page">
            <div class="row mb-3">
                <div class="col-6">
                    <router-link :to="{ name: 'author-list' }" class="text-decoration-none float-start back-btn">
                        <i class="fas fa-arrow-left"></i> &nbsp;Quay lại trang trước
                    </router-link>
                </div>
            </div>
            <div class="px-5 py-3">
                <Form class="form" @submit="onSubmit" :validation-schema="authorFormSchema">
                    <legend class="text-center fw-bold">Thông tin tác giả mới</legend>
                    <div class="form-group mb-2">
                        <label for="tenTG" class="text-muted">Tên tác giả: </label>
                        <Field type="text" name="tenTG" id="tenTG" class="form-control" v-model="author.tenTG" />
                    </div>
                    <ErrorMessage name="tenTG" class="text-danger" />
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-lg btn-success update-btn float-end"
                            @click="updateAuthor">Thêm tác giả</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import authorService from '@/services/author.service';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const router = useRouter();
const isAdd = ref(false);
const loading = ref(false);
let author = ref({
    tenTG: '',
});

const authorFormSchema = yup.object({
    tenTG: yup.string().required('Tên tác giả không được để trống')
});

async function onSubmit() {
    const result = await Swal.fire({
        title: 'Xác nhận',
        text: "Bạn chắc chắn muốn thêm tác giả mới này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: false,
        confirmButtonColor: '#198754'
    });

    if (!result.isConfirmed) return;

    loading.value = true;

    //Add author
    const response = await authorService.addAuthor(author.value);

    if (response.status === 'success') {
        await Swal.fire({
            title: 'Thành công',
            text: 'Thêm tác giả mới thành công',
            icon: 'success',
            confirmButtonColor: '#198754'
        });
        isAdd.value = true;
        router.push({ name: 'author-list' });
    } else {
        await Swal.fire({
            title: 'Thất bại',
            text: 'Thêm tác giả mới thất bại',
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