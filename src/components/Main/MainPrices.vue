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
                    <span v-for="opt in makOptions" :key="opt.key" @click="toggleOption(item, opt.key)" :class="[
                      'addon-btn',
                      { 'addon-btn--active': selectedOptions[item.id]?.keys?.has(opt.key) }
                    ]">
                      {{ opt.label }} ({{ opt.addOriginal }}/{{ opt.addServices }})
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
                    <button v-if="getItemQuantity(item) > 0 && category !== 'МАКМЕНЮ'"
                      class="menu__btn menu__btn--remove" @click.stop="removeItem(item)">
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
import { ref, watch } from 'vue'

/* emits */
const emit = defineEmits(['incrementBasketQuantityEmit', 'decrementBasketQuantityEmit'])

/* props */
const props = defineProps({
  categoriesProp: Object,
  menuDataProp: Object,
  cartItemsProp: Object
})

/* state */
const categories = ref(props.categoriesProp)
const menuData = ref(props.menuDataProp)
const cartItems = ref(props.cartItemsProp)
const openCategory = ref(null)
const selectedOptions = ref({})

/* меню опції */
const makOptions = [
  { key: 'dips', label: 'Діпи', addOriginal: 15, addServices: 15 },
  { key: 'potato', label: 'Фрі з беконом', addOriginal: 25, addServices: 29 },
  { key: 'coffee', label: 'Кава', addOriginal: 10, addServices: 10 },
  { key: 'juice', label: 'Cік', addOriginal: 20, addServices: 29 },
  { key: 'salad', label: 'Салат', addOriginal: 37, addServices: 42 },
]

/* порядок для рядка */
const PRIORITY = ["dips", "potato", "coffee", "juice", "salad"]

/* групи — тільки одна опція */
const GROUP_A = ["dips", "potato", "salad"]
const GROUP_B = ["coffee", "juice"]

/* toggle категорії */
function toggleCategory(name) {
  openCategory.value = openCategory.value === name ? null : name
}

/* toggle опції МакМеню */
function toggleOption(item, key) {
  if (!selectedOptions.value[item.id]) {
    selectedOptions.value[item.id] = { keys: new Set(), sumOriginal: 0, sumServices: 0 }
  }

  const sel = selectedOptions.value[item.id]
  const opt = makOptions.find(o => o.key === key)
  if (!opt) return

  // вимикаємо інші варіанти в групі A
  if (GROUP_A.includes(key)) {
    for (const k of [...sel.keys]) {
      if (GROUP_A.includes(k) && k !== key) {
        const rm = makOptions.find(o => o.key === k)
        sel.keys.delete(k)
        sel.sumOriginal -= rm.addOriginal
        sel.sumServices -= rm.addServices
      }
    }
  }

  // вимикаємо інші в групі B
  if (GROUP_B.includes(key)) {
    for (const k of [...sel.keys]) {
      if (GROUP_B.includes(k) && k !== key) {
        const rm = makOptions.find(o => o.key === k)
        sel.keys.delete(k)
        sel.sumOriginal -= rm.addOriginal
        sel.sumServices -= rm.addServices
      }
    }
  }

  // toggle натиснутого
  if (sel.keys.has(key)) {
    sel.keys.delete(key)
    sel.sumOriginal -= opt.addOriginal
    sel.sumServices -= opt.addServices
  } else {
    sel.keys.add(key)
    sel.sumOriginal += opt.addOriginal
    sel.sumServices += opt.addServices
  }

  // сортуємо ключі
  sel.keys = new Set([...sel.keys].sort(
    (a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b)
  ))
}

/* фільтрація позицій */
function filteredItems(categoryName) {
  return menuData.value[categoryName] || []
}

/* застосовуємо модифікатори */
function applyFinalItemData(item) {
  const entry = selectedOptions.value[item.id]

  if (item._baseOriginal == null) {
    item._baseOriginal = item.price_original
    item._baseGlovo = item.price_glovo
    item._baseBolt = item.price_bolt
    item._baseName = item.name
  }

  let finalOriginal = item._baseOriginal
  let finalGlovo = item._baseGlovo
  let finalBolt = item._baseBolt
  let finalName = item._baseName

  if (entry) {
    finalOriginal += entry.sumOriginal
    if (finalGlovo !== null) finalGlovo += entry.sumServices
    if (finalBolt !== null) finalBolt += entry.sumServices

    if (entry.keys.size > 0) {
      const labels = [...entry.keys]
        .map(k => makOptions.find(o => o.key === k)?.label.toLowerCase())
        .filter(Boolean)

      if (labels.length) finalName = `${finalName} (${labels.join(', ')})`
    }
  }

  return [finalName, finalOriginal, finalGlovo, finalBolt]
}

/* додавання до кошика */
function addItem(item) {
  const [finalName, finalOriginal, finalGlovo, finalBolt] =
    applyFinalItemData(item)

  emit('incrementBasketQuantityEmit', {
    ...item,
    name: finalName,
    price_original: finalOriginal,
    price_glovo: finalGlovo,
    price_bolt: finalBolt
  })

  selectedOptions.value[item.id] = { keys: new Set(), sumOriginal: 0, sumServices: 0 }
}

/* рядок модифікаторів */
function getSelectedAddonsLabel(item) {
  const sel = selectedOptions.value[item.id]
  if (!sel || sel.keys.size === 0) return ""

  const sorted = [...sel.keys].sort(
    (a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b)
  )

  const labels = sorted.map(k => {
    const opt = makOptions.find(o => o.key === k)
    return opt ? opt.label.toLowerCase() : ""
  })

  return labels.length ? ` (${labels.join(", ")})` : ""
}

/* видалити з кошика */
function removeItem(item) {
  emit('decrementBasketQuantityEmit', item)
}

/* кількість у кошику */
function getItemQuantity(item) {
  const ci = cartItems.value.find(ci => ci.name === item.name)
  return ci ? ci.quantity : 0
}

/* слідкуємо за пропсами */
watch(() => props.categoriesProp, v => categories.value = v)
watch(() => props.menuDataProp, v => menuData.value = v)
watch(() => props.cartItemsProp, v => cartItems.value = v)
</script>



<style scoped>
@import "@/css/main/prices.css";
</style>
