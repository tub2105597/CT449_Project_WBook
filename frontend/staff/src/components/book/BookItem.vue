<template>
    <li>
        <div class="card">
            <div class="card-body ">
                <div class="col">
                <div class="row mb-2">
                    <div class="col-10">
                        <div class="d-flex justify-content-start">
                            <div class="btn fs-6 fw-bold detail-btn text-link" data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Chi tiết">
                            # {{ book._id }}
                            </div>
                        </div>
                    </div>

                        <div class="col-2">
                        <div class="d-flex justify-content-end">
                            <router-link :to="{ name: 'book-edit', params: { id: book._id } }"
                                class="btn fs-6 text-muted edit-btn" data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Chỉnh sửa">
                                <i class="fas fa-edit"></i>
                            </router-link>
                            <router-link :to="{ name: 'book-delete', params: { id: book._id } }"
                                class="btn fs-6 p-2 text-muted delete-btn" data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Xóa">
                                <i class="fas fa-trash-alt"></i>
                            </router-link>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-2 d-flex justify-content-center align-items-center">
                        <div class="d-flex justify-content-center align-items-center w-80">
                            <img v-if="book.hinhAnh && book.hinhAnh.length > 0"
                                :src="'http://127.0.0.1:8080' + book.hinhAnh[0].duongDan" class="img-fluid"
                                alt="Book image" />
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="card-item d-flex">
                            <p class=" text-muted fs-7 fw-bold">Tên sách:&nbsp;</p>
                            <p class="card-text fs-7 text-truncate">{{ book.tenSach }}</p>
                        </div>
                        <div class="card-item d-flex ">
                            <p class=" text-muted fs-7 fw-bold">Tác giả:&nbsp;</p>
                            <router-link :to="{ name: 'author-edit', params: { id: book.maTG._id } }"
                                class="card-text fs-7 text-truncate text-decoration-none text-link">{{ book.maTG.tenTG }}</router-link>
                        </div>
                        <div class="card-item d-flex ">
                            <p class=" text-muted fs-7 fw-bold">Nhà xuất bản:&nbsp;</p>
                            <router-link :to="{ name: 'publisher-edit', params: { id: book.maNXB._id } }"
                                class="card-text fs-7 text-truncate text-decoration-none text-link">{{ book.maNXB.tenNXB }}</router-link>
                        </div>
                        <div class="card-item d-flex ">
                            <p class=" text-muted fs-7 fw-bold">Số quyển:&nbsp;</p>
                            <p class="card-text fs-7 fw-bold" :class="book.soQuyen > 1 ? 'text-success' : 'text-danger'">{{ book.soQuyen }}</p>
                        </div>
                        <div class="card-item d-flex ">
                            <p class=" text-muted fs-7 fw-bold">Đơn giá:&nbsp;</p>
                            <p class="card-text fs-7 ">{{ book.donGia }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </li>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Tooltip } from 'bootstrap';

const props = defineProps(['book']);

const book = ref(props.book);

onMounted(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new Tooltip(el));
});

</script>

<style scoped>
.fs-7 {
    font-size: 0.875rem;
}

.w-80 {
    width: 80%;
}

.card-item {
    height: 35px;
}

.edit-btn,
.delete-btn {
    width: 40px;
    height: 40px;
    text-align: center;
}

.edit-btn:hover,
.delete-btn:hover {
    transform: scale3d(1.2, 1.2, 1.2);
    transition: all 0.3s;
}

.edit-btn:hover i {
    color: #ffc107;
}

.delete-btn:hover i {
    color: #dc3545;
}

.text-truncate {
    max-width: 250px;
    /* Giới hạn chiều rộng */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-link {
    color: #000;
}

.text-link:hover {
    color: #198754;
}
</style>