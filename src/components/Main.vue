<template>
  <div>
    <!-- Меню -->
    <MainPrices v-if="!basketState" :categoriesProp="categories" :menuDataProp="menuData" @add-to-cart="addToCart" />
    <!-- Кошик  -->
    <MainBasket v-else :cartItems="cartItems" @remove-item="removeFromCart" />
  </div>
</template>

<script setup>
//base
import { ref, onMounted, defineProps, watch } from 'vue'

// components
import MainPrices from './Main/MainPrices.vue'
import MainBasket from './Main/MainBasket.vue'

// imports
import { BASE_URL } from "../constants.js";
import { getPrices } from "../functions.js";

// notyf
import { notyf } from "@/constants.js";

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
  const updatedItem = {
    ...item,
    token: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  };

  cartItems.value.push(updatedItem)
}

// remove from basket
function removeFromCart(item) {
  let uniToken = item.token;
  cartItems.value = cartItems.value.filter(i => i.token !== uniToken);

  notyf.open({
    type: 'delete',
    message: `${item.name} видалено`,
  });
}

// watch basket
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
