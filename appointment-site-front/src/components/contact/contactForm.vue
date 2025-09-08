<script setup>
import {ref} from "vue";
import api from "../../api/auth.js";

const full_name = ref('');
const email = ref('');
const phone = ref('');
const message = ref('');
const success = ref('');
const error = ref('');

let successTimeout = null;
let errorTimeout = null;

const resetForm = () => {
    full_name.value = '';
    email.value = '';
    phone.value = '';
    message.value = '';
};

const handleMessage = async () => {
    if (successTimeout) clearTimeout(successTimeout);
    if (errorTimeout) clearTimeout(errorTimeout);

    success.value = '';
    error.value = '';

    if (!full_name.value || !email.value || !phone.value || !message.value) {
        error.value = '❌ لطفاً تمام فیلدها را پر کنید.';
        errorTimeout = setTimeout(() => (error.value = ''), 5000);
        return;
    }

    try {
        await api.post('/contactUs/communication/with/us/', {
            full_name: full_name.value,
            email: email.value,
            phone: phone.value,
            message: message.value
        });

        success.value = '✅ پیام شما با موفقیت ارسال شد.';
        resetForm();

        successTimeout = setTimeout(() => (success.value = ''), 5000);
    } catch (err) {
        error.value = '❌ ارسال پیام با خطا مواجه شد.';
        console.error(err);
        errorTimeout = setTimeout(() => (error.value = ''), 5000);
    }
};
</script>

<template>
    <div class="form">
        <div class="form-box">
            <form @submit.prevent="handleMessage">
                <!-- ردیف سه فیلد اول -->
                <div class="row-inputs">
                    <div class="text-input">
                        <label for="full_name">نام و نام خانوادگی*</label>
                        <input type="text" id="full_name" v-model="full_name" required/>
                    </div>

                    <div class="text-input">
                        <label for="email">ایمیل*</label>
                        <input type="email" id="email" v-model="email" required/>
                    </div>

                    <div class="text-input">
                        <label for="phone">شماره تماس*</label>
                        <input type="text" id="phone" v-model="phone" required/>
                    </div>
                </div>

                <!-- پیام زیر -->
                <div class="text-input message-input">
                    <label for="message">پیام*</label>
                    <textarea rows="10" cols="50" id="message" v-model="message" required></textarea>
                </div>

                <div class="text-input">
                    <button type="submit">ارسال پیام</button>
                </div>

                <p v-if="success" style="color: green">{{ success }}</p>
                <p v-if="error" style="color: red">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<style scoped>
.form {
    padding: 2rem 0;
}

.form-box {
    width: 60%;
    padding: 2rem 0;
}

.row-inputs {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}

.text-input {
    margin-bottom: 1rem;
    flex: 1;
    min-width: 200px;
}

.text-input label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.text-input input,
.text-input textarea {
    width: 100%;
    font-size: 1.1rem;
    padding: .7rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}
.text-input input:focus, .text-input textarea:focus {
  outline: none;
  border: 1px solid #535252;
}
.text-input textarea{
    height: 290px;
}


.message-input {
    width: 100%;
}

.text-input button {
    background-color: #535252;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
    max-width: 200px;
    display: block;
    transition: background-color .3s;
}

.text-input button:hover {
    background-color: #222222;
}

@media (max-width: 768px) {
    .row-inputs {
        flex-direction: column;
    }
}
</style>

