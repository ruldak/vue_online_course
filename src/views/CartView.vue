<template>
  <div class="cart-view">
    <h1>My Cart</h1>
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="cart" class="cart-container">
      <div v-if="cart.items.length === 0">
        <p>Your cart is empty.</p>
      </div>
      <template v-else>
        <ul class="cart-items-list">
          <li v-for="item in cart.items" :key="item.id" :class="['cart-item', item.status]">
            <span class="item-name">{{ item.course_name }}</span>
            <span class="item-price">${{ item.course_price }}</span>
            <span v-if="item.status == 'sold'" class="item-price">SOLD</span>
            <button class="removeBtn btn btn-danger" @click="removeItem(item.id)">Remove</button>
          </li>
        </ul>
        <div class="cart-summary">
          <div class="total-price">
            <span>Total (USD)</span>
            <strong>${{ cart.total_price }}</strong>
          </div>
          <div>
            <p>For PayPal checkout testing (sandbox mode — no real money involved), you can use the following credentials:</p>
            <p><strong>Email:</strong> sb-hb9du47069562@personal.example.com</p>
            <p><strong>password:</strong> 8cF//@08</p>
          </div>
          <button :disabled="cart.items.length === 1 && cart.items[0].status === 'sold'" class="btn" @click="handlePayPalCheckout">Checkout with PayPal</button>
          <br>
          <br>
          <div>
            <p>For Stripe checkout testing (sandbox mode — no real money used), you can use the following test card:</p>
            <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
            <p><strong>Expiration Date:</strong> Any future date (e.g., 12/34)</p>
            <p><strong>CVC:</strong>  Any 3 digits (e.g., 123)</p>
          </div>
          <button :disabled="cart.items.length === 1 && cart.items[0].status === 'sold'" class="btn" @click="handleStripeCheckout">Checkout with card</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Cookies from 'js-cookie';

const cart = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchCart = async () => {
  loading.value = true;
  try {
    const response = await api.getCart();
    cart.value = (response.data[0].items.length > 0) ? response.data[0] : { items: [], total_price: '0.00' };
    console.log("fetch cart response:")
    console.log(response.data)
    console.log("askasokjak")
    console.log(response.data[0].items.length)
  } catch (err) {
    error.value = 'Failed to load cart.';
    console.error(err);
  } finally {
    loading.value = false;
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
  }
};

const handleStripeCheckout = async () => {
  alert("Redirecting to Checkout page...");
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
  }
};

onMounted(fetchCart);
</script>

<style scoped>
.cart-container {
    background: var(--card-bg-color);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
}
.cart-items-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.sold {
  color: #aaa;
  cursor: default;
  background-color: #f5f5f5;
}
.sold > *:not(button) {
  opacity: 0.6;
  text-decoration: line-through;
  pointer-events: none;
}
.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}
.cart-item:last-child {
    border-bottom: none;
}
.item-name {
    font-weight: 500;
}
.cart-summary {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #eee;
    text-align: right;
}
.total-price {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
}
.total-price span {
    color: #555;
}
.total-price strong {
    margin-left: 1rem;
    color: var(--secondary-color);
}
button:disabled {
  opacity: 0.5;
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  border: 1px solid #aaa;
}
</style>
