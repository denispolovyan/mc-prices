<template>
    <div class="app-container">
        <Header @handleBasketEmit="handleBasket"/>
        <Main :basketStateProp="basketState"/>
    </div>
</template>

<script setup>
// base
import { watch, ref } from 'vue';

// components
import Header from './components/Header.vue'
import Main from './components/Main.vue'

// consts
const basketState = ref(false);

// functions
// handle basket
function handleBasket(state){
    basketState.value = state;
}
</script>

<style>
@import './css/nullstyle.css';

.app-container {
    height: 100%;
    background: #343333;
}
</style>
