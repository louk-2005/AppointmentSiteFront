<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()

// State برای کنترل نمایش هدر
const isHeaderVisible = ref(true)
const lastScrollPosition = ref(0)
const scrollThreshold = 100

// آیتم‌های منوی ناوبری با مسیرهای واقعی
const navItems = [
    {name: 'خانه', path: '/'},
    {name: 'درباره ما', path: '/about'},
    {name: 'خدمات', path: '/services'},
    {name: 'نوبت دهی آنلاین', path: '/booking'},
    {name: 'ارتباط با ما', path: '/contact'},
    {name: 'ورود/ثبت نام', path: '/user'}
]

// تابع کنترل نمایش هدر بر اساس اسکرول
const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

    if (currentScrollPosition < scrollThreshold) {
        isHeaderVisible.value = true
        return
    }

    if (currentScrollPosition > lastScrollPosition.value && currentScrollPosition > scrollThreshold) {
        isHeaderVisible.value = false
    } else if (currentScrollPosition < lastScrollPosition.value) {
        isHeaderVisible.value = true
    }

    lastScrollPosition.value = currentScrollPosition
}

// تابع جستجو
const handleSearch = () => {
    const searchInput = document.getElementById('search-input')
    if (searchInput && searchInput.value.trim()) {
        console.log('جستجو برای:', searchInput.value)
        // اینجا می‌توانید به صفحه جستجو هدایت کنید
        // router.push({ path: '/search', query: { q: searchInput.value } })
    }
}

// تابع برای تشخیص لینک فعال
const isActiveLink = (path) => {
    // برای صفحه اصلی، تطابق دقیق لازم است
    if (path === '/') {
        return route.path === '/'
    }
    // برای صفحات دیگر، تطابق با شروع مسیر کافی است
    return route.path.startsWith(path)
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <div class="header" :class="{ 'header-hidden': !isHeaderVisible }">
        <div class="header-box">
            <div class="header-content">
                <div class="right-box">
                    <router-link
                        v-for="item in navItems"
                        :key="item.name"
                        :to="item.path"
                        :class="{ 'active-link': isActiveLink(item.path) }"
                    >
                        {{ item.name }}
                    </router-link>
                </div>
                <div class="left-box">
                    <p class="title">
                        <a href="/">هل<span class="white">چین</span></a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* استایل اصلی هدر */
.header {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(219, 39, 119, 0.1);
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
    transform: translateY(0);
}

/* کلاس برای مخفی کردن هدر */
.header-hidden {
    transform: translateY(-100%);
}

.header-box {
    width: 75%;
    margin: 0 auto;
    padding: 0;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
}

/* استایل بخش راست (منو) */
.right-box {
    display: flex;
    align-items: center;
    gap: 30px;
}

.right-box a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    font-size: 16px;
    position: relative;
    transition: color 0.3s ease;
    padding-bottom: 8px; /* فضا برای خط زیر */
}

.right-box a:hover {
    color: #db2777;
}

/* استایل خط زیر لینک‌ها */
.right-box a::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 2px;
    background-color: #db2777;
    transition: width 0.3s ease;
}

.right-box a:hover::after {
    width: 100%;
}

/* استایل لینک فعال */
.right-box .active-link {
    color: #db2777;
    font-weight: 600;
}

.right-box .active-link::after {
    width: 100%;
}

/* استایل بخش چپ (جستجو) */
.left-box {
    display: flex;
    align-items: center;
}

.left-box form {
    display: flex;
    align-items: center;
}

.left-box form div {
    position: relative;
    display: flex;
    align-items: center;
}

#search-input {
    width: 250px;
    padding: 10px 40px 10px 15px;
    border: 1px solid rgba(219, 39, 119, 0.3);
    border-radius: 25px;
    outline: none;
    font-size: 14px;
    transition: all 0.3s ease;
    background-color: #fff;
}

#search-input:focus {
    width: 300px;
    border-color: #db2777;
    box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.1);
}

.left-box button {
    position: absolute;
    right: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.left-box button:hover {
    background-color: #fff0f6;
}

.left-box .title a{
    font-size: 2rem;
    text-decoration: none;
    color: #db2777;
    font-weight: bolder;
}
.white{
    color: black;
}

/* استایل ریسپانسیو */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 20px;
    }

    .right-box {
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
    }

    .right-box a {
        font-size: 14px;
    }

    #search-input {
        width: 200px;
    }
}

@media (max-width: 480px) {
    .right-box {
        flex-direction: column;
        gap: 10px;
    }

    #search-input {
        width: 150px;
    }
}
</style>