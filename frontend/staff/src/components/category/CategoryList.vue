<template>
    <div class="container bg-light d-flex justify-content-center"> 
        <div class="page">
            <div class="row mb-3">
                <h3 class="col-6">Danh sách thể loại</h3>
                <div class="col-6">
                    <router-link :to="{ name : 'category-add'}" class="btn btn-primary float-end create-btn">
                        <i class="fas fa-plus"></i> Thêm thể loại mới
                    </router-link>
                </div>
            </div>

            <!-- Bảng hiển thị danh sách thể loại -->
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Mã thể loại</th>
                            <th scope="col">Tên thể loại</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in paginatedCategories" :key="category._id">
                            <td>{{ category._id }}</td>
                            <td>{{ category.tenTL }}</td>
                            <td>
                                <router-link :to="{ name: 'category-edit', params: { id: category._id } }" class="btn btn-sm btn-outline-warning">
                                    <i class="fas fa-edit"></i>
                                </router-link>
                                <button @click="deleteCategory(category._id)" class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Phân trang -->
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="prevPage">Trước</button>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="nextPage">Sau</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import CategoryService from '@/services/category.service';

const route = useRoute();
const categories = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

// Lấy danh sách thể loại
async function fetchCategories() {
    try {
        const response = await CategoryService.getAllCategories(route.query);
        if (response.status === 'success') {
            categories.value = response.data.categories;
        } else {
            categories.value = [];
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
    }
}

// Xóa thể loại
async function deleteCategory(id) {
    if (!confirm('Bạn có chắc muốn xóa thể loại này?')) return;

    try {
        await CategoryService.deleteCategory(id);
        categories.value = categories.value.filter(category => category._id !== id);
    } catch (error) {
        console.error('Lỗi khi xóa thể loại:', error);
    }
}

// Xử lý phân trang
const totalPages = computed(() => Math.ceil(categories.value.length / itemsPerPage));

const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return categories.value.slice(start, start + itemsPerPage);
});

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function goToPage(page) {
    currentPage.value = page;
}

onBeforeMount(fetchCategories);
</script>

<style scoped>
.page {
    width: 100%;
    max-width: 1000px;
}

.create-btn {
    transform: scale3d(0.9, 0.9, 0.9);
    transition: transform 0.3s;
}

.create-btn:hover {
    transform: scale3d(1.1, 1.1, 1.1);
}

/* Pagination */
.page-link {
    color: #198754 !important;
    border: 1px solid #198754 !important;
}

.page-item.active .page-link {
    background-color: #198754 !important;
    border-color: #198754 !important;
    color: white !important;
}

.page-link:hover {
    background-color: #157347 !important;
    color: white !important;
}
</style>
