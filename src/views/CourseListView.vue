<template>
  <div class="course-list-view">
    <h1>Available Courses</h1>
    <label for="filter-dropdown">Category: </label>
    <select id="filter-dropdown" v-model="filters.category" name="myOption">
      <option value="">Any</option>
      <option v-for="c in categories" :value="c.id">{{c.name}}</option>
    </select>
    <label for="order-by">Order By: </label>
    <select id="order-by" v-model="filters.ordering" name="myOption">
      <option value="-created_at">Newest</option>
      <option value="rating">Highest Rated</option>
      <option value="-price">Price</option>
    </select>
    <button class="btn" @click="fetchFilter">submit</button>
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="courses.length" class="course-grid">
      <div class="course-card" v-for="course in courses" :key="course.id">
        <h3>{{ course.title }}</h3>
        <p class="instructor">By {{ course.instructor_name }} | {{course.category_name}}</p>
        <p class="description">{{ course.description.substring(0, 100) }}...</p>
        <p class="price">${{ course.price }}</p>
        <p class="instructor">Rating: {{ course.rating }}/5</p>
        <router-link :to="{ name: 'CourseDetail', params: { id: course.id } }" class="btn">View Details</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import api from '../services/api';

let filters = reactive({
  category: "",
  price: "",
  ordering: "rating"
})

const categories = ref([])
const courses = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchFilter = async () => {
  try {
    const response = await api.getCourses(filters);
    courses.value = response.data
  } catch (err) {
    error.value = 'Failed to load courses.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const getCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data
  } catch (err) {
    error.value = 'Failed to load categories.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await getCategories()
  await fetchFilter()
});
</script>

<style scoped>
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: var(--card-bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.course-card h3 {
  margin-top: 0;
  color: var(--secondary-color);
}

.course-card .instructor {
  font-style: italic;
  color: #666;
  margin-bottom: 1rem;
}

.course-card .description {
  flex-grow: 1;
}

.course-card .price {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.course-card .btn {
  margin-top: 1rem;
}

select {
  border: 2px solid #dddddd;
  background: #eeeeee;
  padding: 10px;
  transition: 0.4s;
  margin-bottom: 20px;
  margin-right: 20px;
}

select:hover,
select:focus {
  background: #dddddd;
}
</style>
