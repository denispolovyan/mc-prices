<template>
  <div>
    <!-- Меню -->
    <MainPrices v-if="!basketState" :categoriesProp="categories" :menuDataProp="menuData" :cartItemsProp="cartItems"
      @incrementBasketQuantityEmit="addToCart" @decrementBasketQuantityEmit="decrementBasketQuantity" />
    <!-- Кошик  -->
    <MainBasket v-else :cartItems="cartItems" @incrementBasketQuantityEmit="addToCart"
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
    existingItem.quantity++

    if (item.name.includes("МЕНЮ")) {
      notyf.open({
        type: 'add',
        message: `Додано ${item.name}`,
      });
    }
  } else {

    cartItems.value.push({
      ...item,
      quantity: 1,
      token: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    });

    notyf.open({
      type: 'add',
      message: `Додано ${item.name}`,
    });
  }

  localStorage.setItem('basket-items', JSON.stringify(cartItems.value));
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

  localStorage.setItem('basket-items', JSON.stringify(cartItems.value));
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
  localStorage.setItem('basket-items', JSON.stringify(cartItems.value));
}

// watch basket
watch(
  () => props.basketStateProp,
  (newVal) => {
    basketState.value = newVal;
  }
);

// onMounted get menu
onMounted(async function () {
  const menu = await getPrices(BASE_URL);
  menuData.value = menu;
  categories.value = Object.keys(menuData.value);
})

//onMounted local storage
onMounted(() => {
  const savedBasketItems = localStorage.getItem('basket-items');

  if (savedBasketItems) {
    try {
      const parsedBasketItems = JSON.parse(savedBasketItems);
      if (parsedBasketItems.length) cartItems.value = parsedBasketItems;

    } catch (e) {
      return;
    };
  }
});
</script>
