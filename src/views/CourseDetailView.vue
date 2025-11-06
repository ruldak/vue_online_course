<template>
  <div class="course-detail-view">
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="course" class="card">
      <div class="card-body">
        <h1 class="card-title">{{ course.title }}</h1>
        <h6 class="card-subtitle mb-2 text-muted">
          <span><strong>Instructor:</strong> {{ course.instructor_name }}</span>
          <span class="ms-3"><strong>Category:</strong> {{ course.category_name }}</span>
        </h6>
        <p class="card-text fs-4 fw-bold">${{ course.price }}</p>
        <hr>
        <p class="card-text">{{ course.description }}</p>
        <button class="btn btn-primary" @click="handleAddToCart" :disabled="isAdding">
          {{ isAdding ? 'Adding...' : 'Add to Cart' }}
        </button>
        <div v-if="addError" class="alert alert-danger mt-3">{{ addError }}</div>
        <div v-if="addSuccess" class="alert alert-success mt-3">Course added to cart!</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const props = defineProps(['id']);
const course = ref(null);
const loading = ref(true);
const error = ref(null);
const isAdding = ref(false);
const addError = ref(null);
const addSuccess = ref(false);

onMounted(async () => {
  try {
    const response = await api.getCourseDetails(props.id);
    course.value = response.data;
  } catch (err) {
    error.value = 'Failed to load course details.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const handleAddToCart = async () => {
  isAdding.value = true;
  addError.value = null;
  addSuccess.value = false;
  try {
    await api.addToCart(props.id);
    addSuccess.value = true;
  } catch (err) {
    console.log("add to cart error:")
    console.log(err.response.data)
    if (err.response && err.response.data.error) {
      addError.value = err.response.data.error.message;
    } else {
      addError.value = 'Failed to add to cart. Please login first.';
    }
    console.error(err);
  } finally {
    isAdding.value = false;
  }
};
</script>


