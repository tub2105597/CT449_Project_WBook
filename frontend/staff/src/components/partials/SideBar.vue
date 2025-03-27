<template>
  <div class="col-sm-auto bg-success sticky-top">
    <div class="d-flex flex-sm-column flex-row flex-nowrap align-items-center sticky-top">
      <ul class="nav nav-pills nav-flush flex-column flex-nowrap mb-3 mx-3 text-center align-items-center">
        <li class="nav-item">
          <router-link to="/book" class="nav-link py-3 px-2"
            title="Sách" data-bs-toggle="tooltip" data-bs-placement="right">
            <i class="fa fa-book"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/user" class="nav-link py-3 px-2"
            title="Độc giả" data-bs-toggle="tooltip" data-bs-placement="right">
            <i class="fa fa-user"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/category" class="nav-link py-3 px-2"
            title="Thể loại" data-bs-toggle="tooltip" data-bs-placement="right">
            <i class="fa fa-list"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/status" class="nav-link py-3 px-2"
            title="Trạng thái mượn" data-bs-toggle="tooltip" data-bs-placement="right">
            <i class="fa fa-check"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/publisher" class="nav-link py-3 px-2"
            title="Nhà xuất bản" data-bs-toggle="tooltip" data-bs-placement="right">
            <i class="fa fa-building"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/author" class="nav-link py-3 px-2"
            title="Tác giả" data-bs-toggle="tooltip" data-bs-placement="right">
            <i class="fa fa-pen"></i>
            </router-link>
        </li>
        <li v-if="store.vaiTro === 'quanTri'">
          <router-link to="/staff" class="nav-link py-3 px-2"
            title="Nhân viên" data-bs-toggle="tooltip" data-bs-placement="right">
            <i class="fa fa-clipboard-user"></i>
          </router-link>
        </li>
      </ul>
    </div>
</div>
</template>

<script setup>
import { onMounted } from "vue";
import { Tooltip } from "bootstrap";
import { useUserStore } from "@/stores/user.store";

const store = useUserStore(); // Gọi Pinia store đúng cách
</script>


<style scoped>
    i {
        color: white;
        opacity: 0.9;
        font-size: 1.8rem;
        transform: scale3d(0.8, 0.8, 1);
        transition: all 0.3s;
    }
    
    i:hover {
        opacity: 1;
        transform: scale3d(1.2, 1.2, 1);
        transition: all 0.3s;
    }
</style>