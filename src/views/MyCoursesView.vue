<template>
  <div class="my-courses-view">
    <h1>My Enrolled Courses</h1>
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="enrollments.length" class="courses-container">
      <ul class="enrolled-list">
        <li v-for="enrollment in enrollments" :key="enrollment.id" class="enrolled-item">
          <router-link :to="{ name: 'CourseLessons', params: { id: enrollment.course } }">{{ enrollment.course_title }}</router-link>
        </li>
      </ul>
    </div>
    <div v-else-if="!loading">
      <p>You are not enrolled in any courses yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const enrollments = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await api.getMyEnrollments();
    enrollments.value = response.data;
  } catch (err) {
    error.value = 'Failed to load your courses.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.courses-container {
    background: var(--card-bg-color);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
}
.enrolled-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.enrolled-item {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    font-size: 1.1rem;
}
.enrolled-item:last-child {
    border-bottom: none;
}
</style>
