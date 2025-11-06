<template>
  <div class="cart-view">
    <h1>My Cart</h1>
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="cart" class="row">
      <div class="col-md-8">
        <div v-if="cart.items.length === 0">
          <p>Your cart is empty.</p>
        </div>
        <ul v-else class="list-group">
          <li v-for="item in cart.items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center" :class="{ 'text-muted': item.status === 'sold' }">
            <div>
              <h5 class="mb-1">{{ item.course_name }}</h5>
              <small>${{ item.course_price }}</small>
            </div>
            <div>
              <span v-if="item.status == 'sold'" class="badge bg-secondary">SOLD</span>
              <button v-if="item.status === 'in_cart'" class="btn btn-danger btn-sm" @click="removeItem(item.id)">Remove</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Cart Summary</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>${{ cart.total_price }}</strong>
              </li>
            </ul>
            <div class="mt-3">
              <p class="small">For PayPal checkout testing (sandbox mode — no real money involved), you can use the following credentials:</p>
              <p class="small"><strong>Email:</strong> sb-hb9du47069562@personal.example.com</p>
              <p class="small"><strong>password:</strong> 8cF//@08</p>
            </div>
            <button :disabled="isAllSold || coLoading" class="btn btn-primary w-100 mt-3" @click="handlePayPalCheckout">{{coLoading? 'Loading...':'Checkout with PayPal'}}</button>
            <hr>
            <div class="mt-3">
              <p class="small">For Stripe checkout testing (sandbox mode — no real money used), you can use the following test card:</p>
              <p class="small"><strong>Card Number:</strong> 4242 4242 4242 4242</p>
              <p class="small"><strong>Expiration Date:</strong> Any future date (e.g., 12/34)</p>
              <p class="small"><strong>CVC:</strong>  Any 3 digits (e.g., 123)</p>
            </div>
            <button :disabled="isAllSold || coLoading" class="btn btn-primary w-100 mt-3" @click="handleStripeCheckout">{{coLoading? 'Loading...':'Checkout with card'}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../services/api';
import Cookies from 'js-cookie';

const cart = ref(null);
const loading = ref(true);
const error = ref(null);
const isAllSold = ref(true);
const coLoading = ref(false);

const checkCartItemStatus = () => {
  if (cart.value && Array.isArray(cart.value.items)) {
    const hasInCart = cart.value.items.some(item => item.status === "in_cart")
    isAllSold.value = !hasInCart
  } else {
    isAllSold.value = true
  }
}

const fetchCart = async () => {
  loading.value = true;
  try {
    const response = await api.getCart();
    cart.value = (response.data[0].items.length > 0) ? response.data[0] : { items: [], total_price: '0.00' };
  } catch (err) {
    error.value = 'Failed to load cart.';
    console.error(err);
  } finally {
    loading.value = false;
    checkCartItemStatus();
  }
};

const removeItem = async (itemId) => {
  if (!confirm('Are you sure you want to remove this item?')) return;
  try {
    await api.removeFromCart(itemId);
    fetchCart();
  } catch (err) {
    alert('Failed to remove item.');
    console.error(err);
  }
};

const handlePayPalCheckout = async () => {
  alert("Redirecting to PayPal...");
  coLoading.value = true
  try {
    const response = await api.createPaypalOrder();
    console.log("handle paypal co response: ")
    Cookies.set("order_id", response.data.data.id)
    if (response.data.data.approval_url) {
      window.location.href = response.data.data.approval_url;
    } else {
      alert('Could not get PayPal approval URL.');
    }
  } catch (err) {
    alert('Failed to create PayPal order.');
    console.error(err);
  } finally {
    coLoading.value = false
  }
};

const handleStripeCheckout = async () => {
  alert("Redirecting to Checkout page...");
  coLoading.value = true
  try {
    const response = await api.createStripeOrder();
    console.log("handle stripe co response: ")
    if (response.data.data.url) {
      window.location.href = response.data.data.url;
    } else {
      alert('Could not get Stripe checkout URL.');
    }
  } catch (err) {
    alert('Failed to create Stripe order.');
    console.error(err);
  } finally {
    coLoading.value = false
  }
};

watch(cart, () => {
  checkCartItemStatus()
}, { deep: true })

onMounted(fetchCart);
</script>


