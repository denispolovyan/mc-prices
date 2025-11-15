<template>
  <div class="menu">
    <transition-group name="fade" tag="div">
      <div v-for="category in categories" :key="category" class="menu__category">
        <!-- Заголовок категорії -->
        <div class="menu__category-header" @click="toggleCategory(category)">
          <h2 class="menu__category-title">{{ category }}</h2>
          <span class="menu__category-arrow" :class="{ 'menu__category-arrow--open': openCategory === category }">
            ▼
          </span>
        </div>

        <!-- Позиції категорії -->
        <transition name="expand">
          <div v-if="openCategory === category" class="menu__items">
            <transition-group name="fade-up" tag="div">
              <div v-for="item in filteredItems(category)" :key="item.id" class="menu__item">
                <div class="menu__item-info">
                  <p class="menu__item-name">{{ item.name }}</p>

                  <!-- блок з цінами -->
                  <div class="menu__price-group">
                    <div class="menu__prices">
                      <p class="menu__price">
                        <img src="@/images/mcdonalds.avif" class="menu__price-icon" />
                        {{ item.price_original }} ₴
                      </p>
                      <p v-if="item.price_glovo !== null" class="menu__price">
                        <img src="@/images/glovo.png" class="menu__price-icon" />
                        {{ item.price_glovo }} ₴
                      </p>
                      <p v-if="item.price_bolt !== null" class="menu__price">
                        <img src="@/images/bolt.png" class="menu__price-icon" />
                        {{ item.price_bolt }} ₴
                      </p>
                    </div>

                    <!-- кількість у кошику -->
                    <p v-if="getItemQuantity(item) > 0 && category !== 'МАКМЕНЮ'" class="menu__item-in-cart">
                      Додано в кошик: {{ getItemQuantity(item) }}
                    </p>
                  </div>

                  <!-- Опції МАКМЕНЮ -->
                  <div v-if="category === 'МАКМЕНЮ'" class="menu__addons">
                    <span
                      v-for="opt in makOptions"
                      :key="opt.key"
                      @click="toggleOption(item, opt.key)"
                      :class="['addon-btn', { 'addon-btn--active': selectedOptions[item.id]?.has(opt.key) }]"
                    >
                      {{ opt.label }} ({{opt.addOriginal }}/{{opt.addServices}})
                  </span>
                  </div>

                </div>

                <div class="menu__buttons">
                  <!-- картинка справа -->
                  <div>
                    <img v-if="item.urlToImg" :src="item.urlToImg" class="menu__item-right-img" />
                  </div>

                  <!-- кнопки + і - -->
                  <div class="buttons__container">
                    <button v-if="getItemQuantity(item) > 0  && category !== 'МАКМЕНЮ'" class="menu__btn menu__btn--remove" @click.stop="removeItem(item)">
                      -
                    </button>
                    <button class="menu__btn menu__btn--add" @click.stop="addItem(item)">
                      +
                    </button>
                  </div>
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
// base
import { ref, watch } from 'vue'

// emits
const emit = defineEmits(['incrementBasketQuantityEmit', 'decrementBasketQuantityEmit'])

// props
const props = defineProps({
  categoriesProp: { type: Object, required: true },
  menuDataProp: { type: Object, required: true },
  cartItemsProp: { type: Object, required: true }
});

// consts
const categories = ref(props.categoriesProp)
const menuData = ref(props.menuDataProp)
const cartItems = ref(props.cartItemsProp)
const openCategory = ref(null)
const selectedOptions = ref({})

const makOptions = [
  { key: 'dips', label: 'Діпи', addOriginal: 15, addServices: 15 },
  { key: 'coffee', label: 'Кава', addOriginal: 10, addServices: 10 },
  { key: 'salad', label: 'Салат', addOriginal: 37, addServices: 42 },
  // { key: 'potato', label: 'Фрі з беконом', addOriginal: 25, addServices: 29 },
  // { key: 'juice', label: 'Апельсиновий сік', addOriginal: 20, addServices: 29 },

]

// functions
function toggleCategory(name) {
  openCategory.value = openCategory.value === name ? null : name
}

function toggleOption(item, key) {
  if (!selectedOptions.value[item.id]) selectedOptions.value[item.id] = new Set()
  if (selectedOptions.value[item.id].has(key)) {
    selectedOptions.value[item.id].delete(key)
  } else {
    selectedOptions.value[item.id].add(key)
  }
}

function filteredItems(categoryName) {
  return menuData.value[categoryName] || []
}

// Перерахунок ціни і назви на етапі додавання в кошик
function applyFinalItemData(item) {
  const opts = selectedOptions.value[item.id] || new Set()

  // Зберігаємо базові значення, якщо ще не збережено
  if (item._baseOriginal == null) {
    item._baseOriginal = item.price_original
    item._baseGlovo = item.price_glovo
    item._baseBolt = item.price_bolt
    item._baseName = item.name
  }

  // Відновлюємо базові значення
  item.price_original = item._baseOriginal
  item.price_glovo = item._baseGlovo
  item.price_bolt = item._baseBolt
  item.name = item._baseName

  const addonsNames = []

  makOptions.forEach(opt => {
    if (opts.has(opt.key)) {
      item.price_original += opt.addOriginal
      if (item.price_glovo !== null) item.price_glovo += opt.addServices
      if (item.price_bolt !== null) item.price_bolt += opt.addServices
      addonsNames.push(opt.label.toLowerCase())
    }
  })

  if (addonsNames.length > 0) {
    item.name = `${item._baseName} (${addonsNames.join(', ')})`
  }

  return [item._baseName, item._baseOriginal, item._baseGlovo, item._baseBolt]
}

// Додавання в кошик
function addItem(item) {
  const [baseName, baseOriginal, baseGlovo, baseBolt] = applyFinalItemData(item);
  selectedOptions.value[item.id] = new Set() // скидаємо вибір після додавання
  emit('incrementBasketQuantityEmit', item)

  selectedOptions.value = {};
  item.name = baseName;
  item.price_glovo = baseGlovo;
  item.price_bolt = baseBolt;
  item.price_original = baseOriginal;
}

// Видалення з кошика
function removeItem(item) {
  emit('decrementBasketQuantityEmit', item)
}

// Кількість у кошику
function getItemQuantity(item) {
  const cartItem = cartItems.value.find(ci => ci.name === item.name)
  return cartItem ? cartItem.quantity : 0
}

// ------------------------
// Watchers
// ------------------------
watch(() => props.categoriesProp, (newVal) => { categories.value = newVal }, { immediate: true })
watch(() => props.menuDataProp, (newVal) => { menuData.value = newVal }, { immediate: true })
watch(() => props.cartItemsProp, (newVal) => { cartItems.value = newVal }, { immediate: true })
</script>

<style scoped>
@import "@/css/main/prices.css";
</style>
