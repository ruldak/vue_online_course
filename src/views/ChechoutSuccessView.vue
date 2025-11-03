<template>
  <p v-if="loading">processing payment...</p>
  <p v-else>{{status}}</p>
</template>

<script setup>
import {ref, onMounted} from "vue";
import api from '../services/api';
import { useRoute } from 'vue-router';
import Cookies from 'js-cookie';

const route = useRoute();
let loading = ref(false)
let status = ref("success")

const capturePayPalCheckout = async () => {
  loading.value = true
  try {
    const order_id = Cookies.get("order_id")
    const response = await api.capturePaypalOrder(order_id);
    status.value = "success"
  } catch (err) {
    alert('Failed to capture PayPal order.');
    console.error(err);
    status.value = "fail"
  } finally {
    Cookies.remove("order_id")
    loading.value = false
  }
};

onMounted(() => {
  if (Cookies.get("order_id")) {
    capturePayPalCheckout();
  }
});

</script>
