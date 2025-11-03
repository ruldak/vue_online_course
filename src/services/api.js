import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default {
    register: (userData) => apiClient.post('/register/', userData),
    login: (credentials) => apiClient.post('/token/', credentials),
    refreshToken: (refreshToken) => apiClient.post('/token/refresh/', {refresh: refreshToken}),
    verifyToken: (token) => apiClient.post('/token/verify/', {token: token}),
    getCategories: () => apiClient.get('/categories/'),
    getCourses: (params) => apiClient.get('/courses/', {params}),
    getCourseDetails: (id) => apiClient.get(`/courses/${id}/`),
    getCourseLessons: (courseId) => apiClient.get(`/courses/${courseId}/lessons/`),
    getCart: () => apiClient.get('/cart/'),
    addToCart: (courseId) => apiClient.post('/cart-items/', { course: courseId }),
    removeFromCart: (itemId) => apiClient.delete(`/cart-items/${itemId}/`),
    getMyEnrollments: () => apiClient.get('/my-enrollments/'),
    createPaypalOrder: () => apiClient.post('/paypal/create-order/'),
    capturePaypalOrder: (orderID) => apiClient.post('/paypal/capture-order/', { order_id: orderID }),
    createStripeOrder: () => apiClient.post('/stripe/create-order/'),
};
