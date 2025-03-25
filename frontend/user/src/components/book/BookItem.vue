<template>
    <li>
        <div class="card">
            <div class="card-body ">
                <div class="col">
                <div class="row mb-2">
                    <div class="col-10">
                        <div class="d-flex justify-content-start">
                            <div class="btn fs-5 fw-bold detail-btn" >
                                <span class="fs-6 text-muted">Tên sách:</span>
                                {{ book.tenSach}}
                            </div>
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
                        <div class="card-item d-flex ">
                            <p class=" text-muted fs-7 fw-bold">Tác giả:&nbsp;</p>
                            <p class="card-text fs-7 text-truncate text-decoration-none text-link">{{ book.maTG.tenTG }}</p>
                        </div>
                        <div class="card-item d-flex ">
                            <p class=" text-muted fs-7 fw-bold">Nhà xuất bản:&nbsp;</p>
                            <p class="card-text fs-7 text-truncate text-decoration-none text-link">{{ book.maNXB.tenNXB }}</p>
                        </div>
                        <div class="card-item d-flex ">
                            <p class=" text-muted fs-7 fw-bold">Số quyển:&nbsp;</p>
                            <p class="card-text fs-7 fw-bold" :class="book.soQuyen > 1 ? 'text-success' : 'text-danger'">{{ book.soQuyen }}</p>
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

.card {
    cursor: pointer;
}

.w-80 {
    width: 70px;
    height: 70px;
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