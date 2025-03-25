<template>
    <div class="container bg-light d-flex justify-content-center">
        <div class="page">
            <div class="row mb-3">
                <h3 class="col-6">Danh sách sách</h3>
                <div class="col-6">
                    <router-link :to="{ name: 'book-add' }" class="btn btn-primary float-end create-btn">
                        <i class="fas fa-plus"></i> Thêm sách mới
                    </router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Tìm kiếm theo tên sách" v-model="search" @keyup.enter="searchBook()">
                        <button class="btn btn-outline-success" type="button" id="button-addon2" @click="searchBook()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <ul class="list-group list-group-numbered">
                <div v-for="book in books" :key="book._id" class="m-1">
                    <BookItem :book="book" />
                </div>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import BookItem from '@/components/book/BookItem.vue';
import BookService from '@/services/book.service';

const router = useRoute();
const books = ref([]);
const search = ref('');

async function fetchBooks() {
    try {
        const response = await BookService.getAllBooks(router.query);
        if (response.status === 'success') {
            books.value = JSON.parse(JSON.stringify(response.data.books));
        } else {
            books.value = [];
        }
    } catch (error) {
        console.log('Lỗi khi lấy danh sách thể loại:', error);
    }
}

async function searchBook() {
    if(!search.value) {
        await fetchBooks();
        return;
    }

    books.value = books.value.filter(book => book.tenSach.toLowerCase().includes(search.value.toLowerCase()));
}

onBeforeMount(async () => {
    await fetchBooks();

    console.log('Danh sách sách:', books.value);
});

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
</style>