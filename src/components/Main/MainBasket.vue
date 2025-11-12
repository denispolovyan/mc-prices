<template>
  <div class="basket-section" v-if="cartItems.length > 0">
    <h2 class="basket-title">🛒 Кошик</h2>
    <transition-group name="fade-up" tag="div" class="basket-list">
      <div 
        v-for="item in cartItems" 
        :key="item.id" 
        class="basket-item"
      >
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
        <button class="remove-btn" @click="$emit('remove-item', item.id)">✕</button>
      </div>
    </transition-group>
  </div>

  <div v-else class="basket-empty">
    <p>Кошик порожній 💤</p>
  </div>
</template>

<script setup>
defineProps({
  cartItems: { type: Array, required: true }
})
</script>

<style scoped>
.basket-section {
  flex: 1;
  background-color: #FFF4E1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  animation: fadeIn 0.3s ease forwards;
}

.basket-title {
  color: #C1272D;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.basket-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.basket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fffaf3;
  padding: 12px 15px;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.basket-item:hover {
  transform: translateY(-2px);
}

.basket-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.basket-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #C1272D;
}

.basket-prices p {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.diff {
  font-size: 0.9rem;
  color: #007a00;
}

.diff.positive {
  color: #DA291C;
}

.price-icon {
  width: 24px;
  height: 24px;
}

.remove-btn {
  background: #C1272D;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.remove-btn:hover {
  background: #A51B23;
}

.basket-empty {
  text-align: center;
  color: #999;
  font-size: 1.1rem;
  padding: 40px 0;
  background-color: #FFF4E1;
  border-radius: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
