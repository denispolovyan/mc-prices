<template>
  <div class="app-container">
    <div class="buttons">
      <button @click="showPricesFunc(); showDeals = false">Переглянути ціни</button>
      <button @click="showDealsFunc(); showPrices = false">Порахувати вигоду</button>
    </div>

    <!-- Секція меню -->
    <div v-if="showPrices" class="menu-section">
      <div v-for="category in categories" :key="category.name" class="category-item">
        <div class="category-header" @click="toggleCategory(category.name)">
          <h2>{{ category.name }}</h2>
          <span>{{ openCategory === category.name ? '-' : '+' }}</span>
        </div>

        <div v-if="openCategory === category.name" class="menu-items">
          <div v-for="item in filteredItems(category.name)" :key="item.id" class="menu-item">
            <div class="menu-text">
              <p class="item-name">{{ item.name }}</p>
              <div class="price-row">
                <p class="item-price">
                  <img src="../images/glovo.png" alt="Glovo" class="price-icon"> {{ item.price_glovo }} ₴
                </p>
                <p class="item-price">
                  <img src="../images/bolt.png" alt="Bolt" class="price-icon"> {{ item.price_bolt }} ₴
                </p>
                <p class="item-price">
                  <img src="../images/mcdonalds.avif" alt="Original" class="price-icon"> {{ item.price_original }} ₴
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Секція вигоди -->
    <div v-if="showDeals" class="deals-section">
      <img v-for="n in 3" :key="n" class="deal-img" :src="'/path/to/deal' + n + '.jpg'" alt="deal" @click="onDealClick(n)">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

var showPrices = ref(false)
var showDeals = ref(false)
var openCategory = ref(null)
var menuItems = ref([])
var categories = ref([])

function showPricesFunc() {
  showPrices.value = true
}

function showDealsFunc() {
  showDeals.value = true
}

function toggleCategory(name) {
  if (openCategory.value === name) {
    openCategory.value = null
  } else {
    openCategory.value = name
  }
}

// Завантажуємо меню
onMounted(function () {
  fetch('https://denispolovyan.github.io/delievery_parser_endpoint/data/result/newest_result.json')
    .then(function (res) { return res.json() })
    .then(function (data) {
      menuItems.value = data
    })

  categories.value = [
    { name: 'Холодні напої' },
    { name: 'Бургери' },
    { name: 'Картопля та снеки' },
    { name: 'Десерти' },
    { name: 'Соуси' },
    { name: 'Хеппі Міл' }
  ]
})

// Фільтруємо елементи по категорії
function filteredItems(categoryName) {
  return menuItems.value.filter(function (item) {
    if (categoryName === 'Холодні напої') {
      return /АМЕРИКАНО|КАКАО|КАПУЧИНО|ЛАТЕ|МОККО|ФЛЕТ ВАЙТ|ЧАЙ/i.test(item.name)
    }
    if (categoryName === 'Бургери') {
      return /БІГ МАК|ДАБЛ|РОЯЛ|ЧІЗБУРГЕР|МАКЧІКЕН|ФІЛЕ-О-ФІШ/i.test(item.name)
    }
    if (categoryName === 'Картопля та снеки') {
      return /КАРТОПЛЯ|СТРІПСИ|МАККРІСПІ/i.test(item.name)
    }
    if (categoryName === 'Десерти') {
      return /МАКФЛУРІ|МАКПИРІГ/i.test(item.name)
    }
    if (categoryName === 'Соуси') {
      return /СОУС/i.test(item.name)
    }
    if (categoryName === 'Хеппі Міл') {
      return /ХЕППІ МІЛ/i.test(item.name)
    }
    return false
  })
}

function onDealClick(n) {
  alert('Натиснута картинка ' + n)
}
</script>


<style scoped>
@import '../css/main/buttons.css';
@import '../css/main/prices.css';
@import '../css/main/basket.css';
</style>
