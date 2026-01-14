// Скрипты для страницы услуг

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== АНИМАЦИЯ СЕКЦИЙ ПРИ СКРОЛЛЕ ====================
  const serviceDetails = document.querySelectorAll('.service-detail');
  
  const detailObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        detailObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  serviceDetails.forEach(detail => {
    detailObserver.observe(detail);
  });
  
  // ==================== ОТКРЫТИЕ МОДАЛЬНОГО ОКНА ДЛЯ ЗАКАЗА ====================
  const orderButtons = document.querySelectorAll('.service-detail__btn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalServiceName = document.getElementById('modalServiceName');
  const modalServiceInput = document.getElementById('modalServiceInput');
  
  orderButtons.forEach(button => {
    button.addEventListener('click', function() {
      const serviceName = this.getAttribute('data-service');
      
      if (modalServiceName) {
        modalServiceName.textContent = serviceName;
      }
      
      if (modalServiceInput) {
        modalServiceInput.value = serviceName;
      }
      
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Закрытие модального окна
  if (modalClose) {
    modalClose.addEventListener('click', function() {
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Закрытие при клике на оверлей
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Закрытие при нажатии ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // ==================== ОБРАБОТКА ФОРМ ====================
  const serviceForm = document.getElementById('serviceForm');
  const modalForm = document.getElementById('modalForm');
  
  // Маска для телефона
  function initPhoneMask(input) {
    input.addEventListener('input', function(e) {
      let value = this.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        if (value.length <= 3) {
          value = '+' + value;
        } else if (value.length <= 6) {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3);
        } else if (value.length <= 8) {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
        } else {
          value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 8) + ' ' + value.substring(8, 10);
        }
      }
      
      this.value = value;
    });
  }
  
  // Инициализация масок для всех полей телефона
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    initPhoneMask(input);
  });
  
  // Обработка отправки форм
  function handleFormSubmit(form, isModal = false) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());
      
      // Валидация
      if (!data.name || !data.phone) {
        alert('Пожалуйста, заполните обязательные поля: имя и телефон');
        return;
      }
      
      // В реальном проекте здесь будет отправка на сервер
      console.log('Данные формы:', data);
      
      // Показываем сообщение об успехе
      alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
      
      // Сбрасываем форму
      this.reset();
      
      // Закрываем модальное окно, если оно было открыто
      if (isModal && modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Отправляем данные в Telegram (в реальном проекте через бэкенд)
      sendToTelegram(data);
    });
  }
  
  // Функция отправки в Telegram (заглушка для демонстрации)
  function sendToTelegram(data) {
    const botToken = 'YOUR_BOT_TOKEN'; // Заменить на реальный токен
    const chatId = 'YOUR_CHAT_ID'; // Заменить на реальный chat_id
    
    const message = `
      Новая заявка с сайта Boost Marine!
      
      Имя: ${data.name}
      Телефон: ${data.phone}
      Email: ${data.email || 'Не указан'}
      Услуга: ${data.service || 'Не указана'}
      Сообщение: ${data.message || 'Не указано'}
    `;
    
    // В реальном проекте раскомментировать:
    // fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     chat_id: chatId,
    //     text: message,
    //     parse_mode: 'HTML'
    //   })
    // });
    
    console.log('Сообщение для Telegram:', message);
  }
  
  // Инициализация обработчиков форм
  if (serviceForm) {
    handleFormSubmit(serviceForm);
  }
  
  if (modalForm) {
    handleFormSubmit(modalForm, true);
  }
  
  // ==================== ПЛАВНЫЙ СКРОЛЛ ДЛЯ НАВИГАЦИИ УСЛУГ ====================
  const serviceNavLinks = document.querySelectorAll('.service-nav__item');
  
  serviceNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const serviceNavHeight = document.querySelector('.service-nav').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - serviceNavHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==================== ПОДСВЕТКА АКТИВНОЙ СЕКЦИИ В НАВИГАЦИИ ====================
  function highlightActiveService() {
    const sections = document.querySelectorAll('.service-section');
    const navLinks = document.querySelectorAll('.service-nav__item');
    
    let current = '';
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('.header').offsetHeight;
    const serviceNavHeight = document.querySelector('.service-nav').offsetHeight;
    const offset = headerHeight + serviceNavHeight + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= (sectionTop - offset)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
        link.style.background = 'var(--primary-color)';
        link.style.borderColor = 'var(--accent-color)';
        link.style.color = 'var(--accent-color)';
      } else {
        link.style.background = '';
        link.style.borderColor = '';
        link.style.color = '';
      }
    });
  }
  
  window.addEventListener('scroll', highlightActiveService);
  highlightActiveService(); // Инициализация при загрузке
  
  // ==================== КНОПКА "НАВЕРХ" ДЛЯ СТРАНИЦЫ УСЛУГ ====================
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.setAttribute('aria-label', 'Наверх');
  document.body.appendChild(scrollToTopBtn);
  
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Показать/скрыть кнопку при скролле
  function updateScrollButton() {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }
  
  window.addEventListener('scroll', updateScrollButton);
  updateScrollButton();
  
  // ==================== ЗАГРУЗКА ИЗОБРАЖЕНИЙ С ЗАДЕРЖКОЙ ====================
  function lazyLoadImages() {
    const images = document.querySelectorAll('.service-detail__image img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src') || img.src;
          
          // Если изображение еще не загружено
          if (!img.complete) {
            img.style.opacity = '0';
            img.src = src;
            
            img.onload = function() {
              this.style.transition = 'opacity 0.5s ease';
              this.style.opacity = '1';
            };
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });
    
    images.forEach(img => {
      // Сохраняем оригинальный src в data-src для ленивой загрузки
      if (!img.hasAttribute('data-src')) {
        img.setAttribute('data-src', img.src);
      }
      imageObserver.observe(img);
    });
  }
  
  // Запускаем ленивую загрузку после небольшой задержки
  setTimeout(lazyLoadImages, 1000);
  
  console.log('Services page loaded successfully!');
});