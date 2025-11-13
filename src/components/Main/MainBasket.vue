<template>
  <div class="basket-section" v-if="cartItems?.length">
    <!-- ПІДСУМОК ЕКОНОМІЇ -->
    <div class="basket-summary">
      <p>
        <p> Ціна в закладі  <span class="saving mc">{{ totalBasketPrice }} ₴ </span></p>На 
        <span class="saving glovo">{{ totalGlovoSaving }} ₴</span> дорожче у Glovo та на
        <span class="saving bolt">{{ totalBoltSaving }} ₴</span> дорожче у Bolt
      </p>
    </div>

    <!-- СПИСОК ПОЗИЦІЙ -->
    <div class="basket-list">
      <transition-group name="fade-up" tag="div">
        <div v-for="item in cartItems" :key="item.id" class="basket-item">
          <!-- ІНФО ПРО ТОВАР -->
          <div class="basket-info">
            <p class="basket-name">{{ item.name }}</p>

            <div class="basket-prices">
              <p v-if="item.price_original !== null && item.price_original > 0">
                <img src="@/images/mcdonalds.avif" class="price-icon">
                {{ item.price_original }} ₴
              </p>

              <p v-if="item.price_glovo !== null && item.price_glovo > 0">
                <img src="@/images/glovo.png" class="price-icon">
                {{ item.price_glovo }} ₴
                <span class="diff" :class="{ positive: item.price_glovo - item.price_original > 0 }">
                  ({{ (item.price_glovo - item.price_original) * item.quantity }} ₴)
                </span>
              </p>

              <p v-if="item.price_bolt !== null && item.price_bolt > 0">
                <img src="@/images/bolt.png" class="price-icon">
                {{ item.price_bolt }} ₴
                <span class="diff" :class="{ positive: item.price_bolt - item.price_original > 0 }">
                  ({{ (item.price_bolt - item.price_original) * item.quantity }} ₴)
                </span>
              </p>
            </div>

          </div>

          <!-- КНОПКИ КІЛЬКОСТІ ТА ВИДАЛЕННЯ -->
          <div class="quantity-controls">
            <button @click="decrementItem(item)">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="$emit('incrementBasketQuantityEmit', item)">+</button>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- КНОПКА ОЧИСТКИ ВСЬОГО КОШИКА -->
    <div class="basket-clear" v-if="cartItems?.length > 3">
      <span class="clear-btn" @click="$emit('clearBasketEmit')">Очистити кошик</span>
    </div>

  </div>

  <!-- ПОРОЖНІЙ КОШИК -->
  <div v-else class="basket-empty">
    <img src="@/images/empty-basket.png" alt="empty basket" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cartItems: { type: Array, required: true }
})

const emit = defineEmits([
  'incrementBasketQuantityEmit',
  'decrementBasketQuantityEmit',
  'clearBasketEmit'
])

// не дозволяємо кількість < 0, а якщо 0 — видаляємо
function decrementItem(item) {
    emit('decrementBasketQuantityEmit', item)
}

// підрахунок сумарної різниці цін
const totalGlovoSaving = computed(() =>
  props.cartItems.reduce((acc, item) => {
    if (item.price_glovo !== null && item.price_original !== null) {
      return acc + (item.price_glovo - item.price_original) * item.quantity
    }
    return acc
  }, 0)
)

const totalBoltSaving = computed(() =>
  props.cartItems.reduce((acc, item) => {
    if (item.price_bolt !== null && item.price_original !== null) {
      return acc + (item.price_bolt - item.price_original) * item.quantity
    }
    return acc
  }, 0)
)

const totalBasketPrice = computed(() => 
  props.cartItems.reduce((acc, item) => acc + (item.price_original || 0) * item.quantity, 0)
)


</script>

<style scoped>
@import '@/css/main/basket.css'
</style>
