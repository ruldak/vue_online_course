<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title text-center">Register</h2>
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" id="username" class="form-control" v-model="form.username" required>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email (Optional)</label>
              <input type="email" id="email" class="form-control" v-model="form.email">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" class="form-control" v-model="form.password" required>
            </div>
            <div class="mb-3">
              <label for="password2" class="form-label">Confirm Password</label>
              <input type="password" id="password2" class="form-control" v-model="form.password2" required>
            </div>
            <div v-if="error" class="alert alert-danger">
              <div v-for="(messages, field) in error" :key="field">
                <strong>{{ field }}:</strong>
                <ul class="mb-0 ps-3">
                  <li v-for="message in messages" :key="message">{{ message }}</li>
                </ul>
              </div>
            </div>
            <button :disabled="loading" type="submit" class="btn btn-primary w-100">{{loading?'Loading...':'Register'}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
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
const loading = ref(false);

const handleRegister = async () => {
  error.value = null;
  loading.value = true;
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
  } finally {
    loading.value = false;
  }
};
</script>
