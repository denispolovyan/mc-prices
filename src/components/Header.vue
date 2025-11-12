<template>
  <header class="header">
    <div class="header__container">
      <h1 class="header__logo">Мак Prices</h1>

      <!-- Кошик з анімацією -->
      <div 
        class="header__basket-wrapper"
        :class="{ flipped: !basketState }"
        @click="handleBasket"
      >
        <img 
          src="@/images/basket.png" 
          alt="Basket"
          class="header__image"
        />
      </div>
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
