<template>
    <div class="app-container">
        <Header />
        <Main />
    </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Main from './components/Main.vue'
</script>

<style>
@import './css/nullstyle.css';

.app-container {
    height: 100%;
    background: #343333;
}
</style>
