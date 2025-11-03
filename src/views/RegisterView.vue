<template>
  <form @submit.prevent="handleRegister" class="form-container">
    <h2>Register</h2>
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" v-model="form.username" required>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="form.email">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="form.password" required>
    </div>
    <div class="form-group">
      <label for="password2">Confirm Password</label>
      <input type="password" id="password2" v-model="form.password2" required>
    </div>
    <div v-if="error" class="alert alert-danger">
      <div v-for="(messages, field) in error" :key="field">
        <strong>{{ field }}:</strong>
        <ul style="margin: 0; padding-left: 20px;">
          <li v-for="message in messages" :key="message">{{ message }}</li>
        </ul>
      </div>
    </div>
    <button type="submit" class="btn">Register</button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const form = reactive({
  username: '',
  email: '',
  password: '',
  password2: '',
});
const error = ref(null);
const router = useRouter();

const handleRegister = async () => {
  error.value = null;
  if (form.password !== form.password2) {
    error.value = { password: ["Passwords do not match."] };
    return;
  }
  try {
    await api.register(form);
    router.push('/login');
  } catch (err) {
    error.value = err.response.data.data;
    console.error(err);
    console.log("error register response:")
    console.log(error.value)
  }
};
</script>
