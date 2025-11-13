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
                      <img src="@/images/mcdonalds.avif" class="price-icon"> {{ item.price_original }} ₴
                    </p>

                    <p v-if="item.price_glovo !== null" class="item-price">
                      <img src="@/images/glovo.png" class="price-icon"> {{ item.price_glovo }} ₴
                    </p>

                    <p v-if="item.price_bolt !== null" class="item-price">
                      <img src="@/images/bolt.png" class="price-icon"> {{ item.price_bolt }} ₴
                    </p>

                    <!-- кількість в кошику -->
                    <p v-if="getItemQuantity(item) > 0" class="item-in-cart">
                      Додано в кошик: {{ getItemQuantity(item) }}
                    </p>
                  </div>

                </div>

                <!-- кнопка + - -->
                <div class="menu-button">
                  <!-- кнопка + -->
                  <button class="add-btn" @click.stop="addItem(item)">+</button>
                  <!-- кнопка - -->
                  <button v-if="getItemQuantity(item) > 0" class="remove-btn" @click.stop="removeItem(item)">-</button>
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
const emit = defineEmits(['incrementBasketQuantityEmit', 'decrementBasketQuantityEmit'])

// props
const props = defineProps({
  categoriesProp: {
    type: Object,
    required: true
  },
  menuDataProp: {
    type: Object,
    required: true
  },
  cartItemsProp: {
    type: Object,
    required: true
  }
});

// consts
const categories = ref(props.categoriesProp);
const menuData = ref(props.menuDataProp);
const cartItems = ref(props.cartItemsProp)
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
  emit('incrementBasketQuantityEmit', item);

  notyf.open({
    type: 'add',
    message: `${item.name} додано`,
  });
}

// remoce item from cart
function removeItem(item) {
  emit("decrementBasketQuantityEmit", item)
}

// gey item quantity at cart
function getItemQuantity(item) {
  const cartItem = cartItems.value.find(ci => ci.name === item.name);
  return cartItem ? cartItem.quantity : 0;
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

watch(
  () => props.cartItemsProp,
  (newVal) => {
    cartItems.value = newVal;
    console.log(cartItems.value);
  },
  { immediate: true }
);

</script>

<style scoped>
@import "@/css/main/prices.css";
</style>