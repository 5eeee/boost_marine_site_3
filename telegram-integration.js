// Интеграция с Telegram для загрузки постов
document.addEventListener('DOMContentLoaded', function() {
  const telegramPostsContainer = document.getElementById('telegram-posts');
  
  if (!telegramPostsContainer) return;
  
  // Примерные данные постов (в реальном проекте будет API запрос)
  const telegramPosts = [
    {
      id: 53,
      image: 'https://via.placeholder.com/800x600/4d96ff/ffffff?text=Telegram+Post+1',
      title: 'Ремонт двигателя яхты',
      description: 'Полная замена поршневой группы двигателя Volvo Penta',
      link: 'https://t.me/boostmarinegroup/53'
    },
    {
      id: 52,
      image: 'https://via.placeholder.com/800x600/357ae8/ffffff?text=Telegram+Post+2',
      title: 'Модернизация навигации',
      description: 'Установка новой GPS-системы и радара',
      link: 'https://t.me/boostmarinegroup/52'
    },
    {
      id: 51,
      image: 'https://via.placeholder.com/800x600/2d4263/ffffff?text=Telegram+Post+3',
      title: 'Обслуживание гидроцикла',
      description: 'Сезонное ТО и ремонт гидроцикла Sea-Doo',
      link: 'https://t.me/boostmarinegroup/51'
    },
    {
      id: 50,
      image: 'https://via.placeholder.com/800x600/1a1a2e/ffffff?text=Telegram+Post+4',
      title: 'Ремонт электросистемы',
      description: 'Замена проводки и установка новой аккумуляторной системы',
      link: 'https://t.me/boostmarinegroup/50'
    },
    {
      id: 49,
      image: 'https://via.placeholder.com/800x600/0f0f1a/ffffff?text=Telegram+Post+5',
      title: 'Капитальный ремонт',
      description: 'Полная разборка и восстановление двигателя яхты',
      link: 'https://t.me/boostmarinegroup/49'
    },
    {
      id: 48,
      image: 'https://via.placeholder.com/800x600/252538/ffffff?text=Telegram+Post+6',
      title: 'Установка кондиционера',
      description: 'Монтаж климатической системы на яхту',
      link: 'https://t.me/boostmarinegroup/48'
    }
  ];
  
  // Функция для загрузки реальных постов из Telegram
  async function loadTelegramPosts() {
    try {
      // В реальном проекте здесь будет запрос к Telegram API
      // const response = await fetch('YOUR_API_ENDPOINT');
      // const posts = await response.json();
      
      // Используем примерные данные
      const posts = telegramPosts;
      
      // Очищаем контейнер
      telegramPostsContainer.innerHTML = '';
      
      // Создаем слайды для каждого поста
      posts.forEach(post => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide work-slide';
        
        slide.innerHTML = `
          <a href="${post.link}" target="_blank" class="work-slide__link">
            <img src="${post.image}" alt="${post.title}" class="work-slide__image" loading="lazy">
            <div class="work-slide__overlay">
              <h3 class="work-slide__title">${post.title}</h3>
              <p class="work-slide__description">${post.description}</p>
              <div class="work-slide__badge">
                <i class="fab fa-telegram"></i>
                Telegram
              </div>
            </div>
          </a>
        `;
        
        telegramPostsContainer.appendChild(slide);
      });
      
      // Переинициализируем слайдер после загрузки постов
      if (typeof Swiper !== 'undefined' && document.querySelector('.works-slider')) {
        setTimeout(() => {
          if (window.worksSlider) {
            window.worksSlider.update();
          }
        }, 100);
      }
      
    } catch (error) {
      console.error('Ошибка загрузки постов из Telegram:', error);
      showErrorMessage();
    }
  }
  
  function showErrorMessage() {
    telegramPostsContainer.innerHTML = `
      <div class="swiper-slide work-slide">
        <div class="work-slide__placeholder error">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Не удалось загрузить посты из Telegram</p>
          <a href="https://t.me/boostmarinegroup" class="btn btn--telegram" target="_blank">
            <i class="fab fa-telegram"></i>
            Перейти в канал
          </a>
        </div>
      </div>
    `;
  }
  
  // Загружаем посты после загрузки страницы
  setTimeout(loadTelegramPosts, 1000);
  
  // Добавляем стили для бейджа Telegram
  const style = document.createElement('style');
  style.textContent = `
    .work-slide__link {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      text-decoration: none;
    }
    
    .work-slide__badge {
      position: absolute;
      top: 15px;
      right: 15px;
      background: var(--accent-telegram);
      color: white;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .work-slide__badge i {
      font-size: 0.9rem;
    }
    
    .work-slide__placeholder.error {
      color: #ff6b6b;
    }
    
    .work-slide__placeholder.error i {
      color: #ff6b6b;
    }
  `;
  document.head.appendChild(style);
});