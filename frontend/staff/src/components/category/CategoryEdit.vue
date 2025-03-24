<template>
    <div class="container bg-light d-flex justify-content-center">
        <div class="page">
            <div class="row mb-3">
                <div class="col-6">
                    <router-link :to="{ name: 'category-list' }" class="text-decoration-none float-start back-btn">
                        <i class="fas fa-arrow-left"></i> &nbsp;Quay lại trang trước
                    </router-link>
                </div>
            </div>
            <div class="px-5 py-3">
                <Form class="form" @submit="onSubmit" :validation-schema="categoryFormSchema">
                    <legend class="text-center fw-bold">Chỉnh sửa thông tin thể loại</legend>
                    <div class="form-group mb-2">
                        <label for="tenTL" class="text-muted">Tên thể loại: </label>
                        <Field type="text" name="tenTL" id="tenTL" class="form-control" v-model="category.tenTL" />
                    </div>
                    <ErrorMessage name="tenTL" class="text-danger" />
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-lg btn-success update-btn float-end"
                            @click.prevent="onSubmit">Cập nhật</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import categoryService from '@/services/category.service';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const isUpdated = ref(false);
let category = ref({});

const categoryFormSchema = yup.object({
    tenTL: yup.string().required('Tên thể loại không được để trống')
});

async function onSubmit() {
    const result = await Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc muốn cập nhật thông tin thể loại này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: false,
        confirmButtonColor: '#198754'
    });

    if (!result.isConfirmed) return;

    loading.value = true;

    //Update category
    const response = await categoryService.updateCategory(route.params.id, category.value);

    if (response.status === 'success') {
        isUpdated.value = true;
        await Swal.fire({
            title: 'Thành công',
            text: 'Cập nhật thông tin thể loại thành công',
            icon: 'success',
            confirmButtonColor: '#198754'
        });
        isUpdated.value = true;
        router.push({ name: 'category-list' });
    } else {
        await Swal.fire({
            title: 'Thất bại',
            text: 'Cập nhật thông tin thể loại thất bại',
            icon: 'error',
            confirmButtonColor: '#198754'
        });
    }

    loading.value = false;
}


onBeforeMount(async () => {
    const id = route.params.id;
    const response = await categoryService.getCategory(id);

    if (response.status === 'success') {
        category.value = response.data.category;
    } else {
        router.push({ name: 'category-list' });
    }
});

onBeforeRouteLeave(async () => {
    if (isUpdated.value) return true;
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
</style>