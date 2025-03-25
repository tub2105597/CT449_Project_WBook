<template>
    <div class="container bg-light d-flex justify-content-center"> 
        <div class="page">
            <div class="row mb-3">
                <div class="col-6">
                    <router-link to="/staff" class="text-decoration-none float-start back-btn">
                        <i class="fas fa-arrow-left"></i> &nbsp;Quay lại trang trước
                    </router-link>
                </div>
            </div>
            <div class="px-5 py-3">
                <Form class="form" @submit="onSubmit" :validation-schema="staffFormSchema">
                    <legend class="text-center fw-bold">Chỉnh sửa thông tin nhân viên</legend>
                    <div class="form-group mb-2">
                        <label for="email" class="text-muted">Mã NV: </label>
                        <input type="text" name="maNV" id="maNV" class="form-control" v-model="staff.maNV" disabled/>
                    </div>
                    <div class="form-group mb-2" v-if="isChangePassword">
                        <label for="matKhau" class="text-muted">Mật khẩu mới: </label>
                        <Field type="password" name="matKhau" id="matKhau" class="form-control" v-model="staff.matKhau"/>
                    </div>
                    <div class="form-group mb-2">
                        <label for="hoTen" class="text-muted">Họ tên: </label>
                        <Field type="text" name="hoTen" id="hoTen" class="form-control" v-model="staff.hoTen"/> 
                    </div>
                    <ErrorMessage name="hoTen" class="text-danger" />
                    <div class="form-group mb-3">
                        <label for="soDienThoai" class="text-muted">Số điện thoại: </label>
                        <Field type="text" name="soDienThoai" id="soDienThoai" class="form-control" v-model="staff.soDienThoai"/>
                    </div>
                    <ErrorMessage name="soDienThoai" class="text-danger" />
                    <div class="form-group mb-3">
                        <label for="diaChi" class="text-muted">Địa chỉ: </label>
                        <Field type="text" name="diaChi" id="diaChi" class="form-control" v-model="staff.diaChi"/>
                    </div>
                    <ErrorMessage name="diaChi" class="text-danger" />
                    <div class="form-group mb-3">
                        <div class="form-check">
                            <label for="kichHoat" class="form-check-label text-muted">Kích hoạt tài khoản </label>
                            <Field type="checkbox" name="kichHoat" id="kichHoat" class="form-check-input" v-model="staff.kichHoat"/>
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <button type="button" class="btn btn-warning update-btn float-start" @click="isChangePassword = true">Đổi mật khẩu</button>
                        <button type="submit" class="btn btn-success update-btn float-end" @click.prevent="onSubmit">Cập nhật</button>
                    </div>
                </Form>
            </div>
        </div>    
    </div>
</template>

<script setup>
    import { onBeforeMount, ref } from 'vue';
    import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
    import staffService from '@/services/staff.service';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';
    import Swal from 'sweetalert2';

    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const isUpdated = ref(false);
    const isChangePassword = ref(false);
    let staff = ref({
        maNV: '',
        matKhau: '',
        hoTen: '',
        soDienThoai: '',
        diaChi: '',
        kichHoat: false
    });

    const staffFormSchema = yup.object({
        matKhau: yup.string().required('Mật khẩu không được để trống'),
        soDienThoai: yup
            .string()
            .required('Số điện thoại không được để trống'),
        hoTen: yup.string().required('Họ tên không được để trống'),
        diaChi: yup.string().required('Địa chỉ không được để trống'),
        kichHoat: yup.boolean().required('Trạng thái không được để trống')
    });

    async function onSubmit() {
        const result = await Swal.fire({
            title: 'Xác nhận',
            text: 'Bạn có chắc muốn cập nhật thông tin tài khoản này không?',
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
                matKhau: staff.value.matKhau,
                hoTen: staff.value.hoTen,
                soDienThoai: staff.value.soDienThoai,
                diaChi: staff.value.diaChi,
                kichHoat: staff.value.kichHoat
            }

        if (!isChangePassword.value) {
            delete payload.matKhau;
        }

        //Update staff
        const response = await staffService.updateStaff(route.params.id, payload);

        if (response.status === 'success') {
            isUpdated.value = true;
            await Swal.fire({
                title: 'Thành công',
                text: 'Cập nhật thông tin nhân viên thành công',
                icon: 'success',
                confirmButtonColor: '#198754'
            });
            isUpdated.value = true;
            router.push({name: 'staff-list'});
        } else {
            await Swal.fire({
                title: 'Thất bại',
                text: 'Cập nhật thông tin tài khoản thất bại',
                icon: 'error',
                confirmButtonColor: '#198754'
            });
        }

        loading.value = false;
    }


    onBeforeMount(async () => {
        const id = route.params.id;
        const response = await staffService.getStaff(id);
        
        if (response.status === 'success') {
            staff.value = response.data.staff;
        } else {
            router.push('/staff');
        }

        console.log(typeof staff.value.kichHoat, staff.value.kichHoat);

        console.log(staff.value);
    });

    onBeforeRouteLeave( async() => {
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
        transform: scale3d( 0.9, 0.9, 0.9);
        transition: all 0.3s;
    }
</style>