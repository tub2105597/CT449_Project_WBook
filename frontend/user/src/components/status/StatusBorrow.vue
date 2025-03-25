<template>
    <div class="text-success">
        <p class="fs-5 fw-bold">Sách đang mượn</p>
        <div class="status-borrow">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Mã sách</th>
                        <th class="text-center">Tên sách</th>
                        <th class="text-center">Ngày mượn</th>
                        <th class="text-center">Gia hạn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(book, index) in status" :key="book.id">
                        <td class="text-center fw-bold">{{ index + 1 }}</td>
                        <td class='custom-col' data-bs-toggle="tooltip" data-bs-placement="top" :title="book.maSach._id">
                            {{ book._id }}
                        </td>
                        <td class='custom-col' data-bs-toggle="tooltip" data-bs-placement="top" :title="book.maSach.tenSach">
                            {{ book.maSach.tenSach }}
                        </td>
                        <td class='custom-col' data-bs-toggle="tooltip" data-bs-placement="top" :title="book.ngayMuon">
                            {{ formatDate(book.ngayMuon) }}
                        </td>   
                        <td class='custom-col' :class="{ 'enableExtendIcon': !book.giaHan }" @click="extendBook(book)"
                            data-bs-toggle="tooltip" data-bs-placement="top" :title="book.giaHan ? 'Gia hạn thành công' : ''">
                            <i class="fas fa-clock" :class="{ 'text-success': book.giaHan }"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { formatDate } from '@/utils/format.util';
import Swal from 'sweetalert2';
import statusService from '@/services/status.service';

const props = defineProps(['status']);

async function extendBook(book) {
    if(book.giaHan) {
        await Swal.fire({
            icon: 'error',
            title: 'Gia hạn thất bại',
            text: 'Sách đã được gia hạn hoặc đã quá hạn gia hạn'
        });
        return;
    }

    const payload = {
        giaHan: true,
    };

    const response =await statusService.updateStatus(book._id, payload);
    if(response.status === 200) {
        await Swal.fire({
            icon: 'success',
            title: 'Gia hạn thành công',
            text: 'Sách đã được gia hạn thêm 7 ngày'
        });
        book.giaHan = true;
    } else {
        await Swal.fire({
            icon: 'error',
            title: 'Gia hạn thất bại',
            text: 'Có lỗi xảy ra, vui lòng thử lại sau'
        });
    }    
}
</script>

<style scoped>
.custom-col {
    text-align: center;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.enableExtendIcon {
    cursor: pointer;
}

.enableExtendIcon:hover {
    color: #198754;
}
</style>