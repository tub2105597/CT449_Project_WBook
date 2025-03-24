<template>
    <div class="container bg-light d-flex justify-content-center">
        <div class="page">
            <div class="row mb-3">
                <div class="col-6">
                    <router-link :to="{ name: 'publisher-list' }" class="text-decoration-none float-start back-btn">
                        <i class="fas fa-arrow-left"></i> &nbsp;Quay lại trang trước
                    </router-link>
                </div>
            </div>
            <div class="px-5 py-3">
                <Form class="form" @submit="onSubmit" :validation-schema="publisherFormSchema">
                    <legend class="text-center fw-bold">Thông tin nhà xuất bản mới</legend>
                    <div class="form-group mb-2">
                        <label for="tenNXB" class="text-muted">Tên nhà xuất bản: </label>
                        <Field type="text" name="tenNXB" id="tenNXB" class="form-control" v-model="publisher.tenNXB" />
                    </div>
                    <ErrorMessage name="tenNXB" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="diaChi" class="text-muted">Địa chỉ: </label>
                        <Field type="text" name="diaChi" id="diaChi" class="form-control" v-model="publisher.diaChi" />
                    </div>
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-lg btn-success update-btn float-end">Thêm nhà xuất
                            bản</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import publisherService from '@/services/publisher.service';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const router = useRouter();
const isAdd = ref(false);
const loading = ref(false);
let publisher = ref({
    tenNXB: '',
    diaChi: ''
});

const publisherFormSchema = yup.object({
    tenNXB: yup.string().required('Tên nhà xuất bản không được để trống'),
    diaChi: yup.string().required('Địa chỉ không được để trống')
});

async function onSubmit() {
    console.log('submit');
    const result = await Swal.fire({
        title: 'Xác nhận',
        text: "Bạn chắc chắn muốn thêm nhà xuất bản mới này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: false,
        confirmButtonColor: '#198754'
    });

    if (!result.isConfirmed) return;

    loading.value = true;

    //Add publisher
    const response = await publisherService.addPublisher(publisher.value);

    if (response.status === 'success') {
        await Swal.fire({
            title: 'Thành công',
            text: 'Thêm nhà xuất bản mới thành công',
            icon: 'success',
            confirmButtonColor: '#198754'
        });
        isAdd.value = true;
        router.push({ name: 'publisher-list' });
    } else {
        await Swal.fire({
            title: 'Thất bại',
            text: 'Thêm nhà xuất bản mới thất bại',
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