<script setup>
import {nextTick, onMounted, ref} from 'vue';
import Location from "../../components/contact/location.vue";
import CommunicationWithUsForm from "../../components/contact/contactForm.vue";
import api from "../../api/auth.js";

const contacts = ref([]);
const isLoading = ref(true);
const showSuccess = ref(false);
const animationReady = ref(false);
const mainBranchContact = ref(null);
const mainBranchSocialLinks = ref([]);

// دریافت اطلاعات تماس از API
async function getContacts() {
    try {
        isLoading.value = true;
        const response = await api.get("/contactUs/contacts/");

        // مرتب‌سازی شعب: ابتدا شعبه اصلی، سپس سایر شعب
        const sortedContacts = [...response.data].sort((a, b) => {
            // شعبه اصلی همیشه در اولویت اول
            if (a.name === 'Head Office') return -1;
            if (b.name === 'Head Office') return 1;
            // سایر شعب بر اساس نام مرتب می‌شوند
            return a.name.localeCompare(b.name);
        });

        contacts.value = sortedContacts;

        // پیدا کردن شعبه اصلی
        const mainBranch = sortedContacts.find(
            contact => contact.name === 'Head Office' || contact.name === 'شعبه اصلی'
        );

        if (mainBranch) {
            mainBranchContact.value = mainBranch;
            // بعد از گرفتن اطلاعات تماس، لینک‌های اجتماعی رو بخوان
            await getSocialLinks(mainBranch.id);
        }

        console.log("Contacts:", contacts.value);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات تماس:", error);
    } finally {
        isLoading.value = false;
        // اطمینان از اینکه انیمیشن‌ها پس از بارگذاری داده‌ها فعال می‌شوند
        nextTick(() => {
            animationReady.value = true;
            setupAnimations();
        });
    }
}

// تبدیل نام شعبه به فارسی
function getBranchName(name) {
    switch (name) {
        case 'Head Office':
            return 'شعبه اصلی';
        case 'Other Branches':
            return 'سایر شعبه ها';
        default:
            return name;
    }
}

// مدیریت رویداد ارسال فرم
function handleFormSubmit() {
    showSuccess.value = true;
    // مخفی کردن پیام موفقیت بعد از 5 ثانیه
    setTimeout(() => {
        showSuccess.value = false;
    }, 5000);
}

// تنظیم انیمیشن‌ها
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
            }
        });
    }, observerOptions);
    // اطمینان از اینکه المان‌ها وجود دارند
    setTimeout(() => {
        document.querySelectorAll('.info-card, .contact-form-container, .contact-info-container').forEach(el => {
            observer.observe(el);
        });
    }, 100);
}

const socialMediaIcons = {
    'telegram': ['fab', 'telegram'],
    'تلگرام': ['fab', 'telegram'],
    'facebook': ['fab', 'facebook'],
    'فیس‌بوک': ['fab', 'facebook'],
    'whatsapp': ['fab', 'whatsapp'],
    'واتس‌اپ': ['fab', 'whatsapp'],
    'instagram': ['fab', 'instagram'],
    'اینستاگرام': ['fab', 'instagram'],
    'twitter': ['fab', 'twitter'],
    'توییتر': ['fab', 'twitter']
};

async function getSocialLinks(contactId) {
    try {
        const response = await api.get(`contactUs/contacts/${contactId}/get_social_links/`);
        mainBranchSocialLinks.value = response.data.filter(
            link => link.contact === contactId
        );
    } catch (error) {
        console.error("خطا در دریافت لینک‌های اجتماعی", error);
    }
}

function getSocialIcon(name) {
    const normalizedName = name.toLowerCase().trim();
    return socialMediaIcons[normalizedName] || ['fas', 'envelope'];
}

onMounted(() => {
    getContacts();
});
</script>

<template>
    <div class="contact-page">
        <!-- Hero Section -->
        <section class="contact-hero">
            <div class="hero-overlay">
                <div class="container">
                    <h1>با ما در ارتباط باشید</h1>
                    <p>سوالات خود را بپرسید یا وقت ملاقات رزرو کنید</p>
                </div>
            </div>
        </section>

        <!-- Contact Form & Info Section -->
        <section class="contact-section">
            <div class="container">
                <div class="contact-grid">
                    <!-- Contact Form Component -->
                    <div class="contact-form-container" :class="{ 'animate-in': animationReady }">
                        <h2>ارسال پیام</h2>
                        <CommunicationWithUsForm @form-submitted="handleFormSubmit"/>
                    </div>

                    <!-- Contact Info -->
                    <div class="contact-info-container" :class="{ 'animate-in': animationReady }">
                        <h2>اطلاعات تماس</h2>

                        <!-- Loading State -->
                        <div v-if="isLoading" class="loading-container">
                            <div class="spinner"></div>
                            <p>در حال بارگذاری اطلاعات...</p>
                        </div>

                        <!-- Contact Info Cards -->
                        <div v-else-if="contacts.length > 0" class="info-cards">
                            <div v-for="contact in contacts" :key="contact.id" class="info-card"
                                 :class="{ 'animate-in': animationReady }">
                                <div class="card-header">
                                    <div class="branch-logo" v-if="contact.logo">
                                        <img :src="contact.logo" :alt="contact.name">
                                    </div>
                                    <div class="branch-title">
                                        <h3>{{ getBranchName(contact.name) }}</h3>
                                        <p v-if="contact.description" class="branch-description">{{
                                                contact.description
                                            }}</p>
                                    </div>
                                </div>
                                <div class="info-items">
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <font-awesome-icon class="icon" :icon="['fas', 'phone']"/>
                                        </div>
                                        <div class="info-text">
                                            <h4>تلفن</h4>
                                            <p>{{ contact.phone || 'شماره تلفن موجود نیست' }}</p>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <font-awesome-icon class="icon" :icon="['fas', 'envelope']"/>
                                        </div>
                                        <div class="info-text">
                                            <h4>ایمیل</h4>
                                            <p>{{ contact.email || 'ایمیل موجود نیست' }}</p>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <font-awesome-icon class="icon" :icon="['fas', 'map-marker-alt']"/>
                                        </div>
                                        <div class="info-text">
                                            <h4>آدرس</h4>
                                            <p>{{ contact.address || 'آدرس موجود نیست' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- No Contacts State -->
                        <div v-else class="no-contacts">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>اطلاعات تماسی یافت نشد</p>
                        </div>

                        <!-- Social Media -->
                        <div class="social-media">
                            <h3>ما را در شبکه‌های اجتماعی دنبال کنید</h3>
                            <div class="social-icons">
                                <a v-for="link in mainBranchSocialLinks"
                                   :key="link.id"
                                   :href="link.url"
                                   target="_blank"
                                   class="social-icon">
                                    <font-awesome-icon :icon="getSocialIcon(link.name)"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Map Section with Location Component -->
        <section class="map-section">
            <div class="container">
                <div class="map-header">
                    <h2>موقعیت مکانی ما</h2>
                    <p>برای مشاهده آدرس دقیق و مسیریابی، نقشه زیر را بررسی کنید</p>
                </div>
                <div class="map-container">
                    <Location/>
                </div>
            </div>
        </section>

        <!-- Success Message -->
        <div v-if="showSuccess" class="success-message show">
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>پیام شما با موفقیت ارسال شد!</h3>
                <p>به زودی با شما تماس خواهیم گرفت</p>
                <button @click="showSuccess = false" class="btn-close">بستن</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* استایل اصلی */
.contact-page {
    font-family: 'Montserrat', sans-serif;
    color: #555555;
    line-height: 1.6;
    background-color: #ffffff;
    overflow-x: hidden;
}

/* Hero Section */
.contact-hero {
    position: relative;
    height: 50vh;
    background: linear-gradient(rgba(253, 192, 224, 0.56), rgba(248, 16, 93, 0.6)),
    url('../../assets/images/photo-1522383225653-ed111181a951.jpg') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #ffffff;
}

.container {
    width: 75% !important;
    margin: 0 auto;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
}

.contact-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    margin-bottom: 1rem;
    color: #ffffff;
    animation: fadeInDown 1s ease;
}

.contact-hero p {
    font-size: 1.3rem;
    max-width: 700px;
    animation: fadeInUp 1s ease 0.3s;
    animation-fill-mode: both;
}

/* Contact Section */
.contact-section {
    padding: 100px 0;
    background: linear-gradient(135deg, #ffccdd 0%, #ffffff 100%);
}

.contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
}

/* Contact Form */
.contact-form-container {
    background: #ffffff;
    border-radius: 15px;
    padding: 40px;
    box-shadow: 0 15px 30px rgba(255, 105, 180, 0.15);
    border: 1px solid #ffccdd;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.contact-form-container.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.contact-form-container h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    margin-bottom: 30px;
    color: #333333;
    position: relative;
    padding-bottom: 15px;
}

.contact-form-container h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60px;
    height: 3px;
    background-color: #ff69b4;
}

/* Contact Info */
.contact-info-container {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.contact-info-container.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.contact-info-container h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    margin-bottom: 30px;
    color: #333333;
    position: relative;
    padding-bottom: 15px;
}

.contact-info-container h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60px;
    height: 3px;
    background-color: #ff69b4;
}

/* Loading State */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #555555;
}

.loading-container .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 105, 180, 0.2);
    border-radius: 50%;
    border-top-color: #ff69b4;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 15px;
}

.loading-container p {
    font-size: 1rem;
    color: #555555;
}

/* No Contacts State */
.no-contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #555555;
}

.no-contacts i {
    font-size: 3rem;
    color: #e91e63;
    margin-bottom: 15px;
}

.no-contacts p {
    font-size: 1.1rem;
    color: #555555;
}

/* Info Cards */
.info-cards {
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin-bottom: 40px;
}

.info-card {
    background: #ffffff;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 8px 20px rgba(255, 105, 180, 0.1);
    transition: all 0.4s ease;
    opacity: 0;
    transform: translateY(20px);
}

.info-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(255, 105, 180, 0.2);
}

/* Card Header */
.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ffccdd;
}

.branch-logo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 20px;
    flex-shrink: 0;
    border: 2px solid #ffccdd;
}

.branch-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.branch-title h3 {
    font-size: 1.4rem;
    color: #333333;
    margin: 0 0 5px;
}

.branch-description {
    font-size: 0.9rem;
    color: #555555;
    margin: 0;
    line-height: 1.4;
}

/* Info Items */
.info-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.info-item {
    display: flex;
    align-items: flex-start;
}

.info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #ff69b4 0%, #e91e63 100%);
    border-radius: 50%;
    margin-left: 15px;
    flex-shrink: 0;
}
.icon{
    color: white;
}

.info-icon i {
    font-size: 1.2rem;
    color: #ffffff;
}

.info-text h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 5px;
    color: #333333;
}

.info-text p {
    margin: 0;
    color: #555555;
    font-size: 0.95rem;
    line-height: 1.5;
}

/* Social Media */
.social-media {
    background: #ffffff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(255, 105, 180, 0.1);
    text-align: center;
}

.social-media h3 {
    font-size: 1.3rem;
    margin-bottom: 20px;
    color: #333333;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ff69b4 0%, #e91e63 100%);
    border-radius: 50%;
    color: #ffffff;
    font-size: 1.5rem;
    transition: all 0.4s ease;
    text-decoration: none;
}

.social-icon:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 10px 20px rgba(255, 105, 180, 0.3);
}

/* Map Section */
.map-section {
    padding: 80px 0;
    background-color: #ffffff;
}

.map-header {
    text-align: center;
    margin-bottom: 40px;
}

.map-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: #333333;
    margin-bottom: 15px;
    position: relative;
    display: inline-block;
}

.map-header h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: #ff69b4;
}

.map-header p {
    font-size: 1.1rem;
    color: #555555;
    max-width: 600px;
    margin: 20px auto 0;
}

.map-container {
    background: #ffffff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(255, 105, 180, 0.15);
    border: 1px solid #ffccdd;
    height: 450px;
}

/* Success Message */
.success-message {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.success-message.show {
    opacity: 1;
    visibility: visible;
}

.success-content {
    background: #ffffff;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

.success-message.show .success-content {
    transform: scale(1);
}

.success-content i {
    font-size: 4rem;
    color: #4caf50;
    margin-bottom: 20px;
}

.success-content h3 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: #333333;
}

.success-content p {
    margin-bottom: 25px;
    color: #555555;
}

.btn-close {
    padding: 12px 30px;
    background: linear-gradient(135deg, #ff69b4 0%, #e91e63 100%);
    color: #ffffff;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s ease;
}

.btn-close:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(255, 105, 180, 0.3);
}

/* Animations */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 992px) {
    .contact-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .contact-hero h1 {
        font-size: 2.8rem;
    }

    .contact-hero p {
        font-size: 1.1rem;
    }

    .contact-form-container,
    .contact-info-container {
        padding: 30px 20px;
    }

    .map-header h2 {
        font-size: 2rem;
    }

    .card-header {
        flex-direction: column;
        text-align: center;
    }

    .branch-logo {
        margin: 0 0 15px;
    }
}

@media (max-width: 576px) {
    .contact-hero {
        height: 40vh;
    }

    .contact-hero h1 {
        font-size: 2.2rem;
    }

    .contact-section {
        padding: 70px 0;
    }

    .map-section {
        padding: 50px 0;
    }

    .map-container {
        height: 350px;
    }

    .social-icons {
        gap: 15px;
    }

    .social-icon {
        width: 45px;
        height: 45px;
        font-size: 1.3rem;
    }
}
</style>