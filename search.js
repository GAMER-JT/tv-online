export function setupSearch(channels, renderCallback) {
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredChannels = channels.filter(channel => 
      channel.name.toLowerCase().includes(searchTerm) ||
      channel.category.toLowerCase().includes(searchTerm)
    );
    renderCallback(filteredChannels);
  });
}