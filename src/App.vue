<template>
  <div id="app-container">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <router-link class="navbar-brand" to="/">OnlineCourses</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Courses</router-link>
              </li>
              <li class="nav-item" v-if="isLoggedIn">
                <router-link class="nav-link" to="/my-courses">My Courses</router-link>
              </li>
            </ul>
            <ul class="navbar-nav">
              <li class="nav-item" v-if="isLoggedIn">
                <router-link class="nav-link" to="/cart">Cart</router-link>
              </li>
              <template v-if="!isLoggedIn">
                <li class="nav-item">
                  <router-link class="nav-link" to="/login">Login</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/register">Register</router-link>
                </li>
              </template>
              <li class="nav-item" v-if="isLoggedIn">
                <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <main class="main-content container-fluid">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>View on GitHub: <a href="https://github.com/ruldak/vue_online_course" target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>
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
