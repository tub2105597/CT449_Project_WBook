<template>
  <div class="container bg-light p-5">
    <Form class="form" @submit="onSubmit" :validation-schema="loginFormSchema">
      <legend class="form-title fw-bold">Đăng nhập</legend>
      <div class="mb-3 form-group">
        <label for="soDienThoai" class="form-label">Số điện thoại</label>
        <Field
          type="text"
          name="soDienThoai"
          id="soDienThoai"
          class="form-control"
          v-model="soDienThoai"
        />
        <ErrorMessage name="soDienThoai" class="error-feedback"></ErrorMessage>
      </div>
      <div class="mb-3 form-group">
        <label for="matKhau" class="form-label">Mật khẩu</label>
        <Field
          :type="passwordInputStatus"
          name="matKhau"
          id="matKhau"
          class="form-control pe-5"
          v-model="matKhau"
        />
        <button type="button" class="show-password" @click="showPassword">
          <i class="fa-regular fa-eye"></i>
        </button>
        <ErrorMessage name="matKhau" class="error-feedback"></ErrorMessage>
      </div>
      <div class="mb-3 form-group d-flex flex-column justify-content-center ">
        <button
          class="btn btn-success btn-md"
          type="submit"
          :disabled="loading"
        >
          Đăng nhập
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="loading"
          ></span>
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useUserStore } from '@/stores/user.store';
import { useRouter } from 'vue-router';

const soDienThoai = ref('');
const matKhau = ref('');
const store = useUserStore();
const passwordInputStatus = ref('matKhau');
const loading = ref(false);
const router = useRouter();

const loginFormSchema = yup.object({
  soDienThoai: yup.string().required('Mã nhân viên không được bỏ trống!'),
  matKhau: yup.string().required('Mật khẩu không được bỏ trống!'),
});

async function onSubmit() {
  loading.value = true;
  await store.login({
    soDienThoai: soDienThoai.value,
    matKhau: matKhau.value,
  });

  if (store.isAuth) router.push({ name: 'home-page' });
  loading.value = false;
}

function showPassword() {
  if (passwordInputStatus.value === 'password')
    passwordInputStatus.value = 'text';
  else passwordInputStatus.value = 'password';
}

onBeforeMount(() => {
  if (store.isAuth) router.push({ name: 'home-page' });
});
</script>

<style scoped>
.container {
    max-width: 500px;
    margin-top: 70px;
}

.form {
    max-width: 500px;
    margin: auto;
}

.form-title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 20px;
}

.error-feedback {
    color: red;
}

.form-group {
    position: relative;
}

.show-password {
    border: none;
    color:#ccc;
    background-color: inherit;
    transition: all .3s;
    position: absolute;
    top: 42px;
    right: 5px;
}

.show-password:hover {
    color: #000;
}

input[type="checkbox"] {
    width:16px;
    height:16px;
    accent-color: #7b7373;
}

.text-link {
    color: grey;
}

.text-link:hover {
    color: #198754;
}
</style>