<template>
  <form @submit.prevent="handleLogin" class="form-container">
    <h2>Login</h2>
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" v-model="username" required>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" required>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <button type="submit" class="btn">Login</button>
  </form>
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

const handleLogin = async () => {
  error.value = null;
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
  }
};
</script>
