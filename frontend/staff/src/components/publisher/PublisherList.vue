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
            <div class="col mb-3">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Tìm kiếm theo tên nhà xuất bản" v-model="search" @keyup.enter="searchPublishers()">
                    <button class="btn btn-outline-success" type="button" id="button-addon2"  @click="searchPublishers()">
                        <i class="fas fa-search"></i>
                    </button>
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
    const search = ref('');

    async function fetchPublishers() {
        try {
            const response = await PublisherService.getAllPublishers();

            publishers.value = response.data.publishers;
        } catch (error) {
            console.log(error);
        }
    }
    

    async function searchPublishers() {
        if(!search.value) {
            await fetchPublishers();
            return;
        }
        publishers.value = publishers.value.filter(publisher => publisher.tenNXB.toLowerCase().includes(search.value.toLowerCase()));
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