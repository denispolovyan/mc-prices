<template>
  <div>
    <!-- Меню -->
    <MainPrices  v-if="!basketState" :categoriesProp="categories" :menuDataProp="menuData"/>
    <!-- Кошик  -->
     <MainBasket v-else/>
  </div>
</template>

<script setup>
//base
import { ref, onMounted, defineProps, watch } from 'vue'

// components
import MainPrices from './Main/MainPrices.vue'
// import MainBasket from './Main/MainBasket.vue'

// imports
import { BASE_URL } from "../constants.js";
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
var menuData = ref({})     
var categories = ref([])  

// watch basket
watch(
  () => props.basketStateProp,
  (newVal) => {
    basketState.value = newVal;
    console.log(newVal)
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

