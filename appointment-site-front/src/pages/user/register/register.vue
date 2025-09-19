<script setup>
import {ref, reactive} from 'vue';
import {useRouter} from 'vue-router';
import api from "../../../api/auth.js";

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const imagePreview = ref(null);

const form = reactive({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: 'CUSTOMER',
    image: null
});

const errors = reactive({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: ''
});

const validateForm = () => {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach(key => errors[key] = '');

    // Username validation
    if (!form.username) {
        errors.username = 'نام کاربری الزامی است';
        isValid = false;
    } else if (form.username.length < 3) {
        errors.username = 'نام کاربری باید حداقل 3 کاراکتر باشد';
        isValid = false;
    }

    // Email validation
    if (!form.email) {
        errors.email = 'ایمیل الزامی است';
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        errors.email = 'ایمیل معتبر نیست';
        isValid = false;
    }

    // Phone number validation
    if (form.phone_number && !/^\d{11}$/.test(form.phone_number)) {
        errors.phone_number = 'شماره تلفن باید 11 رقمی باشد';
        isValid = false;
    }

    // Password validation
    if (!form.password) {
        errors.password = 'رمز عبور الزامی است';
        isValid = false;
    } else if (form.password.length < 8) {
        errors.password = 'رمز عبور باید حداقل 8 کاراکتر باشد';
        isValid = false;
    }

    // Confirm password validation
    if (!form.confirm_password) {
        errors.confirm_password = 'تکرار رمز عبور الزامی است';
        isValid = false;
    } else if (form.password !== form.confirm_password) {
        errors.confirm_password = 'رمز عبور و تکرار آن مطابقت ندارند';
        isValid = false;
    }

    return isValid;
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.image = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const handleRegister = async () => {
    if (!validateForm()) {
        return;
    }

    // Reset messages
    errorMessage.value = '';
    successMessage.value = '';
    isLoading.value = true;

    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('email', form.email);
        formData.append('password', form.password);
        formData.append('confirm_password', form.confirm_password);

        if (form.phone_number) {
            formData.append('phone_number', form.phone_number);
        }

        if (form.image) {
            formData.append('image', form.image);
        }

        // Send request to backend
        const response = await api.post('accounts/users/register/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Handle successful registration
        successMessage.value = 'ثبت‌نام با موفقیت انجام شد. در حال انتقال به صفحه ورود...';

        // Reset form
        Object.keys(form).forEach(key => {
            if (key === 'role') {
                form[key] = 'CUSTOMER';
            } else {
                form[key] = '';
            }
        });
        imagePreview.value = null;

        // Redirect to login page after successful registration
        setTimeout(() => {
            router.push({ path: '/user', query: { tab: 'login' } });
        }, 2000);

    } catch (error) {
        if (error.response) {
            // Backend validation errors
            const backendErrors = error.response.data;

            if (backendErrors.username) {
                errors.username = backendErrors.username[0];
            }
            if (backendErrors.email) {
                errors.email = backendErrors.email[0];
            }
            if (backendErrors.phone_number) {
                errors.phone_number = backendErrors.phone_number[0];
            }
            if (backendErrors.password) {
                errors.password = backendErrors.password[0];
            }
            if (backendErrors.role) {
                errors.role = backendErrors.role[0];
            }
            console.log("ثبت‌نام خطا:", error.response.data);
            errorMessage.value = 'خطا در ثبت‌نام. لطفاً اطلاعات را بررسی کنید.';
        } else {
            errorMessage.value = 'خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <form @submit.prevent="handleRegister" class="register-form">
        <h2>ایجاد حساب کاربری</h2>

        <div class="form-group">
            <label for="username">نام کاربری</label>
            <input
                id="username"
                v-model="form.username"
                type="text"
                required
                placeholder="نام کاربری خود را وارد کنید"
            />
            <span class="error-text" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <div class="form-group">
            <label for="email">ایمیل</label>
            <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="example@email.com"
            />
            <span class="error-text" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
            <label for="phone_number">شماره تلفن (اختیاری)</label>
            <input
                id="phone_number"
                v-model="form.phone_number"
                type="tel"
                pattern="\d{11}"
                placeholder="09123456789"
            />
            <span class="error-text" v-if="errors.phone_number">{{ errors.phone_number }}</span>
            <small>شماره تلفن باید 11 رقمی باشد</small>
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
            <span class="error-text" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-group">
            <label for="confirm_password">تکرار رمز عبور</label>
            <input
                id="confirm_password"
                v-model="form.confirm_password"
                type="password"
                required
                placeholder="رمز عبور را تکرار کنید"
            />
            <span class="error-text" v-if="errors.confirm_password">{{ errors.confirm_password }}</span>
        </div>

        <div class="form-group">
            <label for="image">تصویر پروفایل (اختیاری)</label>
            <input
                id="image"
                type="file"
                @change="handleImageUpload"
                accept="image/*"
            />
            <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Preview"/>
            </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'در حال ثبت‌نام...' : 'ثبت نام' }}
        </button>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
            {{ successMessage }}
        </div>
    </form>
</template>

<style scoped>
.register-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    background-color: #fff;
    padding: 24px;
    border-radius: 12px;
}

h2 {
    text-align: center;
    color: #ec4899;
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 600;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    font-weight: 600;
    color: #000000;
    font-size: 14px;
}

input, select {
    padding: 12px 16px;
    border: 1px solid #cfcdce;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
}

input:focus, select:focus {
    border-color: #191818;
    outline: none;
    background-color: white;
}

.error-text {
    color: #e11d48;
    font-size: 12px;
    margin-top: 2px;
}

small {
    color: #040303;
    font-size: 12px;
}

.role-select {
    cursor: pointer;
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
    transition: all 0.3s ease;
    margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
    background-color: #db2777;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
}

.submit-btn:disabled {
    background-color: #f9a8d4;
    cursor: not-allowed;
}

.error-message {
    color: #e11d48;
    font-size: 14px;
    text-align: center;
    padding: 10px;
    background-color: #fee2e2;
    border-radius: 6px;
    margin-top: 5px;
    border: 1px solid #fecaca;
}

.success-message {
    color: #065f46;
    font-size: 14px;
    text-align: center;
    padding: 10px;
    background-color: #d1fae5;
    border-radius: 6px;
    margin-top: 5px;
    border: 1px solid #a7f3d0;
}

.image-preview {
    margin-top: 10px;
    border-radius: 8px;
    overflow: hidden;
    max-width: 200px;
    border: 2px solid #fbcfe8;
}

.image-preview img {
    width: 100%;
    height: auto;
    display: block;
}
</style>