import { createRouter, createWebHistory } from 'vue-router';
import CourseListView from '../views/CourseListView.vue';
import CourseDetailView from '../views/CourseDetailView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import CartView from '../views/CartView.vue';
import MyCoursesView from '../views/MyCoursesView.vue';
import CourseLessonsView from '../views/CourseLessonView.vue';
import ChechoutSuccessView from '../views/ChechoutSuccessView.vue';
import ChechoutFailView from '../views/ChechoutFailView.vue';
import Cookies from 'js-cookie';

const routes = [
    {
        path: '/',
        redirect: '/courses'
    },
    { path: '/courses', name: 'CourseList', component: CourseListView },
    { path: '/course/:id', name: 'CourseDetail', component: CourseDetailView, props: true },
    { path: '/course/:id/lessons', name: 'CourseLessons', component: CourseLessonsView, meta: { requiresAuth: true }, props: true },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/checkout/success', name: 'CheckoutSuccess', component: ChechoutSuccessView },
    { path: '/checkout/fail', name: 'CheckoutFail', component: ChechoutFailView },
    { path: '/register', name: 'Register', component: RegisterView },
    { path: '/cart', name: 'Cart', component: CartView, meta: { requiresAuth: true } },
    { path: '/my-courses', name: 'MyCourses', component: MyCoursesView, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
                            routes,
});

router.beforeEach((to, from, next) => {
    const loggedIn = Cookies.get('accessToken');
    if (to.meta.requiresAuth && !loggedIn) {
        next('/login');
    } else {
        next();
    }
});

export default router;
