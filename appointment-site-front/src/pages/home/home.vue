<script setup>
import {ref, onMounted, onUnmounted, watch} from "vue";
import api from "../../api/auth.js";
import {useRouter} from "vue-router";

const HomeImages = ref([]);
const currentIndex = ref(0);
const services = ref();
let slideInterval = null;

async function getHomeHeaderImage() {
    try {
        const response = await api.get("accounts/home/images");
        HomeImages.value = response.data;
        // console.log(HomeImages.value);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات", error);
    }
}

async function getServices() {
    try {
        const response = await api.get("appointments/services/");
        // فیلتر کردن سرویس‌هایی که show آنها true است
        services.value = response.data.filter(service => service.show === true);
        // console.log(services.value);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات", error);
    }
}

// تابع رفتن به اسلاید بعدی
function nextSlide() {
    if (HomeImages.value.length === 0) return;
    currentIndex.value = (currentIndex.value + 1) % HomeImages.value.length;
}

// تابع رفتن به اسلاید قبلی
function prevSlide() {
    if (HomeImages.value.length === 0) return;
    currentIndex.value = (currentIndex.value - 1 + HomeImages.value.length) % HomeImages.value.length;
}

// تابع رفتن به اسلاید مشخص
function goToSlide(index) {
    currentIndex.value = index;
}

// شروع اسلایدر خودکار
function startSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// توقف اسلایدر خودکار
function stopSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// تماشای تغییرات در HomeImages برای به‌روزرسانی موقعیت اسلایدر
watch(HomeImages, () => {
    if (HomeImages.value.length > 0) {
        // اطمینان از اینکه currentIndex در محدوده صحیح است
        if (currentIndex.value >= HomeImages.value.length) {
            currentIndex.value = 0;
        }
    }
});

// متد برای فرمت‌دهی به قیمت
function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR',
        minimumFractionDigits: 0
    }).format(price);
}

// متد برای فرمت‌دهی به مدت زمان
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


// متد برای انتخاب آیکون مناسب بر اساس نام خدمت
// متد برای انتخاب آیکون مناسب بر اساس نام خدمت
function getServiceIcon(serviceName) {
    const name = serviceName.toLowerCase();
    if (name.includes("مو") || name.includes("کراتین") || name.includes("صافی")) {
        return ["fas", "cut"];
    } else if (name.includes("ابرو") || name.includes("میکرو")) {
        return ["fas", "paint-brush"];
    } else if (name.includes("پوست") || name.includes("فیشیال")) {
        return ["fas", "spa"];
    } else if (name.includes("مژه") || name.includes("کاشت")) {
        return ["fas", "gem"];
    } else if (name.includes("ناخن")) {
        return ["fas", "hand-sparkles"];
    } else if (name.includes("میکاپ") || name.includes("آرایش")) {
        return ["fas", "magic"];
    } else if (name.includes("ماساژ")) {
        return ["fas", "hand-holding-heart"];
    } else {
        return ["fas", "star"];
    }
}


// متد برای رزرو خدمت
function bookService(service) {
    console.log('رزرو خدمت:', service.name);
    // اینجا می‌توانید کاربر را به صفحه رزرو هدایت کنید
}

onMounted(() => {
    getHomeHeaderImage();
    getServices();
    startSlideShow();
});

onUnmounted(() => {
    stopSlideShow();
});
</script>

<template>
    <div class="home-header">
        <div class="home-header-box">
            <div class="home-header-content">
                <div v-if="HomeImages.length === 0" class="loading-text">در حال بارگذاری تصاویر...</div>
                <div v-else class="modern-slider">
                    <!-- بخش اطلاعات و دکمه‌ها -->
                    <div class="slider-right">
                        <div class="content-container">
                            <div class="badge">جدیدترین خدمات</div>
                            <h1>سالن آرایشی گلچین</h1>
                            <p>رزرو آسان به همراه بهترین خدمات آرایشی و زیبایی با بهترین متخصصان</p>
                            <div class="feature-list">
                                <div class="feature-item">
                                    <div class="feature-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <span>کاشت ناخن</span>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">
                                        <i class="fas fa-user-check"></i>
                                    </div>
                                    <span> اصلاح مو</span>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">
                                        <i class="fas fa-calendar-check"></i>
                                    </div>
                                    <span>کاشت ابرو</span>
                                </div>
                            </div>
                            <div class="action-buttons">
                                <a href="/services" class="primary-btn">
                                    <i class="fas fa-spa"></i>
                                    <span>مشاهده خدمات</span>
                                </a>
                                <a href="/booking" class="secondary-btn">
                                    <i class="fas fa-calendar-plus"></i>
                                    <span>رزرو تایم</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- بخش تصاویر با اسکرول افقی -->
                    <div class="slider-left">
                        <div class="scroll-container" ref="scrollContainer" @mouseenter="stopSlideShow"
                             @mouseleave="startSlideShow">
                            <div
                                v-for="(img, index) in HomeImages"
                                :key="index"
                                class="slide-item"
                                :class="{ active: index === currentIndex }"
                            >
                                <img
                                    :src="img.image"
                                    :alt="img.alt || 'Slide ' + (index + 1)"
                                    class="slider-image"
                                />
                                <div class="image-overlay"></div>
                            </div>
                        </div>
                        <!-- دکمه‌های ناوبری -->
                        <button class="nav-btn prev-btn" @click="prevSlide">
                            <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                        </button>
                        <button class="nav-btn next-btn" @click="nextSlide">
                            <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                        </button>
                        <!-- نقاط اسلایدر -->
                        <div class="slider-dots">
                            <span
                                v-for="(img, index) in HomeImages"
                                :key="index"
                                class="dot"
                                :class="{ active: index === currentIndex }"
                                @click="goToSlide(index)"
                            ></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- بخش درباره ما -->
    <div class="about-us">
        <div class="about-us-box">
            <div class="about-us-content">
                <div class="about-us-info">
                    <h5>درباره ما</h5>
                    <p>
                        سالن زیبایی ما با بیش از ۱۰ سال سابقه در ارائه خدمات آرایشی و زیبایی،
                        همواره در تلاش بوده تا بهترین خدمات را به مشتریان عزیز ارائه دهد.
                        ما با استفاده از تجهیزات پیشرفته و مواد اولیه مرغوب، محیطی امن و
                        آرامش بخش را برای شما فراهم کرده‌ایم. تیم ما متشکل از آرایشگران
                        حرفه‌ای و خلاق است که همیشه به دنبال به‌روزترین متدهای آرایشی و زیبایی
                        هستند...
                    </p>
                    <a href="/about">بیشتر بخوانید</a>
                </div>
                <div class="picture">
                    <img src="../../assets/images/لوازم-مورد-نیاز-برای-آرایشگاه-زنانه.jpg" alt="درباره ما"/>
                    <div class="icons">
                        <div class="icon-item">
                            <i class="fas fa-cut"></i>
                            <span>آرایش حرفه‌ای</span>
                        </div>
                        <div class="icon-item">
                            <i class="fas fa-spa"></i>
                            <span>خدمات اسپا</span>
                        </div>
                        <div class="icon-item">
                            <i class="fas fa-paint-brush"></i>
                            <span>میکاپ حرفه‌ای</span>
                        </div>
                        <div class="icon-item">
                            <i class="fas fa-star"></i>
                            <span>رضایت مشتری</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- بخش خدمات -->
    <div class="services">
        <div class="services-box">
            <div class="services-content">
                <div class="section-header">
                    <h2 class="section-title">خدمات سالن</h2>
                    <p class="section-subtitle">تجربه‌ای لوکس با جدیدترین متدهای آرایشی و زیبایی</p>
                </div>
                <div class="services-grid" v-if="services && services.length > 0">
                    <!-- کارت بزرگ -->
                    <div class="service-card large" v-if="services[0]">
                        <div class="service-icon">
                            <font-awesome-icon :icon="getServiceIcon(services[0].name)"/>
                        </div>
                        <h3 class="service-title">{{ services[0].name }}</h3>
                        <p class="service-description">{{ services[0].description }}</p>
                        <div class="service-details">
                            <div class="service-duration">
                                <font-awesome-icon :icon="['fas', 'clock']"/>
                                <span>{{ formatDuration(services[0].duration) }}</span>
                            </div>
                            <div class="service-price">{{ formatPrice(services[0].price) }}</div>
                        </div>
                        <button class="service-btn" @click="bookService(services[0])">رزرو کنید</button>
                    </div>

                    <!-- کارت متوسط -->
                    <div class="service-card medium" v-if="services[1]">
                        <span class="service-badge">پرفروش‌ترین</span>
                        <div class="service-icon">
                            <font-awesome-icon :icon="getServiceIcon(services[1].name)"/>
                        </div>
                        <h3 class="service-title">{{ services[1].name }}</h3>
                        <p class="service-description">{{ services[1].description }}</p>
                        <div class="service-details">
                            <div class="service-duration">
                                <font-awesome-icon :icon="['fas', 'clock']"/>
                                <span>{{ formatDuration(services[1].duration) }}</span>
                            </div>
                            <div class="service-price">{{ formatPrice(services[1].price) }}</div>
                        </div>
                        <button class="service-btn" @click="bookService(services[1])">رزرو کنید</button>
                    </div>

                    <!-- کارت کوچک -->
                    <div class="service-card small" v-if="services[2]">
                        <div class="service-icon">
                            <font-awesome-icon :icon="getServiceIcon(services[2].name)"/>
                        </div>
                        <h3 class="service-title">{{ services[2].name }}</h3>
                        <p class="service-description">{{ services[2].description }}</p>
                        <div class="service-details">
                            <div class="service-duration">
                                <font-awesome-icon :icon="['fas', 'clock']"/>
                                <span>{{ formatDuration(services[2].duration) }}</span>
                            </div>
                            <div class="service-price">{{ formatPrice(services[2].price) }}</div>
                        </div>
                        <button class="service-btn" @click="bookService(services[2])">رزرو کنید</button>
                    </div>

                    <!-- کارت بلند -->
                    <div class="service-card tall" v-if="services[3]">
                        <div class="service-icon">
                            <font-awesome-icon :icon="getServiceIcon(services[3].name)"/>
                        </div>
                        <h3 class="service-title">{{ services[3].name }}</h3>
                        <p class="service-description">{{ services[3].description }}</p>
                        <div class="service-details">
                            <div class="service-duration">
                                <font-awesome-icon :icon="['fas', 'clock']"/>
                                <span>{{ formatDuration(services[3].duration) }}</span>
                            </div>
                            <div class="service-price">{{ formatPrice(services[3].price) }}</div>
                        </div>
                        <button class="service-btn" @click="bookService(services[3])">رزرو کنید</button>
                    </div>

                    <!-- کارت هم‌پوشان -->
                    <div class="service-card overlay" v-if="services[4]">
                        <div class="service-icon">
                            <font-awesome-icon :icon="getServiceIcon(services[4].name)"/>
                        </div>
                        <h3 class="service-title">{{ services[4].name }}</h3>
                        <p class="service-description">{{ services[4].description }}</p>
                        <div class="service-details">
                            <div class="service-duration">
                                <font-awesome-icon :icon="['fas', 'clock']"/>
                                <span>{{ formatDuration(services[4].duration) }}</span>
                            </div>
                            <div class="service-price">{{ formatPrice(services[4].price) }}</div>
                        </div>
                        <button class="service-btn" @click="bookService(services[4])">رزرو کنید</button>
                    </div>
                </div>
                <div class="no-services" v-else>
                    <p>در حال بارگذاری خدمات...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ===== استایل مدرن هدر ===== */
.home-header {
    height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-header-box {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: white;
}

.home-header-content {
    width: 100%;
    height: 100%;
    position: relative;
}

.modern-slider {
    display: flex;
    height: 100%;
    width: 100%;
}

/* بخش تصاویر با اسکرول افقی */
.slider-left {
    flex: 0 0 60%;
    position: relative;
    overflow: hidden;
    background: white;
}

.scroll-container {
    display: flex;
    height: 100%;
    width: 100%;
    position: relative;
}

.slide-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    z-index: 1;
}

.slide-item.active {
    opacity: 1;
    z-index: 2;
}

.slider-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.slide-item:hover .slider-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

/* دکمه‌های ناوبری */
.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(5px);
    border: 2px solid rgba(255, 255, 255, 0.16);
    color: #000000;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
}

.nav-btn:hover {
    background: rgba(188, 188, 188, 0.62);
    color: white;
    transform: translateY(-50%) scale(1.1);
}

.prev-btn {
    right: 20px;
}

.next-btn {
    left: 20px;
}

/* نقاط اسلایدر */
.slider-dots {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(186, 186, 186, 0.97);
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot.active {
    background: #3498db;
    transform: scale(1.3);
}

/* بخش اطلاعات و دکمه‌ها */
.slider-right {
    flex: 0 0 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    padding: 40px;
    position: relative;
    overflow: hidden;
}

.slider-right::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    z-index: 1;
}

.slider-right::after {
    content: '';
    position: absolute;
    bottom: -70px;
    left: -70px;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    z-index: 1;
}

.content-container {
    max-width: 90%;
    z-index: 2;
    text-align: center;
    color: white;
}

.badge {
    display: inline-block;
    padding: 6px 15px;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
    border-radius: 20px;
    font-size: 14px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    color: #ff1493;
    font-weight: bold;
}

h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.2;
    text-shadow: 0 2px 10px rgba(255, 20, 147, 0.3);
    color: #ff1493;
}

p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 30px;
    opacity: 0.9;
    color: #d1006b;
}

.feature-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 40px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.feature-item:last-child {
    border-bottom: none;
}

.feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #ff1493;
}

.action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.primary-btn, .secondary-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.primary-btn {
    background: white;
    color: #ff69b4;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.primary-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

.secondary-btn {
    background: rgba(255, 255, 255, 0.3);
    color: white;
    border: 2px solid white;
    backdrop-filter: blur(5px);
}

.secondary-btn:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);
}

.loading-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.5rem;
    color: #ff69b4;
}

/* ===== بخش درباره ما ===== */
.about-us {
    padding: 80px 0;
    font-family: 'IRANSans', sans-serif;
}

.about-us-box {
    width: 75%;
    margin: 0 auto;
    padding: 0;
}

.about-us-content {
    display: flex;
    align-items: center;
    gap: 60px;
}

/* بخش اطلاعات متن */
.about-us-info {
    flex: 1;
    order: 1;
}

.about-us-info h5 {
    font-size: 24px;
    font-weight: 700;
    color: #ff1493;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
}

.about-us-info h5::after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #ff69b4, #ff1493);
    border-radius: 2px;
}

.about-us-info p {
    font-size: 16px;
    line-height: 1.8;
    color: #d1006b;
    margin-bottom: 25px;
    text-align: justify;
    max-width: 500px;
}

.about-us-info a {
    display: inline-block;
    padding: 12px 30px;
    background: linear-gradient(90deg, #ff69b4, #ff1493);
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.about-us-info a:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

/* بخش تصویر */
.picture {
    flex: 1;
    position: relative;
    order: 1;
}

.picture img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
    transition: all 0.5s ease;
}

.picture:hover img {
    transform: scale(1.03);
}

/* آیکون‌ها */
.icons {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    background: white;
    padding: 15px 25px;
    border-radius: 50px;
    box-shadow: 0 5px 20px rgba(255, 105, 180, 0.2);
    gap: 25px;
}

.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.icon-item i {
    font-size: 24px;
    color: #ff69b4;
}

.icon-item span {
    font-size: 12px;
    color: #d1006b;
    font-weight: 500;
}

/* ===== استایل بخش خدمات ===== */
.services {
    padding: 100px 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
    position: relative;
    overflow: hidden;
}

.services-box {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

.services-content {
    position: relative;
    z-index: 1;
}

.section-header {
    text-align: center;
    margin-bottom: 80px;
    position: relative;
}

.section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    color: #ff1493;
    margin-bottom: 15px;
    position: relative;
    display: inline-block;
    transform: rotate(-1deg);
}

.section-title::before {
    content: 'خدمات';
    position: absolute;
    top: -15px;
    right: -20px;
    font-size: 1.8rem;
    color: rgba(255, 20, 147, 0.2);
    z-index: -1;
}

.section-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.2rem;
    color: #d1006b;
    max-width: 600px;
    margin: 0 auto;
    transform: rotate(0.5deg);
}

/* گرید نامنظم */
.services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(100px, auto);
    gap: 25px;
    position: relative;
}

/* کارت‌های با اندازه‌های مختلف */
.service-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.service-card::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #ff69b4, #ff1493);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.5s ease;
}

.service-card:hover::before {
    transform: scaleX(1);
}

.service-card:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 20px 40px rgba(255, 20, 147, 0.25);
}

/* اندازه‌های مختلف کارت‌ها */
.service-card.large {
    grid-column: span 2;
    grid-row: span 2;
    transform: rotate(-1deg);
}

.service-card.medium {
    grid-column: span 2;
    transform: rotate(0.5deg);
}

.service-card.small {
    grid-column: span 1;
    transform: rotate(-0.5deg);
}

.service-card.tall {
    grid-row: span 2;
}

/* هم‌پوشانی کارت‌ها */
.service-card.overlay {
    position: absolute;
    width: calc(50% - 40px);
    bottom: -50px;
    left: 25%;
    z-index: 2;
    transform: rotate(2deg);
}

.service-card.overlay:hover {
    transform: rotate(2deg) translateY(-15px) scale(1.02);
}

/* آیکون‌های مدرن */
/* آیکون‌های مدرن */
.service-icon {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    border-radius: 20px;
    margin-bottom: 25px;
    font-size: 1.8rem;
    color: #ff1493;
    position: relative;
}

.service-icon::after {
    content: '';
    position: absolute;
    top: -5px;
    right: -5px;
    width: 30px;
    height: 30px;
    background: #ff69b4;
    border-radius: 50%;
    opacity: 0.1;
}

.service-icon svg {
    font-size: 1.8rem;
    color: #ff1493;
}

.service-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.6rem;
    color: #d1006b;
    margin-bottom: 15px;
    position: relative;
}

.service-description {
    color: #d1006b;
    margin-bottom: 25px;
    font-size: 0.95rem;
    line-height: 1.7;
}

.service-details {
    margin-bottom: 20px;
}

.service-duration {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    color: #d1006b;
}

.service-duration i {
    color: #ff69b4;
}

.service-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    color: #ff1493;
    display: flex;
    align-items: center;
    gap: 10px;
}

.service-price::before {
    content: '';
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #ff69b4, #ff1493);
}

.service-btn {
    display: inline-block;
    background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
    color: white;
    padding: 12px 25px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    position: relative;
    overflow: hidden;
}

.service-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-100%);
    transition: transform 0.4s ease;
}

.service-btn:hover::before {
    transform: translateX(0);
}

.service-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(255, 20, 147, 0.3);
}

/* نشان ویژه */
.service-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #ff1493;
    color: white;
    padding: 6px 15px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    transform: rotate(-3deg);
    box-shadow: 0 4px 10px rgba(255, 20, 147, 0.3);
}

.no-services {
    text-align: center;
    padding: 40px;
    color: #d1006b;
    font-size: 1.2rem;
}

/* المان‌های دکوراتیو */
.services::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 5%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 154, 158, 0.4) 0%, rgba(255, 154, 158, 0) 70%);
    border-radius: 50%;
    z-index: 0;
}

.services::after {
    content: '';
    position: absolute;
    bottom: 15%;
    right: 8%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 20, 147, 0.3) 0%, rgba(255, 20, 147, 0) 70%);
    border-radius: 50%;
    z-index: 0;
}

/* انیمیشن‌ها */
@keyframes float {
    0% {
        transform: translateY(0px) rotate(-1deg);
    }
    50% {
        transform: translateY(-10px) rotate(-1deg);
    }
    100% {
        transform: translateY(0px) rotate(-1deg);
    }
}

.service-card.large {
    animation: float 6s ease-in-out infinite;
}

/* ===== رسپانسیو ===== */
@media (max-width: 992px) {
    .home-header-box {
        width: 90%;
        height: 95vh;
    }

    .modern-slider {
        flex-direction: column;
    }

    .slider-left {
        flex: 0 0 50%;
    }

    .slider-right {
        flex: 0 0 50%;
        padding: 30px;
    }

    h1 {
        font-size: 2.5rem;
    }

    .action-buttons {
        flex-direction: column;
        align-items: center;
    }

    .primary-btn, .secondary-btn {
        width: 80%;
        justify-content: center;
    }

    .about-us-content {
        flex-direction: column;
        gap: 40px;
    }

    .about-us-info {
        order: 2;
    }

    .picture {
        order: 1;
    }

    .services-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .service-card.overlay {
        position: relative;
        width: 100%;
        bottom: auto;
        left: auto;
        transform: none;
    }
}

@media (max-width: 768px) {
    .home-header-box {
        width: 95%;
        height: auto;
        flex-direction: column;
    }

    .slider-left {
        flex: 0 0 40%;
    }

    .slider-right {
        flex: 0 0 60%;
        padding: 20px;
    }

    h1 {
        font-size: 2rem;
    }

    p {
        font-size: 1rem;
    }

    .feature-list {
        margin-bottom: 30px;
    }

    .feature-item {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }

    .about-us-box {
        width: 90%;
    }

    .services-grid {
        grid-template-columns: 1fr;
    }

    .service-card.large,
    .service-card.medium,
    .service-card.small,
    .service-card.tall {
        grid-column: span 1;
        grid-row: span 1;
        transform: none !important;
    }

    .section-title {
        font-size: 2.5rem;
        transform: none;
    }

    .section-subtitle {
        transform: none;
    }
}

@media (max-width: 576px) {
    .home-header-box {
        width: 100%;
        border-radius: 0;
        height: auto;
    }

    .slider-left {
        flex: 0 0 35%;
    }

    .slider-right {
        flex: 0 0 65%;
        padding: 20px;
    }

    h1 {
        font-size: 1.8rem;
    }

    .nav-btn {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }

    .prev-btn {
        right: 10px;
    }

    .next-btn {
        left: 10px;
    }

    .slider-dots {
        bottom: 15px;
    }

    .dot {
        width: 10px;
        height: 10px;
    }

    .primary-btn, .secondary-btn {
        padding: 12px 20px;
        font-size: 14px;
    }

    .about-us {
        padding: 60px 0;
    }

    .about-us-info h5 {
        font-size: 20px;
    }

    .about-us-info p {
        font-size: 14px;
        line-height: 1.6;
    }

    .about-us-info a {
        padding: 10px 25px;
        font-size: 13px;
    }

    .picture img {
        height: 250px;
    }

    .icons {
        bottom: -10px;
        padding: 10px 15px;
        gap: 15px;
        flex-wrap: wrap;
        justify-content: center;
    }

    .icon-item {
        flex-direction: row;
        gap: 5px;
    }

    .icon-item i {
        font-size: 18px;
    }

    .icon-item span {
        font-size: 11px;
    }

    .services {
        padding: 60px 0;
    }

    .service-card {
        padding: 20px;
    }

    .service-icon {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
    }

    .service-title {
        font-size: 1.3rem;
    }

    .service-price {
        font-size: 1.5rem;
    }
}
</style>