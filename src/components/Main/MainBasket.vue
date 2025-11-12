<template>
  <div class="basket-section" v-if="cartItems?.length">
    <transition-group name="fade-up" tag="div" class="basket-container">
      <div class="basket-list">
        <div v-for="item in cartItems" :key="item.id" class="basket-item">
          <div class="basket-info">
            <p class="basket-name">{{ item.name }}</p>
            <div class="basket-prices">
              <p><img src="@/images/mcdonalds.avif" class="price-icon"> {{ item.price_original }} ₴</p>
              <p><img src="@/images/glovo.png" class="price-icon">
                {{ item.price_glovo }} ₴
                <span class="diff" :class="{ positive: item.price_glovo - item.price_original > 0 }">
                  ({{ item.price_glovo - item.price_original }} ₴)
                </span>
              </p>
              <p><img src="@/images/bolt.png" class="price-icon">
                {{ item.price_bolt }} ₴
                <span class="diff" :class="{ positive: item.price_bolt - item.price_original > 0 }">
                  ({{ item.price_bolt - item.price_original }} ₴)
                </span>
              </p>
            </div>
          </div>
          <button class="remove-btn" @click="$emit('remove-item', item)">✕</button>
      </div>
      </div>
    </transition-group>
  </div>

  <div v-else class="basket-empty">
    <img src="@/images/empty-basket.png" alt="empty basket">
  </div>
</template>

<script setup>
defineProps({
  cartItems: { type: Array, required: true }
})
</script>

<style scoped>
@import '@/css/main/basket.css'
</style>
