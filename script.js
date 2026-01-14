// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ ====================
const DOM = {
  body: document.body,
  header: document.querySelector('.header'),
  menuToggle: document.querySelector('.menu-toggle'),
  mobileNav: document.querySelector('.mobile-nav'),
  mobileContactBtn: document.querySelector('.mobile-contact-btn'),
  contactToggle: document.querySelector('.contact-toggle'),
  workModal: document.getElementById('work-modal'),
  workModalOverlay: document.getElementById('work-modal-overlay'),
  workModalClose: document.getElementById('work-modal-close'),
  workSlides: document.querySelectorAll('.work-slide'),
  mobileNavLinks: document.querySelectorAll('.mobile-nav__link'),
  headerNavLinks: document.querySelectorAll('.header-nav .nav__link'),
  sections: document.querySelectorAll('section[id]'),
  serviceCards: document.querySelectorAll('.service-card'),
  teamMembers: document.querySelectorAll('.team-member'),
  heroHalves: document.querySelectorAll('.hero__half'),
  fadeElements: document.querySelectorAll('.service-card, .team-member, .section-header, .contact-item, .onsite-feature')
};

// Создаем оверлей для меню
let menuOverlay = document.querySelector('.menu-overlay');
if (!menuOverlay) {
  menuOverlay = document.createElement('div');
  menuOverlay.className = 'menu-overlay';
  DOM.body.appendChild(menuOverlay);
}

// Создаем кнопку "Наверх"
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Наверх');
DOM.body.appendChild(scrollToTopBtn);

// Переменные состояния
let worksSlider = null;
let resizeTimeout = null;
let lastScrollTop = 0;

// ==================== УТИЛИТЫ ====================
const Utils = {
  // Throttle для оптимизации производительности
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Debounce для оптимизации resize событий
  debounce: (func, wait) => {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },

  // Плавный скролл к элементу
  smoothScrollTo: (element, offset = 20) => {
    const headerHeight = DOM.header.offsetHeight;
    const elementPosition = element.offsetTop - headerHeight - offset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  },

  // Проверка видимости элемента в viewport
  isElementInViewport: (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  },

  // Закрытие всех открытых меню
  closeAllMenus: () => {
    // Закрываем мобильное меню
    if (DOM.menuToggle && DOM.mobileNav.classList.contains('active')) {
      DOM.menuToggle.classList.remove('active');
      DOM.mobileNav.classList.remove('active');
      menuOverlay.classList.remove('active');
      DOM.body.classList.remove('menu-open');
      DOM.body.style.overflow = '';
    }

    // Закрываем меню контактов
    if (DOM.mobileContactBtn && DOM.mobileContactBtn.classList.contains('active')) {
      DOM.mobileContactBtn.classList.remove('active');
    }
  }
};

// ==================== ЦЕНТРИРОВАНИЕ ТЕКСТА ПОД НОМЕРОМ ====================
const TextCentering = {
  init: () => {
    if (window.innerWidth > 767) {
      TextCentering.centerText();
    }
  },

  centerText: () => {
    const headerPhone = document.querySelector('.header-phone');
    const headerOnsite = document.querySelector('.header-onsite');
    const headerSocialRow = document.querySelector('.header-social-row');

    if (!headerPhone || !headerOnsite || !headerSocialRow) return;

    // Получаем ширину элементов
    const phoneWidth = headerPhone.offsetWidth;
    const socialWidth = headerSocialRow.offsetWidth;
    
    // Рассчитываем позиционирование
    // Текст должен быть под правым краем номера, учитывая иконки
    const totalWidth = phoneWidth + 12 + socialWidth; // 12px - gap между номером и иконками
    
    // Устанавливаем позиционирование
    headerOnsite.style.width = `${phoneWidth}px`;
    headerOnsite.style.textAlign = 'right';
    
    // Рассчитываем отступ для центрирования под номером
    // Учитываем, что иконки находятся справа от номера
    headerOnsite.style.marginRight = `${socialWidth + 12}px`;
    
    // Дополнительная тонкая настройка
    headerOnsite.style.position = 'relative';
    headerOnsite.style.left = '-4px'; // Тонкая корректировка
  },

  reset: () => {
    const headerOnsite = document.querySelector('.header-onsite');
    if (headerOnsite) {
      headerOnsite.style.width = '';
      headerOnsite.style.textAlign = '';
      headerOnsite.style.marginRight = '';
      headerOnsite.style.position = '';
      headerOnsite.style.left = '';
    }
  }
};

// ==================== МОБИЛЬНОЕ МЕНЮ ====================
const MobileMenu = {
  init: () => {
    if (DOM.menuToggle) {
      DOM.menuToggle.addEventListener('click', MobileMenu.toggle);
    }

    // Закрытие при клике на оверлей
    menuOverlay.addEventListener('click', Utils.closeAllMenus);

    // Закрытие при клике на ссылки
    DOM.mobileNavLinks.forEach(link => {
      link.addEventListener('click', Utils.closeAllMenus);
    });

    // Закрытие при нажатии ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        Utils.closeAllMenus();
      }
    });
  },

  toggle: (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    DOM.menuToggle.classList.toggle('active');
    DOM.mobileNav.classList.toggle('active');
    menuOverlay.classList.toggle('active');

    if (DOM.mobileNav.classList.contains('active')) {
      DOM.body.classList.add('menu-open');
      DOM.body.style.overflow = 'hidden';
    } else {
      DOM.body.classList.remove('menu-open');
      DOM.body.style.overflow = '';
    }

    // Закрываем меню контактов, если оно открыто
    if (DOM.mobileContactBtn.classList.contains('active')) {
      DOM.mobileContactBtn.classList.remove('active');
    }
  }
};

// ==================== МЕНЮ КОНТАКТОВ ДЛЯ МОБИЛЬНЫХ ====================
const ContactMenu = {
  init: () => {
    if (DOM.contactToggle) {
      DOM.contactToggle.addEventListener('click', ContactMenu.toggle);
    }

    // Закрытие при клике на ссылки
    const contactLinks = DOM.mobileContactBtn.querySelectorAll('.mobile-contact-link');
    contactLinks.forEach(link => {
      link.addEventListener('click', () => {
        DOM.mobileContactBtn.classList.remove('active');
      });
    });

    // Закрытие при клике вне
    document.addEventListener('click', (e) => {
      if (!DOM.mobileContactBtn.contains(e.target) && 
          DOM.mobileContactBtn.classList.contains('active')) {
        DOM.mobileContactBtn.classList.remove('active');
      }
    });
  },

  toggle: (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Закрываем меню навигации, если оно открыто
    if (DOM.mobileNav.classList.contains('active')) {
      Utils.closeAllMenus();
    }

    DOM.mobileContactBtn.classList.toggle('active');
  }
};

// ==================== МОДАЛЬНОЕ ОКНО ДЛЯ РАБОТ ====================
const WorkModal = {
  data: {
    1: {
      title: 'Ремонт двигателя яхты',
      date: 'Проект завершен: 15.03.2024',
      description: 'Полный ремонт двигателя яхты с заменой всех изношенных деталей. Проведена диагностика, замена поршневой группы, ремонт системы охлаждения. Работы выполнены в сжатые сроки с гарантией качества.',
      details: {
        duration: '5 дней',
        type: 'Капитальный ремонт',
        vessel: 'Яхта Bavaria 45'
      },
      images: ['assets/Фото будет позже.png', 'assets/Фото будет позже.png', 'assets/Фото будет позже.png']
    },
    2: {
      title: 'Обновление интерьера катера',
      date: 'Проект завершен: 22.03.2024',
      description: 'Полная реконструкция интерьера катера. Замена обивки, установка новой навигационной системы, обновление электрической проводки. Работы выполнены с учетом пожеланий клиента.',
      details: {
        duration: '7 дней',
        type: 'Реконструкция',
        vessel: 'Катер Sea Ray 280'
      },
      images: ['assets/Фото будет позже.png', 'assets/Фото будет позже.png', 'assets/Фото будет позже.png']
    },
    3: {
      title: 'Ремонт гидроцикла Sea-Doo',
      date: 'Проект завершен: 10.04.2024',
      description: 'Капитальный ремонт гидроцикла Sea-Doo. Замена двигателя, ремонт корпуса, полная диагностика всех систем. Техника восстановлена до заводского состояния.',
      details: {
        duration: '3 дня',
        type: 'Капитальный ремонт',
        vessel: 'Гидроцикл Sea-Doo GTI 130'
      },
      images: ['assets/Фото будет позже.png', 'assets/Фото будет позже.png', 'assets/Фото будет позже.png']
    },
    4: {
      title: 'Установка навигационного оборудования',
      date: 'Проект завершен: 05.04.2024',
      description: 'Установка современного навигационного оборудования на яхту. Включает GPS, эхолот, радар и системы связи. Все оборудование интегрировано в единую систему.',
      details: {
        duration: '2 дня',
        type: 'Установка оборудования',
        vessel: 'Яхта Beneteau Oceanis 45'
      },
      images: ['assets/Фото будет позже.png', 'assets/Фото будет позже.png', 'assets/Фото будет позже.png']
    }
  },

  init: () => {
    // Обработчики для открытия модального окна
    DOM.workSlides.forEach(slide => {
      const viewBtn = slide.querySelector('.work-slide__view-btn');
      
      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          WorkModal.open(slide.dataset.project);
        });
      }
      
      slide.addEventListener('click', () => {
        WorkModal.open(slide.dataset.project);
      });
    });

    // Закрытие модального окна
    if (DOM.workModalOverlay) {
      DOM.workModalOverlay.addEventListener('click', WorkModal.close);
    }
    
    if (DOM.workModalClose) {
      DOM.workModalClose.addEventListener('click', WorkModal.close);
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.workModal.classList.contains('active')) {
        WorkModal.close();
      }
    });
  },

  open: (projectId) => {
    const project = WorkModal.data[projectId];
    if (!project) return;

    // Заполняем данные
    document.getElementById('work-modal-title').textContent = project.title;
    document.querySelector('.work-modal__date').textContent = project.date;
    document.getElementById('work-modal-desc').textContent = project.description;

    // Обновляем детали
    const details = document.querySelector('.work-modal__details');
    details.innerHTML = `
      <div class="work-modal__detail">
        <i class="fas fa-calendar-alt"></i>
        <span>Срок выполнения: <strong>${project.details.duration}</strong></span>
      </div>
      <div class="work-modal__detail">
        <i class="fas fa-tools"></i>
        <span>Тип работ: <strong>${project.details.type}</strong></span>
      </div>
      <div class="work-modal__detail">
        <i class="fas fa-ship"></i>
        <span>Судно: <strong>${project.details.vessel}</strong></span>
      </div>
    `;

    // Обновляем изображения
    const mainImg = document.getElementById('work-modal-main-img');
    mainImg.src = project.images[0];

    // Обновляем миниатюры
    const thumbsContainer = document.querySelector('.work-modal__thumbnails');
    thumbsContainer.innerHTML = '';

    project.images.forEach((imgSrc, index) => {
      const thumb = document.createElement('div');
      thumb.className = `work-modal__thumb ${index === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${imgSrc}" alt="Миниатюра ${index + 1}">`;

      thumb.addEventListener('click', () => {
        document.querySelectorAll('.work-modal__thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = imgSrc;
      });

      thumbsContainer.appendChild(thumb);
    });

    // Показываем модальное окно
    DOM.workModal.classList.add('active');
    DOM.body.style.overflow = 'hidden';
    DOM.body.classList.add('modal-open');
  },

  close: () => {
    DOM.workModal.classList.remove('active');
    DOM.body.style.overflow = '';
    DOM.body.classList.remove('modal-open');
  }
};

// ==================== ПЛАВНЫЙ СКРОЛЛ ====================
const SmoothScroll = {
  init: () => {
    // Обработчики для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', SmoothScroll.handleClick);
    });
  },

  handleClick: function(e) {
    const href = this.getAttribute('href');
    
    if (href === '#' || href.startsWith('http')) return;
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
      e.preventDefault();
      
      // Закрываем все меню
      Utils.closeAllMenus();
      
      // Закрываем модальное окно
      if (DOM.workModal.classList.contains('active')) {
        WorkModal.close();
      }
      
      // Плавный скролл
      Utils.smoothScrollTo(targetElement);
    }
  }
};

// ==================== СЛАЙДЕР РАБОТ ====================
const Slider = {
  init: () => {
    if (document.querySelector('.works-slider')) {
      worksSlider = new Swiper('.works-slider', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 }
        }
      });
    }
  },

  destroy: () => {
    if (worksSlider) {
      worksSlider.destroy();
      worksSlider = null;
    }
  }
};

// ==================== АНИМАЦИЯ ПРИ СКРОЛЛЕ ====================
const ScrollAnimations = {
  observer: null,

  init: () => {
    ScrollAnimations.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            ScrollAnimations.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    DOM.fadeElements.forEach(el => {
      if (el) ScrollAnimations.observer.observe(el);
    });
  }
};

// ==================== ИЗМЕНЕНИЕ ШАПКИ ПРИ СКРОЛЛЕ ====================
const HeaderScroll = {
  init: () => {
    window.addEventListener('scroll', Utils.throttle(HeaderScroll.update, 100));
    HeaderScroll.update(); // Инициализация
  },

  update: () => {
    if (!DOM.header) return;

    const scrollY = window.scrollY;
    const scrollDirection = scrollY > lastScrollTop ? 'down' : 'up';
    lastScrollTop = scrollY <= 0 ? 0 : scrollY;

    // Добавляем/убираем класс при скролле
    if (scrollY > 100) {
      DOM.header.classList.add('scrolled');
    } else {
      DOM.header.classList.remove('scrolled');
    }

    // Показываем/скрываем кнопку "Наверх"
    if (scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }

    // Подсветка активного раздела
    let currentSection = '';
    DOM.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= (sectionTop - 150)) {
        currentSection = section.getAttribute('id');
      }
    });

    // Обновляем активные ссылки
    DOM.headerNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });

    DOM.mobileNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  }
};

// ==================== КНОПКА "НАВЕРХ" ====================
const ScrollToTop = {
  init: () => {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
};

// ==================== ГЛАВНЫЙ ЭКРАН ====================
const HeroSection = {
  init: () => {
    HeroSection.setHeight();
    HeroSection.adjustImages();
  },

  setHeight: () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.height = '100vh';
    }
  },

  adjustImages: () => {
    const windowWidth = window.innerWidth;
    
    DOM.heroHalves.forEach(half => {
      if (windowWidth <= 1024) {
        half.style.backgroundPosition = half.classList.contains('hero__half--yacht') 
          ? 'center bottom 20%' 
          : 'center bottom 15%';
      } else {
        half.style.backgroundPosition = half.classList.contains('hero__half--yacht') 
          ? 'center bottom 40%' 
          : 'center bottom 30%';
      }
    });
  }
};

// ==================== ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ ====================
const ImageOptimizer = {
  init: () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.loading = 'lazy';
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';

      if (img.complete) {
        ImageOptimizer.fadeIn(img);
      } else {
        img.onload = () => ImageOptimizer.fadeIn(img);
      }
    });
  },

  fadeIn: (img) => {
    img.style.opacity = '1';
  }
};

// ==================== КАРТОЧКИ УСЛУГ ====================
const ServiceCards = {
  init: () => {
    DOM.serviceCards.forEach(card => {
      card.addEventListener('click', ServiceCards.handleClick);
      card.addEventListener('mouseenter', ServiceCards.handleHover);
      card.addEventListener('mouseleave', ServiceCards.handleHoverEnd);
    });
  },

  handleClick: function(e) {
    if (!e.target.closest('a')) {
      const link = this.querySelector('a');
      if (link) {
        window.location.href = link.getAttribute('href');
      }
    }
  },

  handleHover: function() {
    if (window.innerWidth > 767) {
      this.style.transform = 'translateY(-10px)';
    }
  },

  handleHoverEnd: function() {
    if (window.innerWidth > 767) {
      this.style.transform = '';
    }
  }
};

// ==================== КОМАНДА ====================
const TeamSection = {
  init: () => {
    DOM.teamMembers.forEach(member => {
      member.addEventListener('mouseenter', TeamSection.handleHover);
      member.addEventListener('mouseleave', TeamSection.handleHoverEnd);
    });
  },

  handleHover: function() {
    if (window.innerWidth > 767) {
      const img = this.querySelector('.team-member__photo img');
      if (img) {
        img.style.transform = 'scale(1.05)';
      }
    }
  },

  handleHoverEnd: function() {
    if (window.innerWidth > 767) {
      const img = this.querySelector('.team-member__photo img');
      if (img) {
        img.style.transform = '';
      }
    }
  }
};

// ==================== АДАПТИВНОСТЬ ====================
const Responsive = {
  init: () => {
    window.addEventListener('resize', Utils.debounce(Responsive.handleResize, 250));
    Responsive.checkWindowSize();
  },

  handleResize: () => {
    Responsive.checkWindowSize();
    TextCentering.init();
    HeroSection.adjustImages();
    HeroSection.setHeight();
    
    // Переинициализируем слайдер при изменении размера
    if (window.innerWidth <= 767 && worksSlider) {
      Slider.destroy();
    } else if (window.innerWidth > 767 && !worksSlider) {
      Slider.init();
    }
  },

  checkWindowSize: () => {
    const windowWidth = window.innerWidth;

    // На десктопе закрываем мобильные меню
    if (windowWidth > 767) {
      Utils.closeAllMenus();
      TextCentering.init();
    } else {
      TextCentering.reset();
    }
  }
};

// ==================== ИНИЦИАЛИЗАЦИЯ ВСЕГО ПРИЛОЖЕНИЯ ====================
const App = {
  init: () => {
    // Инициализация модулей
    MobileMenu.init();
    ContactMenu.init();
    WorkModal.init();
    SmoothScroll.init();
    Slider.init();
    ScrollAnimations.init();
    HeaderScroll.init();
    ScrollToTop.init();
    HeroSection.init();
    ImageOptimizer.init();
    ServiceCards.init();
    TeamSection.init();
    Responsive.init();
    TextCentering.init();

    // Дополнительные настройки
    App.setupHeroScroll();
    App.preloadTeamImages();
    App.addPageLoadedClass();
    App.setupServiceCardAnimations();
    App.setupTeamMemberAnimations();

    console.log('Boost Marine website loaded successfully!');
  },

  setupHeroScroll: () => {
    const heroScroll = document.querySelector('.hero__scroll');
    if (heroScroll) {
      heroScroll.addEventListener('click', () => {
        Utils.smoothScrollTo(document.querySelector('#works'));
      });
    }
  },

  preloadTeamImages: () => {
    const teamImages = document.querySelectorAll('.team-member__photo img');
    teamImages.forEach(img => {
      if (img.src.includes('placeholder')) {
        img.style.backgroundColor = '#1a1a1a';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
      }
    });
  },

  addPageLoadedClass: () => {
    setTimeout(() => {
      DOM.body.classList.add('loaded');
    }, 100);
  },

  setupServiceCardAnimations: () => {
    setTimeout(() => {
      DOM.serviceCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 100);
      });
    }, 300);
  },

  setupTeamMemberAnimations: () => {
    setTimeout(() => {
      DOM.teamMembers.forEach((member, index) => {
        setTimeout(() => {
          member.classList.add('visible');
        }, index * 150);
      });
    }, 300);
  }
};

// ==================== ЗАГРУЗКА ПРИЛОЖЕНИЯ ====================
document.addEventListener('DOMContentLoaded', App.init);

// Обработка события загрузки всех ресурсов
window.addEventListener('load', () => {
  // Пересчитываем позиционирование текста после загрузки всех шрифтов
  setTimeout(TextCentering.init, 100);
});

// Обработка события beforeunload для очистки
window.addEventListener('beforeunload', () => {
  if (worksSlider) {
    worksSlider.destroy();
  }
});