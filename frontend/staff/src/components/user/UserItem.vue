<template>
    <li>
        <div class="card">
            <div class="card-body ">
                <div class="row">
                    <div class="col-8">
                        <div class="card-item d-flex gap-3 justify-content-start align-items-center">
                            <div class="card-title d-flex gap-2 p-2 " :class="isActiveUser">
                            <span>
                                <i :class="!user.kichHoat ? 'fas fa-times' : 'fas fa-check'"></i>                    
                            </span>
                            <span>{{ user.kichHoat? 'Đang hoạt động' : 'Đã khóa' }}</span>
                            </div>
                            <h5 class="card-title fw-bolder">{{ user.soDienThoai }}</h5>
                        </div>
                        <div class="card-item d-flex gap-1">
                            <p class=" text-muted fs-6 fw-bold">Họ tên:</p>
                            <p class="card-text ">{{ user.hoLot }} {{ user.ten }}</p>
                        </div>
                        <div class="card-item d-flex gap-1">
                            <p class=" text-muted fs-6 fw-bold">Ngày sinh:</p>
                            <p class="card-text ">{{ formatDate(user.ngaySinh) }}</p>
                        </div>  
                        <div class="card-item d-flex gap-1">
                            <p class=" text-muted fs-6 fw-bold">Giới tính:</p>
                            <p class="card-text ">{{ user.phai }}</p>
                        </div>
                        <div class="card-item d-flex gap-1">
                            <p class=" text-muted fs-6 fw-bold">Địa chỉ:</p>
                            <p class="card-text ">{{ user.diaChi }}</p>
                        </div> 
                    </div>
                    <div class="col-4">
                        <div class="d-flex justify-content-end">
                                                <router-link 
                        :to="{ name: 'user-edit', params: { id: user._id } }"
                        class="btn fs-6 text-muted edit-btn"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Chỉnh sửa"
                    >
                        <i class="fas fa-edit"></i>
                    </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
    import { computed } from 'vue';
    import {formatDate} from '@/utils/format.util';

    const props = defineProps(['user']);

    //Chuyển các props.user thành các biến dễ sử dụng
    const user = computed(() => props.user);

    //Chuyển ngày sinh thành ngày tháng năm
    user.ngaySinh = computed(() => formatDate(user.ngaySinh));

    const isActiveUser = computed(() =>  {
        return user.value.kichHoat ? 'badge rounded-pill bg-success' : 'badge rounded-pill bg-danger';
    });
</script>

<style scoped>
    .edit-btn i{
        width: 40px;
        height: 40px;
        text-align: center;
        transform: scale3d(1, 1, 1);
        transition: all 0.3s;
    }

    .edit-btn:hover i{
        color: #ffc107;
        transform: scale3d(1.2, 1.2, 1.2);
    }
</style>