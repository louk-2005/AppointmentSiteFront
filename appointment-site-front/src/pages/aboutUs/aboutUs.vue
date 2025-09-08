<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // انیمیشن برای کارت‌ها و ویژگی‌ها
  const animateElements = () => {
    const elements = document.querySelectorAll('.exp-card, .feature');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100); // تاخیر متوالی برای انیمیشن
        }
      });
    }, {
      threshold: 0.1
    });

    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  };

  // انیمیشن برای بخش درباره ما
  const animateAboutSection = () => {
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, {
      threshold: 0.2
    });

    if (aboutText) {
      aboutText.style.opacity = '0';
      aboutText.style.transform = 'translateX(-50px)';
      aboutText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      aboutObserver.observe(aboutText);
    }

    if (aboutImage) {
      aboutImage.style.opacity = '0';
      aboutImage.style.transform = 'translateX(50px)';
      aboutImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      aboutObserver.observe(aboutImage);
    }
  };

  // انیمیشن برای بخش CTA
  const animateCtaSection = () => {
    const ctaSection = document.querySelector('.cta');

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1)';
        }
      });
    }, {
      threshold: 0.3
    });

    if (ctaSection) {
      ctaSection.style.opacity = '0';
      ctaSection.style.transform = 'scale(0.95)';
      ctaSection.style.transition = 'opacity 1s ease, transform 1s ease';
      ctaObserver.observe(ctaSection);
    }
  };

  // انیمیشن برای آیکون‌ها
  const animateIcons = () => {
    const icons = document.querySelectorAll('.exp-icon, .feature-icon');

    icons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2) rotate(10deg)';
        icon.style.transition = 'transform 0.3s ease';
      });

      icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  };

  // انیمیشن برای دکمه‌ها
  const animateButtons = () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px) scale(1.05)';
        button.style.boxShadow = '0 15px 30px rgba(255, 105, 180, 0.4)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '0 10px 20px rgba(255, 105, 180, 0.3)';
      });
    });
  };

  // اجرای تمام انیمیشن‌ها
  animateElements();
  animateAboutSection();
  animateCtaSection();
  animateIcons();
  animateButtons();
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>زیبایی شما، داستان ماست</h1>
        <p>در هلچین، ما با بیش از یک دهه تجربه، هنر زیبایی را با تخصص و نوآوری ترکیب کرده‌ایم تا تجربه‌ای بی‌نظیر برای شما خلق کنیم.</p>
        <a href="/booking" class="btn">رزرو کنید</a>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>درباره هلچین</h2>
            <p>به دنیای هلچین خوش آمدید! ما فقط یک سالن زیبایی نیستیم؛ ما مکانی برای خلق تجربه‌های منحصر به فرد زیبایی و آرامش هستیم. با بیش از یک دهه سابقه‌ی درخشان، هلچین به عنوان یک پیشرو در صنعت زیبایی زنانه، تعهد خود را به تخصص، نوآوری و رضایت بی‌چون‌وچرای شما تثبیت کرده است.</p>
            <p>در هلچین، زیبایی را یک استاندارد یکسان نمی‌دانیم؛ بلکه هنری شخصی می‌بینیم که باید با هویت، سلیقه و روحیه‌ی شما هماهنگ باشد. تیم ما از آرایشگران و متخصصان زیبایی نخبه تشکیل شده که نه تنها مهارت‌های فنی خود را در بالاترین سطح حفظ می‌کنند، بلکه دائماً در جستجوی به‌روزترین متدها و تکنیک‌های روز دنیا هستند.</p>
          </div>
          <div class="about-image">
            <img src="../../assets/images/لوازم-مورد-نیاز-برای-آرایشگاه-زنانه.jpg" alt="سالن زیبایی هلچین">
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="experience">
      <div class="container">
        <h2>تجربه‌ی هلچین</h2>
        <div class="experience-grid">
          <div class="exp-card">
            <div class="exp-icon">
              <i class="fas fa-cut"></i>
            </div>
            <h3>تخصص بی‌چون‌وچرا</h3>
            <p>هر عضو تیم هلچین در حوزه‌ی تخصصی خود آموزش‌دیده و دارای گواهینامه‌های معتبر است. ما به جزئیات اهمیت می‌دهیم و نتیجه‌ای بی‌نقص و متناسب با انتظارات شما را تضمین می‌کنیم.</p>
          </div>
          <div class="exp-card">
            <div class="exp-icon">
              <i class="fas fa-magic"></i>
            </div>
            <h3>تکنولوژی و مواد درجه یک</h3>
            <p>ما معتقدیم بهترین نتیجه، حاصل بهترین ابزارهاست. در هلچین از پیشرفته‌ترین تجهیزات آرایشی و زیبایی و مواد اولیه‌ی اورجینال، مرغوب و ایمن استفاده می‌کنیم.</p>
          </div>
          <div class="exp-card">
            <div class="exp-icon">
              <i class="fas fa-spa"></i>
            </div>
            <h3>فضایی الهام‌بخش و آرامش‌بخش</h3>
            <p>محیط هلچین با طراحی مدرن، شیک و دلنشین خود، فضایی است که استرس‌های روزمره را فراموش می‌کنید. اینجا پناهگاهی برای خودتان است.</p>
          </div>
          <div class="exp-card">
            <div class="exp-icon">
              <i class="fas fa-comments"></i>
            </div>
            <h3>مشاوره‌ی تخصصی و شخصی‌سازی شده</h3>
            <p>ما قبل از هر خدماتی، گوش شنوای شما هستیم. مشاوره‌ی دقیق و صادقانه‌ی متخصصان هلچین، تضمین می‌کند که خدماتی دریافت می‌کنید که بهترین انتخاب برای شماست.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-choose">
      <div class="container">
        <h2>چرا هلچین را انتخاب کنید؟</h2>
        <div class="features">
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-award"></i>
            </div>
            <div class="feature-content">
              <h4>سابقه‌ای درخشان</h4>
              <p>بیش از ۱۰ سال همراهی و جلب رضایت مشتریان وفادار</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="feature-content">
              <h4>تیم حرفه‌ای و خلاق</h4>
              <p>آرایشگرانی که همواره در حال یادگیری و ارائه‌ی ایده‌های نو هستند</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-gem"></i>
            </div>
            <div class="feature-content">
              <h4>کیفیت بی‌رقابت</h4>
              <p>استفاده از تجهیزات پیشرفته و مواد اولیه‌ی اورجینال و ایمن</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="feature-content">
              <h4>تجربه‌ای فراتر از انتظار</h4>
              <p>محیطی لوکس، آرام و متمرکز بر راحتی و لذت شما</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-palette"></i>
            </div>
            <div class="feature-content">
              <h4>شخصی‌سازی کامل</h4>
              <p>خدمات متناسب با نیازها، سلیقه و هویت منحصر به فرد شما</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="feature-content">
              <h4>تعهد به سلامت</h4>
              <p>رعایت بالاترین استانداردهای بهداشتی و ایمنی</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>آماده‌اید تا زیبایی خود را کشف کنید؟</h2>
        <p>هلچین فقط مقصدی برای یک آرایش یا خدمات زیبایی نیست؛ مکانی برای بازتعریف زیبایی خود، تقویت اعتماد به نفس و لحظاتی ارزشمند از توجه به خودتان است.</p>
        <a href="/booking" class="btn btn-light">همین حالا رزرو کنید</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* استایل اصلی بدون تغییر */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body {
    font-family: 'Montserrat', sans-serif;
    color: #555555;
    line-height: 1.6;
    background-color: #ffffff;
    overflow-x: hidden;
}
h1, h2, h3, h4 {
    font-family: 'Playfair Display', serif;
    color: #333333;
    margin-bottom: 1.5rem;
    font-weight: 700;
}
h1 {
    font-size: 3.5rem;
    line-height: 1.2;
}
h2 {
    font-size: 2.8rem;
    position: relative;
    padding-bottom: 1rem;
    margin-bottom: 3rem;
}
h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80px;
    height: 3px;
    background-color: #ff69b4;
}
.container {
    width: 75%; /* تغییر از 90% به 75% */
    margin: 0 auto;
    padding: 0 20px;
}
/* Hero Section */
.hero {
    background: linear-gradient(rgba(255, 105, 180, 0.8), rgba(255, 105, 180, 0.8)), url('../../assets/images/photo-1560066984-138dadb4c035 (1).jpeg') center/cover no-repeat;
    height: 80vh;
    display: flex;
    align-items: center;
    text-align: center;
    color: #ffffff;
    position: relative;
}
.hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}
.hero h1 {
    color: #ffffff;
    font-size: 4rem;
    margin-bottom: 1.5rem;
    animation: fadeInUp 1s ease;
}
.hero p {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    animation: fadeInUp 1s ease 0.3s;
    animation-fill-mode: both;
}
.btn {
    display: inline-block;
    padding: 15px 35px;
    background-color: #ffffff;
    color: #ff69b4;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.4s ease;
    border: none;
    cursor: pointer;
    animation: fadeInUp 1s ease 0.6s;
    animation-fill-mode: both;
}
.btn:hover {
    background-color: #ffb6c1;
    color: #ffffff;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(255, 105, 180, 0.3);
}
/* About Section */
.about {
    padding: 100px 0;
    background-color: #ffb6c1;
    background: linear-gradient(135deg, #ffb6c1 0%, #ffffff 100%);
}
.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    align-items: center;
}
.about-text h2 {
    margin-bottom: 2rem;
}
.about-text p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.8;
}
.about-image {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(255, 105, 180, 0.2);
    border: 5px solid #ffffff;
}
.about-image img {
    width: 100%;
    height: auto;
    display: block;
    transition: all 0.4s ease;
}
.about-image:hover img {
    transform: scale(1.05);
}
/* Experience Section */
.experience {
    padding: 100px 0;
    background-color: #ffffff;
}
.experience-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
    margin-top: 60px;
}
.exp-card {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 40px 30px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(255, 105, 180, 0.1);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid #ffb6c1;
}
.exp-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: #ff69b4;
    transform: scaleY(0);
    transition: all 0.4s ease;
}
.exp-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(255, 105, 180, 0.2);
}
.exp-card:hover::before {
    transform: scaleY(1);
}
.exp-icon {
    font-size: 3rem;
    color: #ff69b4;
    margin-bottom: 20px;
    transition: all 0.4s ease;
}
.exp-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}
/* Why Choose Us */
.why-choose {
    padding: 100px 0;
    background-color: #ffb6c1;
    background: linear-gradient(135deg, #ffffff 0%, #ffb6c1 100%);
}
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 60px;
}
.feature {
    display: flex;
    align-items: flex-start;
    background-color: #ffffff;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
    transition: all 0.4s ease;
    border: 1px solid #ffb6c1;
}
.feature:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(255, 105, 180, 0.2);
}
.feature-icon {
    font-size: 2rem;
    color: #ff69b4;
    margin-left: 20px;
    margin-top: 5px;
    transition: all 0.4s ease;
}
.feature-content h4 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
}
/* CTA Section */
.cta {
    padding: 100px 0;
    background: linear-gradient(rgba(255, 105, 180, 0.7), rgba(255, 105, 180, 0.7)), url('../../assets/images/photo-1522383225653-ed111181a951.jpg') center/cover no-repeat;
    text-align: center;
    color: #ffffff;
}
.cta h2 {
    color: #ffffff;
    font-size: 3rem;
    margin-bottom: 1.5rem;
}
.cta p {
    font-size: 1.3rem;
    max-width: 700px;
    margin: 0 auto 2.5rem;
}
.btn-light {
    background-color: #ffffff;
    color: #ff69b4;
}
.btn-light:hover {
    background-color: #ffb6c1;
    color: #ffffff;
}
/* Animations */
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
/* Responsive */
@media (max-width: 992px) {
    h1 {
        font-size: 3rem;
    }
    h2 {
        font-size: 2.3rem;
    }
    .about-content {
        grid-template-columns: 1fr;
    }
    .about-image {
        max-width: 600px;
        margin: 0 auto;
    }
}
@media (max-width: 768px) {
    .hero h1 {
        font-size: 2.5rem;
    }
    .hero p {
        font-size: 1.1rem;
    }
}
@media (max-width: 576px) {
    h1 {
        font-size: 2.2rem;
    }
    h2 {
        font-size: 1.8rem;
    }
    .hero {
        height: 70vh;
    }
    .about, .experience, .why-choose, .cta {
        padding: 70px 0;
    }
}
</style>