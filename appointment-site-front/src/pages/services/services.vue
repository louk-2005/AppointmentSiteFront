<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../../api/auth.js";
import { useRouter } from "vue-router";

const router = useRouter();
const services = ref([]);
const salons = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedSalon = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(12); // 12 سرویس در هر صفحه

// دریافت سرویس‌ها و سالن‌ها از API با پارامترهای فیلتر
async function getServices() {
  try {
    loading.value = true;

    // ساخت پارامترهای کوئری برای فیلترهای بکند
    const params = {};

    // اضافه کردن پارامتر جستجو اگر مقدار داشته باشد
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    // اضافه کردن پارامتر سالن اگر انتخاب شده باشد
    if (selectedSalon.value) {
      params.salon = selectedSalon.value;
    }

    const response = await api.get("appointments/services/", { params });

    // فیلتر کردن سرویس‌هایی که show آنها true است (اگر در بک‌اند انجام نشده)
    services.value = response.data;

    // استخراج سالن‌های منحصر به فرد برای فیلتر
    const uniqueSalons = [...new Set(services.value.map(service => service.salon))];
    salons.value = uniqueSalons.map(salon => ({
      id: salon.id,
      name: salon.name
    }));

    console.log(services.value);
    console.log(salons.value);
  } catch (error) {
    console.error("خطا در دریافت اطلاعات", error);
  } finally {
    loading.value = false;
  }
}

// محاسبه تعداد کل صفحات
const calculateTotalPages = computed(() => {
  return Math.ceil(services.value.length / itemsPerPage.value);
});

// سرویس‌های صفحه فعلی
const paginatedServices = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return services.value.slice(startIndex, endIndex);
});

// تغییر صفحه
function changePage(page) {
  if (page >= 1 && page <= calculateTotalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function formatDuration(duration) {
    if (!duration) return "نامشخص";

    let hours = 0, minutes = 0;

    // اگر رشته مثل "01:30:00" بود
    if (typeof duration === "string") {
        const parts = duration.split(":"); // ["01", "30", "00"]
        hours = parseInt(parts[0], 10) || 0;
        minutes = parseInt(parts[1], 10) || 0;
    }
    // اگر آبجکت بود
    else if (typeof duration === "object") {
        hours = duration.hours || 0;
        minutes = duration.minutes || 0;
    }

    if (hours > 0 && minutes > 0) {
        return `${hours} ساعت و ${minutes} دقیقه`;
    } else if (hours > 0) {
        return `${hours} ساعت`;
    } else {
        return `${minutes} دقیقه`;
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR',
        minimumFractionDigits: 0
    }).format(price);
}

// صفحه قبلی
function prevPage() {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1);
  }
}

// صفحه بعدی
function nextPage() {
  if (currentPage.value < calculateTotalPages.value) {
    changePage(currentPage.value + 1);
  }
}

// مشاهده جزئیات سرویس
function viewServiceDetails(serviceId) {
  router.push(`/services/${serviceId}`);
}

// تابع اعمال فیلترها (با تاخیر برای عملکرد بهتر)
let debounceTimeout;
function applyFilters() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    currentPage.value = 1; // ریست صفحه به 1
    getServices(); // دریافت مجدد داده‌ها با فیلترهای جدید
  }, 300); // تاخیر 300 میلی‌ثانیه‌ای
}

// نظارت بر تغییرات فیلترها
watch([searchQuery, selectedSalon], () => {
  applyFilters();
});

onMounted(() => {
  getServices();
});
</script>

<template>
  <div class="services-page">
    <!-- Header Section -->
    <div class="page-header">
      <h1 class="page-title">سرویس‌های ما</h1>
      <p class="page-description">سرویس‌های متنوع ما را کشف کنید و بهترین را برای خود انتخاب کنید</p>
    </div>

    <!-- Filters Section -->
    <div class="filters-container">
      <!-- Search Box -->
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="جستجوی سرویس..."
          class="search-input"
        />
        <div class="search-icon">
          <i class="fas fa-search"></i>
        </div>
      </div>

      <!-- Results Count -->
      <div class="filter-results" v-if="services.length > 0">
        {{ services.length }} سرویس یافت شد
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="skeleton-grid">
        <div class="skeleton-card" v-for="i in 12" :key="i">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    </div>

    <!-- Services Grid -->
    <div v-else class="services-grid">
      <div v-if="services.length === 0" class="no-results">
        <div class="no-results-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>هیچ سرویسی یافت نشد</h3>
        <p>با عبارت دیگری جستجو کنید یا فیلترها را تغییر دهید</p>
        <button @click="searchQuery = ''; selectedSalon = ''" class="reset-button">ریست فیلترها</button>
      </div>

      <transition-group v-else name="service-list" tag="div" class="grid-container">
        <div
          v-for="service in paginatedServices"
          :key="service.id"
          class="service-card"
          @click="viewServiceDetails(service.id)"
        >
          <div class="card-image" v-if="service.image">
            <img :src="service.image" :alt="service.name" />
          </div>
          <div class="card-content">
            <div class="card-salon" v-if="service.salon">
              {{ service.salon.name }}
            </div>
            <h3 class="card-title">{{ service.name }}</h3>
            <p class="card-description" v-if="service.description">
              {{ service.description.substring(0, 100) }}{{ service.description.length > 100 ? '...' : '' }}
            </p>
            <div class="card-meta" v-if="service.duration || service.price">
              <span class="duration" v-if="service.duration">
                <i class="far fa-clock"></i> {{formatDuration(service.duration)  }}
              </span>
              <span class="price" v-if="service.price">
                <i class="fas fa-money-bill-wave"></i> {{formatPrice(service.price) }}
              </span>
            </div>
            <button class="card-button">
              مشاهده جزئیات
              <i class="fas fa-arrow-left"></i>
            </button>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Pagination -->
    <div v-if="calculateTotalPages > 1" class="pagination-container">
      <div class="pagination">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="page-btn prev-btn"
        >
          <i class="fas fa-chevron-right"></i>
          قبلی
        </button>

        <div class="page-numbers">
          <button
            v-for="page in Math.min(5, calculateTotalPages)"
            :key="page"
            @click="changePage(page)"
            :class="['page-number', { active: currentPage === page }]"
          >
            {{ page }}
          </button>

          <span v-if="calculateTotalPages > 5" class="page-dots">...</span>

          <button
            v-if="calculateTotalPages > 5"
            @click="changePage(calculateTotalPages)"
            :class="['page-number', { active: currentPage === calculateTotalPages }]"
          >
            {{ calculateTotalPages }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === calculateTotalPages"
          class="page-btn next-btn"
        >
          بعدی
          <i class="fas fa-chevron-left"></i>
        </button>
      </div>

      <div class="pagination-info">
        صفحه {{ currentPage }} از {{ calculateTotalPages }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base Styles */
.services-page {
  font-family: 'IRANSans', 'Vazirmatn', sans-serif;
  color: #333333;
  background-color: #ffffff;
  padding: 2rem 0;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 0.75rem;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #ff69b4, #ff1493);
  border-radius: 2px;
}

.page-description {
  font-size: 1.125rem;
  color: #666666;
  max-width: 600px;
  margin: 1.5rem auto 0;
}

/* Filters Section */
.filters-container {
  max-width: 900px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid #ffb6c1;
  border-radius: 50px;
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(255, 105, 180, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus {
  outline: none;
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

.search-icon {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #ff69b4;
}

.filter-results {
  text-align: center;
  color: #ff69b4;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  width: 100%;
}

.skeleton-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(255, 105, 180, 0.1);
  animation: pulse 1.5s ease-in-out infinite;
  height: 380px;
  display: flex;
  flex-direction: column;
}

.skeleton-title {
  height: 24px;
  background: linear-gradient(90deg, #ffb6c1 25%, #ff69b4 50%, #ffb6c1 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, #ffb6c1 25%, #ff69b4 50%, #ffb6c1 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  animation: shimmer 1.5s infinite;
}

.skeleton-button {
  height: 40px;
  width: 120px;
  background: linear-gradient(90deg, #ffb6c1 25%, #ff69b4 50%, #ffb6c1 75%);
  background-size: 200% 100%;
  border-radius: 20px;
  margin-top: auto;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Services Grid */
.services-grid {
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 75%;
  position: relative;
}

.service-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(255, 105, 180, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid #ffb6c1;
  height: 380px;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(255, 105, 180, 0.2);
}

.card-image {
  height: 50%;
  overflow: hidden;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 1.2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-salon {
  font-size: 0.75rem;
  color: #ff69b4;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card-description {
  color: #666666;
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
  flex-grow: 1;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.duration, .price {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666666;
  font-size: 0.75rem;
}

.card-button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: auto;
}

.card-button:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
}

/* No Results State */
.no-results {
  text-align: center;
  padding: 4rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.no-results-icon {
  font-size: 4rem;
  color: #ff69b4;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.no-results h3 {
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 0.75rem;
}

.no-results p {
  color: #666666;
  margin-bottom: 2rem;
}

.reset-button {
  padding: 0.75rem 1.5rem;
  background: #ff69b4;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reset-button:hover {
  background: #ff1493;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
}

/* Pagination */
.pagination-container {
  margin-top: 3rem;
  padding: 0 1rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 2px solid #ffb6c1;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-btn:hover:not(:disabled) {
  border-color: #ff69b4;
  color: #ff69b4;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #ffb6c1;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-number:hover:not(.active) {
  border-color: #ff69b4;
  color: #ff69b4;
}

.page-number.active {
  background: #ff69b4;
  color: #ffffff;
  border-color: #ff69b4;
}

.page-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  padding: 0 0.5rem;
}

.pagination-info {
  text-align: center;
  color: #666666;
  font-size: 0.875rem;
}

/* List Transitions - بهبود یافته */
.service-list-enter-active,
.service-list-leave-active {
  transition: all 0.4s ease-in-out;
  position: absolute;
  width: calc(33.333% - 1rem);
}

.service-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.service-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.service-list-move {
  transition: all 0.4s ease-in-out;
}

/* حذف انیمیشن موج‌وار برای حالت رسمی */
/* .service-list-enter-active:nth-child(n) { transition-delay: 0s; } */

/* بهبود عملکرد در حالت موبایل */
@media (max-width: 992px) {
  .service-list-enter-active,
  .service-list-leave-active {
    width: calc(50% - 1rem);
  }
}

@media (max-width: 768px) {
  .service-list-enter-active,
  .service-list-leave-active {
    width: 100%;
  }
}


/* انیمیشن موج‌وار برای ورود عناصر */
.service-list-enter-active:nth-child(1) {
  transition-delay: 0.05s;
}
.service-list-enter-active:nth-child(2) {
  transition-delay: 0.1s;
}
.service-list-enter-active:nth-child(3) {
  transition-delay: 0.15s;
}
.service-list-enter-active:nth-child(4) {
  transition-delay: 0.2s;
}
.service-list-enter-active:nth-child(5) {
  transition-delay: 0.25s;
}
.service-list-enter-active:nth-child(6) {
  transition-delay: 0.3s;
}

/* بهبود عملکرد در حالت موبایل */
@media (max-width: 992px) {
  .service-list-enter-active,
  .service-list-leave-active {
    width: calc(50% - 1rem);
  }
}

@media (max-width: 768px) {
  .service-list-enter-active,
  .service-list-leave-active {
    width: 100%;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .grid-container {
    max-width: 900px;
  }
}

@media (max-width: 992px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    max-width: 700px;
  }

  .service-card {
    height: 360px;
  }

  .card-image {
    height: 150px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .grid-container {
    grid-template-columns: 1fr;
    max-width: 500px;
  }

  .service-card {
    height: 340px;
    max-width: 400px;
    margin: 0 auto;
  }

  .card-image {
    height: 140px;
  }

  .pagination {
    gap: 0.5rem;
  }

  .page-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .card-content {
    padding: 1rem;
  }

  .card-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .service-card {
    height: 320px;
  }
}
</style>