<template>
  <div>
    <!-- Меню -->
    <MainPrices v-if="!basketState" :categoriesProp="categories" :menuDataProp="menuData" :cartItemsProp="cartItems"
      @incrementBasketQuantityEmit="addToCart" @decrementBasketQuantityEmit="decrementBasketQuantity" />
    <!-- Кошик  -->
    <MainBasket v-else :cartItems="cartItems" @incrementBasketQuantityEmit="incrementBasketQuantity"
      @decrementBasketQuantityEmit="decrementBasketQuantity" @clearBasketEmit="clearBasket" />
  </div>
</template>

<script setup>
//base
import { ref, onMounted, defineProps, watch } from 'vue'

// components
import MainPrices from './Main/MainPrices.vue'
import MainBasket from './Main/MainBasket.vue'

// imports
import { BASE_URL, notyf } from "../constants.js";
import { getPrices } from "../functions.js";

// props
const props = defineProps({
  basketStateProp: {
    type: Boolean,
    required: true
  },
});

// consts
const basketState = ref(props.basketStateProp || false);
const cartItems = ref([])
const menuData = ref({})
const categories = ref([])

// functions
// add to basket
function addToCart(item) {
  const existingItem = cartItems.value.find(i => i.name === item.name);

  if (existingItem) {
    incrementBasketQuantity(item);
  } else {
    cartItems.value.push({
      ...item,
      quantity: 1,
      token: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    });

    console.log({
      ...item,
      quantity: 1,
      token: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    })
  }
}

// increment basket item
function incrementBasketQuantity(item) {
  const target = cartItems.value.find(i => i.name === item.name);
  if (target) target.quantity++;
}

// decrement basket item
function decrementBasketQuantity(item) {
  const target = cartItems.value.find(i => i.name === item.name);

  if (target) {
     target.quantity--;

    if (target.quantity <= 0) {
      removeFromCart(item);
    }
  }
}

// remove item from basket
function removeFromCart(item) {
  cartItems.value = cartItems.value.filter(i => i.name !== item.name);

  notyf.open({
    type: 'delete',
    message: `${item.name} видалено`,
  });
}

// clear basket
function clearBasket() {
  cartItems.value = [];
}

// watch basket
watch(
  () => props.basketStateProp,
  (newVal) => {
    basketState.value = newVal;
  }
);

watch(
  () => props.basketStateProp,
  (newVal) => {
    basketState.value = newVal;
  }
);

// onMounted
onMounted(async function () {
  // отримуємо меню
  const menu = await getPrices(BASE_URL);
  menuData.value = menu;
  categories.value = Object.keys(menuData.value);
})
</script>
