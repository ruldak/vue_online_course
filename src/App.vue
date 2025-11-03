<template>
  <div id="app-container">
    <header class="app-header">
      <nav class="main-nav">
        <router-link class="nav-brand" to="/">OnlineCourses</router-link>
        <div class="nav-links">
          <router-link to="/">Courses</router-link>
          <router-link v-if="isLoggedIn" to="/my-courses">My Courses</router-link>
        </div>
        <div class="nav-auth">
          <router-link v-if="isLoggedIn" to="/cart">Cart</router-link>
          <template v-if="!isLoggedIn">
            <router-link to="/login">Login</router-link>
            <router-link to="/register">Register</router-link>
          </template>
          <a href="#" v-if="isLoggedIn" @click.prevent="logout">Logout</a>
        </div>
      </nav>
    </header>
    <main class="main-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>View on GitHub: <a href="[YOUR_GITHUB_REPO_URL]" target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from './services/api';
import Cookies from 'js-cookie';

const isLoggedIn = ref(false);
const route = useRoute();
const router = useRouter();

const checkLoginStatus = () => {
  isLoggedIn.value = !!Cookies.get('accessToken');
};

const logout = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  checkLoginStatus();
  router.push('/login');
};

const refreshToken = async () => {
  try {
    const response = await api.refreshToken(Cookies.get('refreshToken'))
    Cookies.set("accessToken", response.data.access)
    checkLoginStatus();
  } catch (err) {
    console.log("refreshToken error:")
    console.error(err)
    logout()
  }
}

const verifyRefreshToken = async () => {
  try {
    await api.verifyToken(Cookies.get('refreshToken'))
  } catch (err) {
    console.log("verify token error:")
    console.error(err);
    logout()
  }
}

const verifyAccessToken = async () => {
  try {
    await api.verifyToken(Cookies.get('accessToken'))
  } catch (err) {
    console.log("verify token error:")
    console.error(err);
    if (err.response && err.response.data && err.response.data.detail === "Token is expired") {
      await refreshToken()
    } else {
      logout()
    }
  }
}

watch(() => route.path, () => {
  checkLoginStatus();
});

onMounted(async () => {
  checkLoginStatus();
  if (Cookies.get('refreshToken')) {
    await verifyRefreshToken()
  }

  if (isLoggedIn.value) {
    await verifyAccessToken()
  }
});
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #42b983;
  --secondary-color: #2c3e50;
  --background-color: #f0f2f5;
  --card-bg-color: #ffffff;
  --text-color: #333;
  --border-radius: 8px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Header & Nav */
.app-header {
  background-color: var(--card-bg-color);
  box-shadow: var(--box-shadow);
  padding: 0 2rem;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-nav a {
  color: var(--secondary-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: color 0.3s;
}

.main-nav a:hover, .main-nav a.router-link-exact-active {
  color: var(--primary-color);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links, .nav-auth {
  display: flex;
  gap: 1rem;
}

/* Form Styles */
.form-container {
  background: var(--card-bg-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 400px;
  margin: 2rem auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

/* Button Styles */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #36a476;
}

.btn-danger {
    background-color: #e74c3c;
}
.btn-danger:hover {
    background-color: #c0392b;
}

/* Alert Styles */
.alert {
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 4px;
  border: 1px solid transparent;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

/* General Loading Spinner */
.loading-spinner {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
}

/* Footer Styles */
.app-footer {
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 1.5rem 2rem;
  margin-top: auto; /* Pushes the footer to the bottom */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

.app-footer p {
  margin: 0.5rem 0;
}

.app-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
