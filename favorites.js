export function setupFavorites(channels, player) {
  const favoritesBtn = document.getElementById('favoritesBtn');
  const sidebar = document.getElementById('favoritesSidebar');
  const overlay = document.getElementById('overlay');
  const closeSidebar = document.getElementById('closeSidebar');
  const favoritesList = document.getElementById('favoritesList');
  
  // Load favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }

  function toggleFavorite(channelId) {
    const index = favorites.indexOf(channelId);
    if (index === -1) {
      favorites.push(channelId);
    } else {
      favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
    return index === -1; // returns true if added to favorites
  }
  
  function updateFavoritesList() {
    favoritesList.innerHTML = '';
    favorites.forEach(channelId => {
      const channel = channels.find(c => c.id === channelId);
      if (channel) {
        const item = document.createElement('div');
        item.className = 'channel-card';
        item.innerHTML = `
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
          <button class="favorite-btn active">
            <i class="fas fa-heart"></i>
          </button>
        `;
        
        const favoriteBtn = item.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavorite(channel.id);
        });
        
        item.addEventListener('click', () => {
          player.src({ 
            src: channel.url,
            type: channel.url.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
          });
          player.play();
        });
        
        favoritesList.appendChild(item);
      }
    });
  }
  
  favoritesBtn.addEventListener('click', toggleSidebar);
  closeSidebar.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);
  
  updateFavoritesList();

  return {
    toggleFavorite,
    isFavorite: (channelId) => favorites.includes(channelId)
  };
}