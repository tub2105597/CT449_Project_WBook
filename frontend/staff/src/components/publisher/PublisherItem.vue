<template>
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-8">
                    <div class="card-item d-flex gap-3 justify-content-start align-items-center">
                        <h5 class="card-title fs-5 fw-bolder">#{{ publisher._id }}</h5>
                    </div>
                    <div class="card-item d-flex gap-1">
                        <p class=" text-muted fs-6 fw-bold">Tên:</p>
                        <p class="card-text ">{{ publisher.tenNXB }}</p>
                    </div>
                    <div class="card-item d-flex gap-1">
                        <p class=" text-muted fs-6 fw-bold">Địa chỉ:</p>
                        <p class="card-text ">{{ publisher.diaChi }}</p>
                    </div>
                </div>
                <div class="col-4">
                    <div class="d-flex gap-2 justify-content-end align-items-end">
                        <router-link :to="{ name: 'publisher-edit', params: { id: publisher._id } }"
                            class="btn fs-6 text-muted edit-btn" data-bs-toggle="tooltip" data-bs-placement="top"
                            title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </router-link>

                        <router-link :to="{ name: 'publisher-delete', params: { id: publisher._id } }"
                            class="btn fs-6 p-2 text-muted delete-btn" data-bs-toggle="tooltip" data-bs-placement="top"
                            title="Xóa">
                            <i class="fas fa-trash-alt"></i>
                        </router-link>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Tooltip } from 'bootstrap';

const props = defineProps(['publisher']);

const publisher = ref(props.publisher);

onMounted(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new Tooltip(el));
});

</script>

<style scoped>
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
</style>