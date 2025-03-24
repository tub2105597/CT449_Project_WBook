<template>
    <div class="container bg-light d-flex justify-content-center"> 
        <div class="page">
            <div class="row mb-3">
                <div class="col-6">
                    <router-link :to="{name: 'user-list'}" class="text-decoration-none float-start back-btn">
                        <i class="fas fa-arrow-left"></i> &nbsp;Quay lại trang trước
                    </router-link>
                </div>
            </div>
            <div class="px-5 py-3">
                <Form class="form" @submit="onSubmit" :validation-schema="userFormSchema">
                    <legend class="text-center fw-bold">Thông tin tài khoản mới</legend>
                    <div class="form-group mb-3">
                        <label for="soDienThoai" class="text-muted">Số điện thoại: </label>
                        <Field type="text" name="soDienThoai" id="soDienThoai" class="form-control" v-model="user.soDienThoai"/>
                    </div>
                    <ErrorMessage name="soDienThoai" class="text-danger" />
                    <div class="form-group mb-2">
                        <label for="hoLot" class="text-muted">Họ lót: </label>
                        <Field type="text" name="hoLot" id="hoLot" class="form-control" v-model="user.hoLot"/> 
                    </div>
                    <ErrorMessage name="hoLot" class="text-danger" />
                    <div class="form-group mb-3">
                        <label for="ten" class="text-muted">Tên: </label>
                        <Field type="text" name="ten" id="ten" class="form-control" v-model="user.ten"/>
                    </div>
                    <ErrorMessage name="ten" class="text-danger" />
                    <div class="form-group">
                        <label for="matKhau" class="text-muted">Mật khẩu: </label>
                        <Field type="password" name="matKhau" id="matKhau" class="form-control" v-model="user.matKhau"/>
                    </div>
                    <ErrorMessage name="matKhau" class="text-danger" />
                    <div class="form-group mb-3">
                        <label for="ngaySinh" class="text-muted">Ngày sinh: </label>
                        <Field type="date" name="ngaySinh" id="ngaySinh" class="form-control" v-model="user.ngaySinh"/>
                    </div>
                    <ErrorMessage name="ngaySinh" class="text-danger" />
                    <div class="form-group mb-3">
                        <label for="phai" class="text-muted">Phái: </label>
                        <Field as="select" name="phai" id="phai" class="form-control" v-model="user.phai">
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </Field>
                    </div>
                    <ErrorMessage name="phai" class="text-danger" />
                    <div class="form-group mb-3">
                        <label for="diaChi" class="text-muted">Địa chỉ: </label>
                        <Field type="text" name="diaChi" id="diaChi" class="form-control" v-model="user.diaChi"/>
                    </div>
                    <ErrorMessage name="diaChi" class="text-danger" />
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-lg btn-success update-btn float-end" @click="updateUser">Tạo tài khoản</button>
                    </div>
                </Form>
            </div>
        </div>    
    </div>
</template>

<script setup>
    import {  ref } from 'vue';
    import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
    import userService from '@/services/user.service';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';
    import Swal from 'sweetalert2';

    const router = useRouter();
    const route = useRoute();
    const isAdd = ref(false);
    const loading = ref(false);
    let user = ref({
        soDienThoai: '',
        hoLot: '',
        ten: '',
        matKhau: '',
        ngaySinh: '',
        phai: '',
        diaChi: '',
        kichHoat: true,
    });

    const userFormSchema = yup.object({
        soDienThoai: yup
            .string()
            .required('Số điện thoại không được để trống')
            .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
        hoLot: yup.string().required('Họ lót không được để trống'),
        ten: yup.string().required('Tên không được để trống'),
        matKhau: yup.string().required('Mật khẩu không được để trống').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        ngaySinh: yup
            .date()
            .required('Ngày sinh không được để trống')
            .test('check-date', 'Ngày sinh không hợp lệ', (value) => {
                const date = new Date(value);
                return date instanceof Date && !isNaN(date);
            }),
        phai: yup.string(),
        diaChi: yup.string().required('Địa chỉ không được để trống'),
        kichHoat: yup.boolean().default(true),
    });

    async function onSubmit() {
        const result = await Swal.fire({
            title: 'Xác nhận',
            text: "Bạn chắc chắn muốn tạo tài khoản mới này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: false,
            confirmButtonColor: '#198754'
        });

        if (!result.isConfirmed) return;

        loading.value = true;

        user.value.xacNhanMatKhau = user.value.matKhau;

        //Add user
        const response = await userService.addUser(user.value);

        console.log(user.value);
    
        if (response.status === 'success') {
            await Swal.fire({
                title: 'Thành công',
                text: 'Thêm tài khoản mới thành công',
                icon: 'success',
            });
            isAdd.value = true;
            router.push({name: 'user-list'});
        } else {
            await Swal.fire({
                title: 'Thất bại',
                text: 'Thêm tài khoản mới thất bại',
                icon: 'error',
            });
        }

        loading.value = false;
    }

    onBeforeRouteLeave( async() => {
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
        transform: scale3d( 0.9, 0.9, 0.9);
        transition: all 0.3s;
    }

    .form-check-input:checked {
        background-color: #198754;
        border-color: #198754;
    }
</style>