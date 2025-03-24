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
                <Form class="form" @submit="onSubmit">
                    <legend class="text-center fw-bold">Xóa thể loại</legend>
                    <div class="form-group d-flex mb-2">
                        <p class="text-muted fs-6 fw-bold">Tên thể loại: &nbsp;</p>
                        <p class="card-text ">{{ category.tenTL }}</p>
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
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import categoryService from '@/services/category.service';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
let category = ref({});

async function onSubmit() {
    const result = await Swal.fire({
        title: 'Xác nhận',
        text: "Bạn chắc chắn muốn xóa thể loại này chứ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: false,
        confirmButtonColor: '#198754'
    });

    if (!result.isConfirmed) return;

    loading.value = true;

    //Delete category
    const response = await categoryService.deleteCategory(route.params.id);

    await Swal.fire({
        title: 'Thành công',
        text: 'Xóa thể loại thành công',
        icon: 'success',
        confirmButtonColor: '#198754'
    });
    router.push({ name: 'category-list' });

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