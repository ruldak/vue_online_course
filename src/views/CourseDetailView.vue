<template>
  <div class="course-detail-view">
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="course" class="course-content">
      <h1>{{ course.title }}</h1>
      <p class="meta">
        <span><strong>Instructor:</strong> {{ course.instructor_name }}</span>
        <span><strong>Category:</strong> {{ course.category_name }}</span>
      </p>
      <p class="price">${{ course.price }}</p>
      <hr>
      <p class="description">{{ course.description }}</p>
      <button class="btn" @click="handleAddToCart" :disabled="isAdding">
        {{ isAdding ? 'Adding...' : 'Add to Cart' }}
      </button>
      <div v-if="addError" class="alert alert-danger">{{ addError }}</div>
      <div v-if="addSuccess" class="alert alert-success">Course added to cart!</div>
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
    if (err.response && err.response.data.course) {
      addError.value = err.response.data.course[0];
    } else {
      addError.value = 'Failed to add to cart. Please login first.';
    }
    console.error(err);
  } finally {
    isAdding.value = false;
  }
};
</script>

<style scoped>
.course-content {
  background: var(--card-bg-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.meta {
  display: flex;
  gap: 2rem;
  color: #555;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.description {
  line-height: 1.6;
}

.btn {
  margin-top: 1.5rem;
}
</style>
