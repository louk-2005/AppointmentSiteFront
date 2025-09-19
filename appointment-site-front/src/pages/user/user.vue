<script setup>
import {ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Login from "./login/login.vue";
import Register from "./register/register.vue";

const route = useRoute();
const router = useRouter();

const activeTab = ref(route.query.tab || 'login'); // مقدار اولیه از URL یا لاگین

// تابع برای تغییر تب و به‌روزرسانی URL
const switchTab = (tab) => {
    activeTab.value = tab;
    router.push({query: {tab}});
};

// واکنش به تغییرات URL
watch(() => route.query.tab, (newTab) => {
    if (newTab && (newTab === 'login' || newTab === 'register')) {
        activeTab.value = newTab;
    }
});
</script>

<template>
    <div class="user">
        <div class="user-box">
            <!-- Tab Navigation -->
            <div class="tabs">
                <button
                    @click="switchTab('login')"
                    :class="{ active: activeTab === 'login' }"
                >
                    ورود
                </button>
                <button
                    @click="switchTab('register')"
                    :class="{ active: activeTab === 'register' }"
                >
                    ثبت نام
                </button>
            </div>

            <!-- Form Container -->
            <div class="user-content">
                <!-- Login Form -->
                <div v-if="activeTab === 'login'" class="form-container">
                    <Login/>
                </div>

                <!-- Register Form -->
                <div v-if="activeTab === 'register'" class="form-container">
                    <Register/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 100px 20px 100px 20px;
    font-family: 'Vazirmatn', sans-serif;
    direction: rtl;
}

.user-box {
    width: 100%;
    max-width: 450px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
}

.tabs button {
    flex: 1;
    padding: 16px 20px;
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
}

.tabs button.active {
    color: #ec4899;
}

.tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #ec4899;
    border-radius: 3px 3px 0 0;
}

.tabs button:hover {
    color: #ba015c;
    background-color: #f9fafb;
}

.user-content {
    padding: 30px;
}

.form-container {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>