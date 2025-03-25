<template>
    <div class="container d-flex justify-content-center p-0">
        <div class="page">
            <ul class="list-group list-group-numbered">
                <div v-for="book in books" :key="book._id" class="m-1" @click="selectBookDetail(book)">
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
import { defineProps, watch } from 'vue';

const router = useRoute();
const books = ref([]);
const props = defineProps(['selectBookDetail', 'searchQuery']);

watch(() => props.searchQuery, async (newQuery) => {
    if (newQuery) {
        console.log("Gọi API với query:", newQuery);
        await fetchBooks(newQuery);
    }
});

async function fetchBooks() {
    try {
        const response = await BookService.getBooks({tenSach: props.searchQuery});
        if (response.status === 'success') {
            books.value = JSON.parse(JSON.stringify(response.data.books));
        } else {
            books.value = [];
        }
    } catch (error) {
        console.log('Lỗi khi lấy danh sách thể loại:', error);
    }
}

onBeforeMount(async () => {
    await fetchBooks();
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