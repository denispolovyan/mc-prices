<template>
  <header class="header">
    <div class="header__container">
      <h1 class="header__logo">Мак Prices</h1>
      <img src="@/images/basket.png" alt="Logo" class="header__image" @click="handleBasket"/>
    </div>
  </header>
</template>

<script setup>
//base
import {ref} from 'vue';

// emits
const emit = defineEmits(['handleBasketEmit']);

// consts
let basketState = ref(false);

// functions
// handle basket
function handleBasket(){
  basketState.value = !basketState.value;
  emit("handleBasketEmit", basketState.value)
}
</script>


<style scoped>
@import '@/css/header/header.css';
</style>
