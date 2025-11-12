<template>
  <div class="menu-section">
    <transition-group name="fade" tag="div">
      <div v-for="category in categories" :key="category" class="category-item">
        <div class="category-header" @click="toggleCategory(category)">
          <h2>{{ category }}</h2>
          <span class="arrow" :class="{ open: openCategory === category }">▼</span>
        </div>

        <transition name="expand">
          <div v-if="openCategory === category" class="menu-items">
            <transition-group name="fade-up" tag="div">
              <div v-for="item in filteredItems(category)" :key="item.id" class="menu-item">
                <div class="menu-text">
                  <p class="item-name">{{ item.name }}</p>

                  <div class="price-row">
                    <p class="item-price">
                      <img src="@/images/glovo.png" class="price-icon"> {{ item.price_glovo }} ₴
                    </p>

                    <p class="item-price">
                      <img src="@/images/bolt.png" class="price-icon"> {{ item.price_bolt }} ₴
                    </p>

                    <p class="item-price">
                      <img src="@/images/mcdonalds.avif" class="price-icon"> {{ item.price_original }} ₴
                    </p>
                  </div>
                </div>

                <!-- кнопка + -->
                <div class="menu-button">
                  <button class="add-btn" @click.stop="addItem(item)">+</button>
                </div>
              </div>
            </transition-group>
          </div>
        </transition>
      </div>
    </transition-group>
  </div>
</template>



<script setup>
//base
import { ref, watch } from 'vue'

// notyf
import { notyf } from "@/constants.js";

// emits
const emit = defineEmits(['add-to-cart'])

// props
const props = defineProps({
  categoriesProp: {
    type: Object,
    required: true
  },
  menuDataProp: {
    type: Object,
    required: true
  }
});

// consts
const categories = ref(props.categoriesProp);
const menuData = ref(props.menuDataProp);
const openCategory = ref(null)

// functions
// toggle category
function toggleCategory(name) {
  openCategory.value = openCategory.value === name ? null : name
}

// get category items
function filteredItems(categoryName) {
  return menuData.value[categoryName] || []
}

// add to cart emit
// add item to cart
function addItem(item) { 
  emit('add-to-cart', item);

  notyf.open({
      type: 'add',
      message: `${item.name} додано`,
  });
}

// watch
watch(
  () => props.categoriesProp,
  (newVal) => {
    categories.value = newVal;
  },
  { immediate: true }
);

watch(
  () => props.menuDataProp,
  (newVal) => {
    menuData.value = newVal;
  },
  { immediate: true }
);

</script>

<style scoped>
@import "@/css/main/prices.css";
</style>