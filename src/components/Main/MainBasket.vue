<template>
  <div class="basket" v-if="cartItems?.length">

    <!-- ПІДСУМОК -->
    <div class="basket__summary">
      <p class="basket__summary-text">
        <span>Ціна в закладі:</span>
        <span class="basket__summary-value basket__summary-value--mc">{{ totalBasketPrice }} ₴</span>
        На
        <span class="basket__summary-value basket__summary-value--glovo">{{ totalGlovoSaving }} ₴</span>
        дорожче у Glovo та на
        <span class="basket__summary-value basket__summary-value--bolt">{{ totalBoltSaving }} ₴</span>
        дорожче у Bolt
      </p>
    </div>

    <!-- СПИСОК ПОЗИЦІЙ -->
    <div class="basket__list">
      <transition-group name="fade-up" tag="div">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="basket__item"
        >

          <!-- ІНФО ПРО ТОВАР -->
          <div class="basket__info">
            <p class="basket__name">{{ item.name }}</p>

            <div class="basket__prices">

              <p
                v-if="item.price_original !== null && item.price_original > 0"
                class="basket__price"
              >
                <img src="@/images/mcdonalds.avif" class="basket__price-icon" />
                {{ item.price_original }} ₴
              </p>

              <p
                v-if="item.price_glovo !== null && item.price_glovo > 0"
                class="basket__price"
              >
                <img src="@/images/glovo.png" class="basket__price-icon" />
                {{ item.price_glovo }} ₴
                <span
                  class="basket__diff"
                  :class="{ 'basket__diff--negative': item.price_glovo - item.price_original > 0 }"
                >
                  ({{ (item.price_glovo - item.price_original) * item.quantity }} ₴)
                </span>
              </p>

              <p
                v-if="item.price_bolt !== null && item.price_bolt > 0"
                class="basket__price"
              >
                <img src="@/images/bolt.png" class="basket__price-icon" />
                {{ item.price_bolt }} ₴
                <span
                  class="basket__diff"
                  :class="{ 'basket__diff--negative': item.price_bolt - item.price_original > 0 }"
                >
                  ({{ (item.price_bolt - item.price_original) * item.quantity }} ₴)
                </span>
              </p>

            </div>
          </div>

          <!-- КЕРУВАННЯ КІЛЬКІСТЮ -->
          <div class="basket__controls">
            <button class="basket__btn" @click="decrementItem(item)">−</button>
            <span class="basket__quantity">{{ item.quantity }}</span>
            <button class="basket__btn" @click="$emit('incrementBasketQuantityEmit', item)">+</button>
          </div>

        </div>
      </transition-group>
    </div>

    <!-- КНОПКА ОЧИСТКИ -->
    <div class="basket__clear" v-if="cartItems?.length > 3" @click="$emit('clearBasketEmit')">
      <span class="basket__clear-btn">
        Очистити кошик
      </span>
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
