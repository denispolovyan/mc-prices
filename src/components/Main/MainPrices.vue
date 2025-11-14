<template>
  <div class="menu">
    <transition-group name="fade" tag="div">
      <div
        v-for="category in categories"
        :key="category"
        class="menu__category"
      >
        <!-- Заголовок категорії -->
        <div
          class="menu__category-header"
          @click="toggleCategory(category)"
        >
          <h2 class="menu__category-title">{{ category }}</h2>

          <span
            class="menu__category-arrow"
            :class="{ 'menu__category-arrow--open': openCategory === category }"
          >
            ▼
          </span>
        </div>

        <!-- Позиції категорії -->
        <transition name="expand">
          <div
            v-if="openCategory === category"
            class="menu__items"
          >
            <transition-group name="fade-up" tag="div">
              <div
                v-for="item in filteredItems(category)"
                :key="item.id"
                class="menu__item"
              >
                <div class="menu__item-info">
                  <p class="menu__item-name">{{ item.name }}</p>

                  <!-- блок з цінами -->
                  <div class="menu__price-group">
                    <div class="menu__prices">
                      <p class="menu__price">
                        <img src="@/images/mcdonalds.avif" class="menu__price-icon" />
                        {{ item.price_original }} ₴
                      </p>

                      <p
                        v-if="item.price_glovo !== null"
                        class="menu__price"
                      >
                        <img src="@/images/glovo.png" class="menu__price-icon" />
                        {{ item.price_glovo }} ₴
                      </p>

                      <p
                        v-if="item.price_bolt !== null"
                        class="menu__price"
                      >
                        <img src="@/images/bolt.png" class="menu__price-icon" />
                        {{ item.price_bolt }} ₴
                      </p>
                    </div>

                    <!-- кількість у кошику -->
                    <p
                      v-if="getItemQuantity(item) > 0"
                      class="menu__item-in-cart"
                    >
                      Додано в кошик: {{ getItemQuantity(item) }}
                    </p>
                  </div>
                </div>

                <!-- кнопки + і - -->
                <div class="menu__buttons">
                  <button
                    class="menu__btn menu__btn--add"
                    @click.stop="addItem(item)"
                  >
                    +
                  </button>

                  <button
                    v-if="getItemQuantity(item) > 0"
                    class="menu__btn menu__btn--remove"
                    @click.stop="removeItem(item)"
                  >
                    -
                  </button>
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

// watch categories
watch(
  () => props.categoriesProp,
  (newVal) => {
    categories.value = newVal;
  },
  { immediate: true }
);

// watch menu
watch(
  () => props.menuDataProp,
  (newVal) => {
    menuData.value = newVal;
  },
  { immediate: true }
);

// watch basket
watch(
  () => props.cartItemsProp,
  (newVal) => {
    cartItems.value = newVal;
  },
  { immediate: true }
);
</script>

<style scoped>
@import "@/css/main/prices.css";
</style>