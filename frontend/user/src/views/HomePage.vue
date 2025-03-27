<template>
    <div class="container page">
        <div class="row">
            <div :class="isDetail ? 'col-7' : 'col-12'">  
                <div class="row section justify-content-center">
                    <div style="max-width: 1000px;">
                        <input 
                            type="text" 
                            class="form-control mb-3" 
                            placeholder="Nhập tên sách bạn cần tìm" 
                            v-model="query"
                            @keyup.enter="searchBook"
                        />
                    </div>
                    <div v-if="isSearch" class="d-flex justify-content-center">
                        <h4 class="text-start mb-3">Kết quả tìm kiếm</h4>
                    </div>
                    <div class="d-flex justify-content-center">
                        <BookList :selectBookDetail="selectBookDetail" :searchQuery="searchQuery"/>
                    </div>  
                </div>
            </div>
            <div v-if="isDetail" class="col-5 p-0 border border-light-subtle rounded">
                <div class="aside p-3">
                    <div class="d-flex">
                        <i class="fas fa-arrow-left fs-5 text-link" @click="isDetail = false"/>
                    </div>
                    <div class="d-flex justify-content-center">
                        <img v-if="bookDetail?.hinhAnh && bookDetail.hinhAnh.length > 0"
                            :src="'http://127.0.0.1:8080' + bookDetail.hinhAnh[0].duongDan" class="img-detail"
                            alt="Book image" />
                    </div> 
                    <div class="d-flex flex-column justify-content-center mt-2 gap-0">
                        <h4 class="text-center fw-bold m-0">{{ bookDetail?.tenSach }}</h4>
                        <p class="text-center fs-6 text-link">{{ bookDetail?.maTG?.tenTG }}</p>
                    </div> 
                    <div class="d-flex justify-content-center justify-content-between">
                        <div class="d-flex flex-column justify-content-center align-items-center">
                            <p class="fs-6 fw-bold text-muted m-0">Số quyển còn lại:</p>
                            <p class="fs-6 fw-bold ">{{ bookDetail?.soQuyen }}</p>
                        </div>
                        <div class="d-flex flex-column justify-content-center align-items-center">
                            <p class="fs-6 fw-bold text-muted m-0">Thể loại</p>
                            <p class="fs-6 text-link">{{ bookDetail?.maTL?.tenTL }}</p>
                        </div>
                    </div>
                    <div class="d-flex flex-column justify-content-start align-items-start mt-1 gap-0">
                        <div class="d-flex justify-content-center align-items-center gap-2">
                            <p class="fs-6 fw-bold text-muted">Nhà xuất bản:</p>
                            <p class="fs-6 text-link">{{ bookDetail?.maNXB?.tenNXB }}</p>
                        </div>
                        <div class="d-flex justify-content-center align-items-center gap-2">
                            <p class="fs-6 fw-bold text-muted">Năm xuất bản:</p>
                            <p class="fs-6">{{ bookDetail?.namXuatBan }}</p>
                        </div>
                        <div class="d-flex justify-content-center align-items-start gap-2">
                            <p class="fs-6 fw-bold text-muted">Mô tả:</p>
                            <p class="fs-6 "
                                style="max-width: 400px; text-overflow: ellipsis; overflow: hidden;"
                            >{{ bookDetail?.moTa }}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-lg btn-outline-success" @click="addStatus()">Mượn sách</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref} from 'vue'
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useUserStore } from '@/stores/user.store';
import BookList from '@/components/book/BookList.vue';
import statusService from '@/services/status.service';

const store = useUserStore();
const isSearch = ref(false);
const isDetail = ref(false);
const loading = ref(false);
const bookDetail = ref({});
const query = ref('');
const searchQuery = ref('');
const router = useRouter();

async function selectBookDetail(book) {
    bookDetail.value = book;
    isDetail.value = true;
    console.log('Chi tiết sách:', bookDetail.value);
}

async function addStatus() {
    loading.value = true;
    const result = await Swal.fire({
        title: `Người mượn sách cam kết sẽ hoàn trả sách đúng hạn`,
        text: `Nếu quá hạn mà không trả, người mượn đồng ý thanh toán số tiền tương đương với giá trị của quyển sách ${bookDetail.value.tenSach}: ${bookDetail.value.donGia}đ.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#198754',
        cancelButtonColor: '#dc3545',
    });

    if (!result.isConfirmed) {
        return;
    }

    const payload = {
        maSach: bookDetail.value._id,
        maDG: store.soDienThoai,
        ngayMuon: new Date(),
        ngayHetHan: new Date(),
        giaHan: false,
    };

    const response = await statusService.addStatus(payload);
    Swal.fire({
        title: 'Mượn sách thành công',
        text:'Hãy đến thư viện nhận sách sớm nhất',
        icon: 'success',
        confirmButtonColor: '#198754',
    });
    loading.value = false;
    isDetail.value = false;
    bookDetail.value = {};
    router.push('/profile');
    console.log('response: ' + response);
}

const searchBook = () => {
    searchQuery.value = query.value;
    isSearch.value = true;
};


</script>

<style scoped>
    .page {
        max-width: 1300px;
    }

    .img-detail {
        width: 80px;
    }

    .text-link:hover {
        color: #198754;
    }

</style>