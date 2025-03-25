<template>
    <div class="">
        <div class="row">
            <p class="text-success fs-5 fw-bold">Thông tin cá nhân</p>
        </div>
        <div class="row">
            <div class="col-2">
                <div class="bg-white p-2 shadow-sm d-flex justify-content-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/archive/5/59/20201213175628%21User-avatar.svg" 
                        alt="avatar" class="img-thumbnail"
                        style="width: 100px; height: 100px;">
                </div>
            </div>
            <div class="col-10">
                <p class="fs-5 fw-bold mb-3">{{ user.hoLot }} {{ user.ten }}</p>
                <div class="d-flex gap-1">
                    <p class="fs-6 fw-bold">Số điện thoại:</p>
                    <p class="fs-6">{{ user.soDienThoai }}</p>
                </div>
                <div class="d-flex gap-1">
                    <p class="fs-6 fw-bold">Ngày sinh:</p>
                    <p class="fs-6">{{ formatDate(user.ngaySinh) }}</p>
                </div>
                <div class="d-flex gap-1">
                    <p class="fs-6 fw-bold">Địa chỉ:</p>
                    <p class="fs-6">{{ user.diaChi }}</p>
                </div>
                <div class="d-flex gap-1">
                    <p class="fs-6 fw-bold">Giới tính:</p>
                    <p class="fs-6">{{ user.gioiTinh == 'Nu' ? 'Nữ' : 'Nam' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { formatDate } from '@/utils/format.util';

const props  = defineProps(['user']);
</script>