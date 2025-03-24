<template>
    <div class="container bg-light d-flex justify-content-center"> 
        <div class="page">
            <div class="row mb-3">
                <h3 class="col-6">Danh sách nhà xuất bản</h3>
                <div class="col-6">
                    <router-link :to="{ name : 'publisher-add'}" class="btn btn-primary float-end create-btn">
                        <i class="fas fa-plus"></i> Thêm nhà xuất bản mới
                    </router-link>
                </div>
            </div>
            <ul class="list-group list-group-numbered">
                <PublisherItem v-for="publisher in publishers" :key="publisher.id" :publisher="publisher" />
            </ul>
        </div>
    </div>
</template>

<script setup>
    import { ref, onBeforeMount } from 'vue';
    import { useRoute } from 'vue-router';
    import PublisherItem from '@/components/publisher/PublisherItem.vue';
    import PublisherService from '@/services/publisher.service';

    const router = useRoute();
    const publishers = ref([]);

    async function fetchPublishers() {
        try {
            const response = await PublisherService.getAllPublishers();

            publishers.value = response.data.publishers;
        } catch (error) {
            console.log(error);
        }
    }

    onBeforeMount(async () => {
        await fetchPublishers();
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