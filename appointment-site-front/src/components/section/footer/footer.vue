<script setup>
import {ref, onMounted} from "vue";
import api from "../../../api/auth.js";

const mainBranchContact = ref(null);
const mainBranchSocialLinks = ref([]);

// Map social media names to their icon names (already added in main.js)
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

async function getContactInfo() {
    try {
        const response = await api.get("contactUs/contacts/");
        // Filter for main branch (Head Office or شعبه اصلی)
        const mainBranch = response.data.find(
            contact => contact.name === 'Head Office' || contact.name === 'شعبه اصلی'
        );
        if (mainBranch) {
            mainBranchContact.value = mainBranch;
            // بعد از گرفتن اطلاعات تماس، لینک‌های اجتماعی رو بخون
            await getSocialLinks(mainBranch.id);
        }
    } catch (error) {
        console.error("خطا در دریافت اطلاعات تماس", error);
    }
}

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

// Function to get the appropriate icon for social media
function getSocialIcon(name) {
    const normalizedName = name.toLowerCase().trim();
    return socialMediaIcons[normalizedName] || ['fas', 'envelope'];
}

onMounted(async () => {
    await getContactInfo();
});
</script>


<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <!-- بخش اطلاعات تماس (شعبه اصلی) -->
                <div class="footer-section">
                    <h3>تماس با ما</h3>
                    <div v-if="mainBranchContact">
                        <ul class="contact-info">
                            <li v-if="mainBranchContact.phone">
                                <font-awesome-icon :icon="['fas', 'phone']"/>
                                <span>{{ mainBranchContact.phone }}</span>
                            </li>
                            <li v-if="mainBranchContact.email">
                                <font-awesome-icon :icon="['fas', 'envelope']"/>
                                <span>{{ mainBranchContact.email }}</span>
                            </li>
                            <li v-if="mainBranchContact.address">
                                <font-awesome-icon :icon="['fas', 'map-marker-alt']"/>
                                <span>{{ mainBranchContact.address }}</span>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <p>در حال بارگذاری اطلاعات تماس...</p>
                    </div>
                </div>

                <!-- بخش لینک‌های سریع -->
                <div class="footer-section">
                    <h3>لینک‌های سریع</h3>
                    <ul class="footer-links">
                        <li><a href="/">صفحه اصلی</a></li>
                        <li><a href="/services">خدمات ما</a></li>
                        <li><a href="/contact">ارتباط با ما</a></li>
                        <li><a href="/about">درباره ما</a></li>
                        <li><a href="/booking">نوبت دهی آنلاین</a></li>
                        <li><a href="/login">ورود/ثبت نام</a></li>
                    </ul>
                </div>


                <!-- بخش شبکه‌های اجتماعی -->
                <div class="footer-section">
                    <h3>شبکه‌های اجتماعی</h3>
                    <div v-if="mainBranchSocialLinks.length > 0" class="social-links">
                        <a
                            v-for="link in mainBranchSocialLinks"
                            :key="link.id"
                            :href="link.url"
                            :title="link.name"
                            target="_blank"
                        >
                            <font-awesome-icon
                                v-if="!link.icon"
                                :icon="getSocialIcon(link.name)"
                            />
                            <img
                                v-else
                                :src="link.icon"
                                :alt="link.name"
                                class="social-icon-img"
                            />
                        </a>
                    </div>
                    <p v-else>لینک‌های اجتماعی در حال بارگذاری...</p>
                </div>

                <!-- بخش لوگو -->
                <div class="footer-section">
                    <div v-if="mainBranchContact" class="logo-section">
                        <div v-if="mainBranchContact.logo" class="main-logo">
                            <img :src="mainBranchContact.logo" alt="لوگو اصلی">
                        </div>
                    </div>
                    <div v-else>
                        <p>در حال بارگذاری لوگو...</p>
                    </div>
                </div>
            </div>

            <!-- بخش پایانی فوتر -->
            <div class="footer-bottom">
                <p>© 2023 آرایشگاه زنانه زیبایی شما. تمامی حقوق محفوظ است.</p>
                <p>طراحی شده با
                    <font-awesome-icon :icon="['fas', 'heart']" style="color: #d63384;"/>
                    توسط تیم طراحی LoukWeb
                </p>
                <div class="payment-methods">
                    <font-awesome-icon :icon="['fab', 'cc-visa']" title="ویزا"/>
                    <font-awesome-icon :icon="['fab', 'cc-mastercard']" title="مسترکارت"/>
                    <font-awesome-icon :icon="['fas', 'money-bill-wave']" title="پرداخت نقدی"/>
                    <font-awesome-icon :icon="['fas', 'mobile-alt']" title="پرداخت همراه"/>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    border-top: 1px solid #f8d7e0;
    padding: 60px 0 20px;
    position: relative;
    overflow: hidden;

}

.footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #ff9eb5, #f8d7e0, #ff9eb5);
}

.container {
    width: 75%;
    margin: 0 auto;
    padding: 0;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
}

.footer-section h3 {
    color: #d63384;
    font-size: 20px;
    margin-bottom: 25px;
    position: relative;
    padding-bottom: 15px;
}

.footer-section h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(90deg, #d63384, #f8d7e0);
}

/* استایل‌های بخش تماس با ما */
.contact-info {
    list-style: none;
}

.contact-info li {
    display: flex;
    color: #6c757d;
    align-items: center;
    margin-bottom: 15px;
    transition: transform 0.3s;
}

.contact-info li:hover {
    transform: translateX(5px);
}

.contact-info svg {
    color: #ff9eb5;
    font-size: 18px;
    margin-left: 15px;
    width: 25px;
    text-align: center;
}

/* استایل‌های بخش لینک‌ها */
.footer-links {
    list-style: none;
}

.footer-links li {
    margin-bottom: 12px;
}

.footer-links a {
    color: #6c757d;
    text-decoration: none;
    display: inline-block;
    position: relative;
    transition: all 0.3s;
    padding-right: 0;
}

.footer-links a::before {
    content: '›';
    position: absolute;
    right: -15px;
    top: 0;
    color: #ff9eb5;
    opacity: 0;
    transition: all 0.3s;
}

.footer-links a:hover {
    color: #d63384;
    padding-right: 15px;
}

.footer-links a:hover::before {
    opacity: 1;
    right: 0;
}

/* استایل‌های بخش لوگو */
.logo-section {
    text-align: center;
}

.main-logo {
    margin-bottom: 25px;
}

.main-logo img {
    max-width: 180px;
    height: auto;
    border-radius: 15px;
    transition: transform 0.3s;
}

.main-logo img:hover {
    transform: scale(1.05);
}

/* استایل‌های بخش شبکه‌های اجتماعی */
.social-links {
    display: flex;
    justify-content: start;
    gap: 15px;
    margin-top: 20px;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ff9eb5, #f8d7e0);
    color: white;
    border-radius: 50%;
    font-size: 20px;
    transition: all 0.3s;
    box-shadow: 0 4px 10px rgba(255, 158, 181, 0.3);
    overflow: hidden;
}

.social-links a:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(255, 158, 181, 0.4);
    background: linear-gradient(135deg, #d63384, #ff9eb5);
}

.social-links svg {
    font-size: 22px;
}

.social-icon-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

/* استایل‌های بخش پایانی */
.footer-bottom {
    border-top: 1px solid #f8d7e0;
    padding-top: 20px;
    text-align: center;
    color: #6c757d;
    font-size: 14px;
}

.footer-bottom p {
    margin-bottom: 10px;
}

.payment-methods {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
}

.payment-methods svg {
    font-size: 24px;
    color: #adb5bd;
    transition: all 0.3s;
}

.payment-methods svg:hover {
    color: #d63384;
    transform: scale(1.2);
}

/* ریسپانسیو */
@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .social-links {
        justify-content: center;
    }

    .main-logo img {
        max-width: 150px;
    }
}
</style>