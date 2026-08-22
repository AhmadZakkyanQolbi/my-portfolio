/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if (navToggle) {
   navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
   });
}

if (navClose) {
   navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
   });
}

/*=============== REMOVE MOBILE MENU ===============*/
const navLink = document.querySelectorAll('.nav__link, .nav__contact');

const linkAction = () => {
   const navMenu = document.getElementById('nav-menu');
   navMenu.classList.remove('show-menu');
};
navLink.forEach(n => n.addEventListener('click', linkAction));

/*=============== DARK / LIGHT THEME ===============*/
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggle && themeIcon) {
   const getPreferredTheme = () => {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
   };

   const setTheme = (theme) => {
      if (theme === 'light') {
         document.documentElement.classList.remove('dark');
         document.body.classList.add('light-theme');
         themeIcon.className = 'ri-moon-line';
      } else {
         document.documentElement.classList.add('dark');
         document.body.classList.remove('light-theme');
         themeIcon.className = 'ri-sun-line';
      }
      localStorage.setItem('theme', theme);
   };

   setTheme(getPreferredTheme());

   themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
   });
}

/*=============== HOME TYPED JS ===============*/
const typed = document.getElementById('home-typed');

if (typed) {
   new Typed('#home-typed', {
      strings: [
         'Ahmad Zakkyan Qolbi',
         'Web Developer',
         'Programmer',
         'System Developer',
         'UI/UX Enthusiast'
      ],
      typeSpeed: 70,
      backSpeed: 40,
      loop: true,
      smartBackspace: true,
      backDelay: 1500,
      startDelay: 500,
   });
}

/*=============== CHANGE HEADER STYLES ===============*/
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
   if (window.scrollY >= 50) {
      header.classList.add('show-header');
   } else {
      header.classList.remove('show-header');
   }
});

/*=============== SERVICES ACCORDION ===============*/
document.addEventListener('DOMContentLoaded', function() {
   const servicesButtons = document.querySelectorAll('.services__button');
   const servicesCards = document.querySelectorAll('.services__card');

   servicesButtons.forEach(button => {
      button.addEventListener('click', function(e) {
         e.stopPropagation();
         const card = this.closest('.services__card');
         const isOpen = card.classList.contains('services-open');

         servicesCards.forEach(c => {
            if (c !== card) {
               c.classList.remove('services-open');
            }
         });

         if (!isOpen) {
            card.classList.add('services-open');
         } else {
            card.classList.remove('services-open');
         }
      });
   });

   servicesCards.forEach(card => {
      card.addEventListener('click', function(e) {
         if (e.target.closest('.services__button')) return;
         const isOpen = this.classList.contains('services-open');

         servicesCards.forEach(c => {
            if (c !== this) {
               c.classList.remove('services-open');
            }
         });

         if (!isOpen) {
            this.classList.add('services-open');
         } else {
            this.classList.remove('services-open');
         }
      });
   });
});

/*=============== CONTACT EMAIL JS ===============*/
// =====================================================
// ✅ DATA DARI EMAILJS KAMU (UPDATE!)
// =====================================================
// Public Key: y21JsOyeMW2zFFeka  (dari screenshot terbaru)
// Service ID: service_371twhl
// Template ID: template_0ob2h51
// =====================================================

const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
   // ✅ Public Key sudah diganti dengan yang benar!
   const EMAILJS_PUBLIC_KEY = 'y21JsOyeMW2zFFeka';
   const EMAILJS_SERVICE_ID = 'service_371twhl';
   const EMAILJS_TEMPLATE_ID = 'template_o0b2h51';

   // Debug: cek public key
   console.log('Public Key yang digunakan:', EMAILJS_PUBLIC_KEY);

   emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
   });

   contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const btn = this.querySelector('.contact__button');
      const originalText = btn.innerHTML;
      
      if (formMessage) {
         formMessage.style.display = 'none';
      }
      
      btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Mengirim...';
      btn.disabled = true;

      console.log('Mengirim ke EmailJS...');
      console.log('Service ID:', EMAILJS_SERVICE_ID);
      console.log('Template ID:', EMAILJS_TEMPLATE_ID);

      emailjs.sendForm(
         EMAILJS_SERVICE_ID,
         EMAILJS_TEMPLATE_ID,
         this
      ).then(() => {
         console.log('✅ Email terkirim!');
         btn.innerHTML = '<i class="ri-check-line"></i> Terkirim!';
         btn.style.background = '#22c55e';
         btn.style.color = '#fff';

         if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.style.background = '#22c55e';
            formMessage.style.color = '#fff';
            formMessage.textContent = '✅ Pesan berhasil dikirim! Terima kasih sudah menghubungi saya.';
         }

         this.reset();

         setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
            
            if (formMessage) {
               formMessage.style.display = 'none';
            }
         }, 4000);
      }).catch((error) => {
         console.error('❌ EmailJS Error:', error);
         btn.innerHTML = '<i class="ri-close-line"></i> Gagal Kirim';
         btn.style.background = '#ef4444';
         btn.style.color = '#fff';

         if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.style.background = '#ef4444';
            formMessage.style.color = '#fff';
            formMessage.textContent = '❌ Gagal mengirim pesan. Silakan coba lagi nanti.';
         }

         setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
            
            if (formMessage) {
               formMessage.style.display = 'none';
            }
         }, 4000);
      });
   });
}

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = document.getElementById('scroll-up');

window.addEventListener('scroll', () => {
   if (window.scrollY >= 350) {
      scrollUp.classList.add('show-scroll');
   } else {
      scrollUp.classList.remove('show-scroll');
   }
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
   const scrollY = window.pageYOffset;

   sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
         if (navLink) {
            navLink.classList.add('active-link');
         }
      } else {
         if (navLink) {
            navLink.classList.remove('active-link');
         }
      }
   });
});

/*=============== CUSTOM CURSOR ===============*/
const cursor = document.querySelector('.cursor');

if (cursor && window.innerWidth > 768) {
   document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
   });

   document.querySelectorAll('a, button, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => {
         cursor.style.width = '50px';
         cursor.style.height = '50px';
         cursor.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
         cursor.style.width = '30px';
         cursor.style.height = '30px';
         cursor.style.opacity = '1';
      });
   });
}

/*=============== SCROLLREVEAL ANIMATION ===============*/
const sr = ScrollReveal({
   distance: '60px',
   duration: 1000,
   delay: 100,
   reset: false,
   easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
});

sr.reveal('.home__content', { origin: 'left', delay: 200 });
sr.reveal('.home__image', { origin: 'right', delay: 300 });
sr.reveal('.about__content', { origin: 'left' });
sr.reveal('.about__image', { origin: 'right' });
sr.reveal('.work__card', { origin: 'bottom', interval: 100, viewFactor: 0.2 });
sr.reveal('.services__card', { origin: 'bottom', interval: 100, viewFactor: 0.2 });
sr.reveal('.skills__description', { origin: 'top' });
sr.reveal('.skills__group', { origin: 'bottom', interval: 100, viewFactor: 0.2 });
sr.reveal('.contact__form', { origin: 'left' });
sr.reveal('.contact__info', { origin: 'right' });
sr.reveal('.footer__content', { origin: 'top' });
sr.reveal('.footer__links, .footer__social, .footer__copy', { origin: 'bottom', interval: 100 });