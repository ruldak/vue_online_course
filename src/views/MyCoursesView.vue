<template>
  <div class="my-courses-view">
    <h1>My Enrolled Courses</h1>
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="enrollments.length">
      <div class="list-group">
        <router-link v-for="enrollment in enrollments" :key="enrollment.id" :to="{ name: 'CourseLessons', params: { id: enrollment.course } }" class="list-group-item list-group-item-action">
          {{ enrollment.course_title }}
        </router-link>
      </div>
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


