import { channels } from './data.js';
import { initializePlayer } from './player.js';
import { setupFavorites } from './favorites.js';
import { setupSearch } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize video player
  const player = initializePlayer('mainPlayer');
  
  // Setup favorites system
  const favoritesSystem = setupFavorites(channels, player);
  
  // Generate categories with "Todo" as first option
  const categories = ['Todo', ...new Set(channels.map(channel => channel.category))];
  const categoriesContainer = document.getElementById('categories');
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'category-btn';
    button.textContent = category;
    button.addEventListener('click', () => filterChannels(category));
    categoriesContainer.appendChild(button);
  });

  // Initialize channels grid
  function renderChannels(channelsToRender) {
    const grid = document.getElementById('channelsGrid');
    grid.innerHTML = '';
    
    channelsToRender.forEach((channel, index) => {
      const card = document.createElement('div');
      card.className = 'channel-card';
      card.style.setProperty('--item-index', index);
      
      card.innerHTML = `
        <div class="channel-icon">
          <img src="${channel.imageUrl}" alt="${channel.name}">
          <div class="live-badge">
            <div class="live-dot"></div>
            <span>EN VIVO</span>
          </div>
        </div>
        <div class="channel-info">
          <div class="channel-name">${channel.name}</div>
          <div class="channel-category">${channel.category}</div>
        </div>
        <button class="favorite-btn ${favoritesSystem.isFavorite(channel.id) ? 'active' : ''}">
          <i class="fas fa-heart"></i>
        </button>
      `;
      
      const favoriteBtn = card.querySelector('.favorite-btn');
      favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isNowFavorite = favoritesSystem.toggleFavorite(channel.id);
        favoriteBtn.classList.toggle('active', isNowFavorite);
      });
      
      card.addEventListener('click', () => {
        const loadingAnimation = document.createElement('div');
        loadingAnimation.className = 'loading-animation';
        card.appendChild(loadingAnimation);
        
        player.src({ 
          src: channel.url,
          type: channel.url.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
        });
        
        player.play().finally(() => {
          loadingAnimation.remove();
        });
      });
      
      grid.appendChild(card);
    });
  }

  function filterChannels(category) {
    const filteredChannels = category === 'Todo' 
      ? channels 
      : channels.filter(channel => channel.category === category);
    renderChannels(filteredChannels);
    
    // Update active category
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === category);
    });
  }

  // Add dynamic category button animations
  function setupCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(button => {
      const text = button.textContent;
      button.innerHTML = `<span>${text}</span>`;
    });
  }

  // Initialize features
  setupSearch(channels, renderChannels);

  // Initialize with animations
  setupCategoryButtons();
  filterChannels('Todo');

  // Add scroll reveal animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.channel-card').forEach(card => {
    observer.observe(card);
  });
});