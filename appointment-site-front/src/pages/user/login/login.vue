<script setup>
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import api from "../../../api/auth.js";

const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const errorMessage = ref('');

const form = ref({
    username: '',
    password: '',
    remember: false
});


const handleLogin = async () => {
    // Reset error state
    errorMessage.value = '';
    isLoading.value = true;

    try {
        // Use Vuex action for login
        await store.dispatch('login', {
            username: form.value.username,
            password: form.value.password
        });

        // Successful login
        console.log('Login successful');





        const user = computed(() => store.getters.user);
        const isAuthenticated = computed(() => store.getters.isAuthenticated);

        console.log('Is authenticated:', isAuthenticated.value);
        console.log('Logged-in user:', user.value);





        // Redirect to dashboard or home page
        router.push('/');
    } catch (error) {
        if (error.response && error.response.status === 401) {
            errorMessage.value = 'نام کاربری یا رمز عبور اشتباه است';
        } else {
            errorMessage.value = 'خطا در اتصال به سرور. لطفاً دوباره تلاش کنید';
        }
        console.error('Login error:', error);
    } finally {
        isLoading.value = false;
    }
};

const socialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
    // For example: window.location.href = `/api/auth/${provider}`;
};
</script>

<template>
    <form @submit.prevent="handleLogin" class="login-form">
        <h2>ورود به حساب کاربری</h2>

        <div class="form-group">
            <label for="username">نام کاربری یا ایمیل</label>
            <input
                id="username"
                v-model="form.username"
                type="text"
                required
                placeholder="نام کاربری یا ایمیل خود را وارد کنید"
            />
        </div>

        <div class="form-group">
            <label for="password">رمز عبور</label>
            <input
                id="password"
                v-model="form.password"
                type="password"
                required
                placeholder="رمز عبور خود را وارد کنید"
            />
        </div>

        <div class="form-options">
            <label class="remember-me">
                <input type="checkbox" v-model="form.remember"/>
                مرا به خاطر بسپار
            </label>
            <a href="#" class="forgot-password">رمز عبور را فراموش کرده‌ام؟</a>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'در حال ورود...' : 'ورود' }}
        </button>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div class="divider">
            <span>یا ورود با</span>
        </div>

        <div class="social-login">
            <button type="button" class="social-btn google" @click="socialLogin('google')">
                <span>Google</span>
            </button>
            <button type="button" class="social-btn facebook" @click="socialLogin('facebook')">
                <span>Facebook</span>
            </button>
        </div>
    </form>
</template>


<style scoped>
.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

h2 {
    text-align: center;
    color: #ec4899;
    margin-bottom: 10px;
    font-size: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-weight: 500;
    color: #374151;
    font-size: 14px;
}

input {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
    background-color: #f9fafb;
}

input:focus {
    border-color: #000000;
    outline: none;
    background-color: white;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #4b5563;
    cursor: pointer;
}

.forgot-password {
    color: #1877f2;
    text-decoration: none;
}

.forgot-password:hover {
    text-decoration: underline;
}

.submit-btn {
    padding: 14px 16px;
    background-color: #ec4899;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
    background-color: #b30159;
}

.submit-btn:disabled {
    background-color: rgba(236, 72, 153, 0.68);
    cursor: not-allowed;
}

.error-message {
    color: #ef4444;
    font-size: 14px;
    text-align: center;
    padding: 10px;
    background-color: #fee2e2;
    border-radius: 6px;
    margin-top: -10px;
}

.divider {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #6b7280;
    font-size: 14px;
    margin: 5px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e5e7eb;
}

.social-login {
    display: flex;
    gap: 12px;
}

.social-btn {
    flex: 1;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
    font-weight: 500;
}

.social-btn:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

.google {
    color: #ea4335;
}

.facebook {
    color: #1877f2;
}
</style>