export function initializePlayer(playerId) {
  const player = videojs(playerId, {
    controls: true,
    fluid: true,
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true
      }
    }
  });

  // Personalizar tema del reproductor
  const playerElement = document.querySelector('.video-js');
  playerElement.style.setProperty('--vjs-theme-color', '#00f7ff');

  return player;
}