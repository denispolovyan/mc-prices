<template>
  <div class="app-container">
    <!-- Секція меню -->
    <div v-if="isPricesVisible" class="menu-section">

      <div 
        v-for="category in categories" 
        :key="category" 
        class="category-item"
      >
        <div class="category-header" @click="toggleCategory(category)">
          <h2>{{ category }}</h2>
        </div>

        <div v-if="openCategory === category" class="menu-items">
          <div 
            v-for="item in filteredItems(category)" 
            :key="item.id" 
            class="menu-item"
          >
            <div class="menu-text">
              <p class="item-name">{{ item.name }}</p>

              <div class="price-row">
                <p class="item-price">
                  <img src="../images/glovo.png" class="price-icon"> {{ item.price_glovo }} ₴
                </p>

                <p class="item-price">
                  <img src="../images/bolt.png" class="price-icon"> {{ item.price_bolt }} ₴
                </p>

                <p class="item-price">
                  <img src="../images/mcdonalds.avif" class="price-icon"> {{ item.price_original }} ₴
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
//base
import { ref, onMounted } from 'vue'

// imports
import { BASE_URL } from "../constants.js";
import { getPrices } from "../functions.js";

// variables
var isPricesVisible = ref(true)
var openCategory = ref(null)
var menuData = ref({})     
var categories = ref([])  

function toggleCategory(name) {
  openCategory.value = openCategory.value === name ? null : name
}

// ✅ Повертаємо елементи конкретної категорії
function filteredItems(categoryName) {
  return menuData.value[categoryName] || []
}

// onMounted
onMounted(async function () {
  // отримуємо меню
  const menu = await getPrices(BASE_URL);
  menuData.value = menu;
  categories.value = Object.keys(menuData.value);
})
</script>

<style scoped>
@import '../css/main/prices.css';
</style>
