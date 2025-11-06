<template>
  <div class="course-list-view">
    <h1>Available Courses</h1>
    <div class="row mb-3">
      <div class="col-md-4">
        <label for="filter-dropdown" class="form-label">Category: </label>
        <select id="filter-dropdown" v-model="filters.category" class="form-select">
          <option value="">Any</option>
          <option v-for="c in categories" :value="c.id">{{c.name}}</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="order-by" class="form-label">Order By: </label>
        <select id="order-by" v-model="filters.ordering" class="form-select">
          <option value="-created_at">Newest</option>
          <option value="-rating">Highest Rated</option>
          <option value="-price">Price</option>
        </select>
      </div>
      <div class="col-md-4 d-flex align-items-end">
        <button class="btn btn-primary" @click="fetchFilter">Submit</button>
      </div>
    </div>
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="courses.length" class="row">
      <div class="col-md-4 mb-4" v-for="course in courses" :key="course.id">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ course.title }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">By {{ course.instructor_name }} | {{course.category_name}}</h6>
            <p class="card-text">{{ course.description.substring(0, 100) }}...</p>
            <p class="card-text fw-bold">${{ course.price }}</p>
            <p class="card-text">Rating: {{ course.rating }}/5</p>
            <router-link :to="{ name: 'CourseDetail', params: { id: course.id } }" class="btn btn-primary mt-auto">View Details</router-link>
          </div>
        </div>
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
  ordering: "-rating"
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


