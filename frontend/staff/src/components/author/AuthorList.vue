<template>
    <div class="container bg-light d-flex justify-content-center">
        <div class="page">
            <div class="row mb-3">
                <h3 class="col-6">Danh sách tác giả</h3>
                <div class="col-6">
                    <router-link :to="{ name: 'author-add' }" class="btn btn-primary float-end create-btn">
                        <i class="fas fa-plus"></i> Thêm tác giả mới
                    </router-link>
                </div>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Nhập tên tác giả cần tìm kiếm" v-model="search" @input="searchAuthor()">
                <button class="btn btn-outline-success" type="button" @click="searchAuthor()">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <!-- Hiển thị danh sách tác giả dưới dạng bảng -->
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Mã tác giả</th>
                            <th scope="col">Tên tác giả</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="author in paginatedAuthors" :key="author._id">
                            <td>{{ author._id }}</td>
                            <td>{{ author.tenTG }}</td>
                            <td class="d-flex gap-1 align-items-center justify-content-center">
                                <router-link :to="{ name: 'status-edit', params: { id: author._id } }" class="btn btn-sm btn-outline-warning">
                                    <i class="fas fa-edit"></i>
                                </router-link>
                                <button class="btn btn-sm btn-outline-danger" @click="deleteAuthor(author._id)">
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
                        <button class="page-link" @click="currentPage--">Trước</button>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
                        <button class="page-link" @click="currentPage = page">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="currentPage++">Tiếp</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import AuthorService from '@/services/author.service';
import Swal from 'sweetalert2';

const route = useRoute();
const authors = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const search = ref('');

// Lấy danh sách tác giả
async function fetchAuthors() {
    try {
        const response = await AuthorService.getAllAuthors(route.query);
        if (response.status === 'success') {
            authors.value = response.data.authors;
        } else {
            authors.value = [];
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tác giả:', error);
    }
}

// Hàm xóa tác giả
async function deleteAuthor(id) {
    const result =await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa tác giả này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
    });

    if (!result.isConfirmed) return;

    try {
        await AuthorService.deleteAuthor(id);
        fetchAuthors();
    } catch (error) {
        console.error('Lỗi khi xóa tác giả:', error);
    }
}

// Tính danh sách tác giả hiển thị trên mỗi trang
const paginatedAuthors = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return authors.value.slice(start, end);
});

// Tính tổng số trang
const totalPages = computed(() => {
    return Math.ceil(authors.value.length / itemsPerPage);
});

function searchAuthor() {
    const query = search.value.trim().toLowerCase();
    if (query) {
        authors.value = authors.value.filter(author => author.tenTG.toLowerCase().includes(query));
    } else {
        fetchAuthors();
    }
}

onBeforeMount(fetchAuthors);
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

/* Style pagination */
.pagination {
    margin-top: 20px;
}

.page-link {
    cursor: pointer;
    color: #198754;
}

.page-item.active .page-link {
    background-color: #198754;
    border-color: #198754;
    color: white;
}

.page-item.disabled .page-link {
    cursor: not-allowed;
}
</style>
