<template>
    <div class="text-success">
        <p class="fs-5 fw-bold">Lịch sử mượn sách</p>
        <div class="status-borrow">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Mã sách</th>
                        <th class="text-center">Tên sách</th>
                        <th class="text-center">Ngày mượn</th>
                        <th class="text-center">Ngày trả</th>
                        <th class="text-center">Trạng thái</th>
                        <th class="text-center">Đơn giá (VNĐ)</th>
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
                        <td class='custom-col' data-bs-toggle="tooltip" data-bs-placement="top" :title="book.ngayTra">
                            {{ formatDate(book.ngayTra) }}
                        </td>
                        <td class='custom-col'>
                            <div class="badge bg-success text-wrap" 
                                v-if="book.ngayTra && 
                                    ((new Date(book.ngayTra).getTime() < new Date(book.ngayMuon).getTime() + 7*24*60*60*1000 && !book.giaHan) || 
                                    (new Date(book.ngayTra).getTime() < new Date(book.ngayMuon).getTime() + 14*24*60*60*1000 && book.giaHan))">
                                Đã trả
                            </div>
                            <div class="badge bg-danger text-wrap" 
                                v-else-if="book.ngayTra &&
                                        ((new Date(book.ngayTra).getTime() > new Date(book.ngayMuon).getTime() + 7*24*60*60*1000 && !book.giaHan) || 
                                        (new Date(book.ngayTra).getTime() > new Date(book.ngayMuon).getTime() + 14*24*60*60*1000 && book.giaHan))">
                                Quá hạn
                            </div>
                        </td>
                        <td class='custom-col text-center'>
                            {{ book.maSach.donGia }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="text-danger">
            <span> Tổng số tiền phạt của bạn là: &nbsp;</span>
            <span class="fw-bold">{{ total }} VNĐ</span>
            <p>Vui lòng đến thư viện để đóng tiền phạt. Nếu quá hạn sách, bạn sẽ bị khóa tài khoản vĩnh viễn </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { defineProps } from 'vue';
import { formatDate } from '@/utils/format.util';

const props = defineProps(['status']);
const total = ref(0);
console.log(props.status);

onBeforeMount(() => {
    total.value = props.status.reduce((acc, book) => {
        return acc + (book.maSach?.donGia || 0); // Kiểm tra tránh lỗi undefined
    }, 0);
});
</script>

<style scoped>
.custom-col {
    text-align: center;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>