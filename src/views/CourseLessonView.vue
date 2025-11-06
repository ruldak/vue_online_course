<template>
  <div class="course-detail-view">
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="course">
      <div v-for="c in course" :key="c.id" class="card mb-3">
        <div class="card-body">
          <h1 class="card-title">{{c.order}}. {{ c.title }}</h1>
          <hr>
          <p class="card-text">{{ c.content }}</p>
        </div>
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

onMounted(async () => {
  try {
    const response = await api.getCourseLessons(props.id);
    course.value = response.data;
    console.log(response.data)
  } catch (err) {
    error.value = 'Failed to load course details.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>


