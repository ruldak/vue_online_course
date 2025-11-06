<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title text-center">Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" id="username" class="form-control" v-model="username" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" class="form-control" v-model="password" required>
            </div>
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <button :disabled="loading" type="submit" class="btn btn-primary w-100">{{loading?'loading...':'Login'}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import Cookies from 'js-cookie';

const username = ref('');
const password = ref('');
const error = ref(null);
const router = useRouter();
const loading = ref(false)

const handleLogin = async () => {
  error.value = null;
  loading.value = true
  try {
    const response = await api.login({
      username: username.value,
      password: password.value,
    });
    Cookies.set('accessToken', response.data.access);
    Cookies.set('refreshToken', response.data.refresh);
    router.push('/my-courses');
  } catch (err) {
    error.value = 'Failed to login. Check username and password.';
    console.error(err);
  } finally {
    loading.value = false
  }
};
</script>
