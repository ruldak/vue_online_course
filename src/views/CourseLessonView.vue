<template>
  <div class="course-detail-view">
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="course" class="course-content">
      <div v-for="c in course">
        <h1>{{c.order}}. {{ c.title }}</h1>
        <hr>
        <p class="description">{{ c.content }}</p>
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

<style scoped>
.course-content {
  background: var(--card-bg-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.description {
  line-height: 1.6;
}
</style>
