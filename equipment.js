// Скрипты для страницы оборудования и запчастей

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== АНИМАЦИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ ====================
  const animatedElements = document.querySelectorAll('.equipment-item, .process-step');
  
  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        elementObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    elementObserver.observe(element);
  });
  
  // ==================== МОДАЛЬНОЕ ОКНО ДЛЯ ЗАКАЗА ОБОРУДОВАНИЯ ====================
  const orderButtons = document.querySelectorAll('.product-card__btn, .equipment-item__btn');
  const modalOverlay = document.getElementById('equipmentModalOverlay');
  const modalClose = document.getElementById('equipmentModalClose');
  const modalProductName = document.getElementById('modalProductName');
  const modalProductInput = document.getElementById('modalProductInput');
  const modalCategoryInput = document.getElementById('modalCategoryInput');
  
  orderButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.getAttribute('data-product');
      const category = this.getAttribute('data-category') || 'Оборудование';
      
      if (modalProductName) {
        modalProductName.textContent = productName;
      }
      
      if (modalProductInput) {
        modalProductInput.value = productName;
      }
      
      if (modalCategoryInput) {
        modalCategoryInput.value = category;
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
  const equipmentForm = document.getElementById('equipmentForm');
  const modalForm = document.getElementById('equipmentModalForm');
  
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
      console.log('Запрос оборудования:', data);
      
      // Показываем сообщение об успехе
      alert('Спасибо! Ваш запрос отправлен. Мы свяжемся с вами в ближайшее время для уточнения деталей.');
      
      // Сбрасываем форму
      this.reset();
      
      // Закрываем модальное окно, если оно было открыто
      if (isModal && modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Отправляем данные в Telegram (в реальном проекте через бэкенд)
      sendEquipmentRequest(data);
    });
  }
  
  // Функция отправки запроса оборудования в Telegram
  function sendEquipmentRequest(data) {
    // В реальном проекте здесь будет отправка на сервер
    console.log('Отправка запроса оборудования:', data);
    
    // Пример сообщения для Telegram
    let message = `📦 НОВЫЙ ЗАПРОС ОБОРУДОВАНИЯ!\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone}`;
    
    if (data.email) message += `\n📧 Email: ${data.email}`;
    if (data.product) message += `\n🛒 Товар: ${data.product}`;
    if (data.category) message += `\n📁 Категория: ${data.category}`;
    if (data.equipment) message += `\n🔧 Оборудование: ${data.equipment}`;
    if (data.boat_model) message += `\n🚤 Модель яхты: ${data.boat_model}`;
    if (data.engine_model) message += `\n⚙️ Модель двигателя: ${data.engine_model}`;
    if (data.installation) message += `\n🔨 Требуется установка: Да`;
    if (data.message) message += `\n📝 Доп. информация: ${data.message}`;
    
    console.log('Запрос оборудования для Telegram:', message);
  }
  
  // Инициализация обработчиков форм
  if (equipmentForm) {
    handleFormSubmit(equipmentForm);
  }
  
  if (modalForm) {
    handleFormSubmit(modalForm, true);
  }
  
  // ==================== ПЛАВНЫЙ СКРОЛЛ ДЛЯ КАТЕГОРИЙ ====================
  const categoryLinks = document.querySelectorAll('.category-card__btn, .footer__equipment a');
  
  categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // ==================== ПОДСВЕТКА АКТИВНОЙ КАТЕГОРИИ ====================
  function highlightActiveCategory() {
    const sections = document.querySelectorAll('.equipment-section');
    const categoryCards = document.querySelectorAll('.category-card');
    
    let current = '';
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('.header').offsetHeight;
    const offset = headerHeight + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= (sectionTop - offset)) {
        current = section.getAttribute('id');
      }
    });
    
    categoryCards.forEach(card => {
      const href = card.querySelector('.category-card__btn').getAttribute('href');
      if (href === `#${current}`) {
        card.style.boxShadow = '0 15px 30px rgba(26, 58, 95, 0.2)';
        card.style.border = '2px solid #1a3a5f';
      } else {
        card.style.boxShadow = '';
        card.style.border = '';
      }
    });
  }
  
  window.addEventListener('scroll', highlightActiveCategory);
  
  // ==================== ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ ====================
  function lazyLoadEquipmentImages() {
    const images = document.querySelectorAll('.equipment-item__image img, .product-card__image img, .category-card__image img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src') || img.src;
          
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
      if (!img.hasAttribute('data-src')) {
        img.setAttribute('data-src', img.src);
      }
      imageObserver.observe(img);
    });
  }
  
  // Запускаем ленивую загрузку после загрузки страницы
  setTimeout(lazyLoadEquipmentImages, 1000);
  
  console.log('Equipment page loaded successfully!');
});