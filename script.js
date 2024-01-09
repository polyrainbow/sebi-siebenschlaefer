const SYMBOLS = {
  PLAY: 'images/play.svg',
  PAUSE: 'images/pause.svg',
};

const tracks = [
  {
    title: 'Komm auf die Tanzfläche',
    filename: '01%20-%20Sebi%20Siebenschläfer%20-%20Komm%20auf%20die%20Tanzfläche.mp3',
  },
  {
    title: 'Wieso? Wieso? Warum? Wieso?',
    filename: '02%20-%20Sebi%20Siebenschläfer%20-%20Wieso%20Wieso%20Warum%20Wieso.mp3',
  },
  {
    title: 'Wir fahren mit dem Zug',
    filename: '03%20-%20Sebi%20Siebenschläfer%20-%20Wir%20fahren%20mit%20dem%20Zug.mp3',
  },
  {
    title: 'Unsere Planeten',
    filename: '04%20-%20Sebi%20Siebenschläfer%20-%20Unsere%20Planeten.mp3',
  },
  {
    title: 'Die kleine Katze Claudia',
    filename: '05%20-%20Sebi%20Siebenschläfer%20-%20Die%20kleine%20Katze%20Claudia.mp3',
  },
  {
    title: 'Ich singe das ganze Jahr',
    filename: '06%20-%20Sebi%20Siebenschläfer%20-%20Ich%20singe%20das%20ganze%20Jahr.mp3',
  },
  {
    title: 'Gemüse',
    filename: '07%20-%20Sebi%20Siebenschläfer%20-%20Gemüse.mp3',
  },
  {
    title: 'Manchmal geht etwas schief',
    filename: '08%20-%20Sebi%20Siebenschläfer%20-%20Manchmal%20geht%20etwas%20schief.mp3',
  },
  {
    title: 'Ich fahr\' mit dem Fahrrad',
    filename: '09%20-%20Sebi%20Siebenschläfer%20-%20Ich%20fahr%20mit%20dem%20Fahrrad.mp3',
  },
  {
    title: '1 2 3 4',
    filename: '10%20-%20Sebi%20Siebenschläfer%20-%201%202%203%204.mp3',
  },
];

const getSrc = (filename) => `mp3/SO%20VIELES%20ZU%20ENTDECKEN/${filename}`;

const createPlayerUI = () => {
  const playerUI = document.createElement('div');
  playerUI.classList.add('player-ui');

  const progressBar = document.createElement('div');
  progressBar.role = 'progressbar';
  progressBar.value = 0;
  progressBar.max = 100;
  progressBar.classList.add('progress-bar');
  playerUI.appendChild(progressBar);
  progressBar.addEventListener('pointerdown', (event) => {
    const value = event.offsetX / progressBar.offsetWidth * 100;
    handleSeek(value, player);
  });

  progressBar.addEventListener('pointermove', (event) => {
    if (event.buttons === 1) {
      const value = event.offsetX / progressBar.offsetWidth * 100;
      handleSeek(value, player);
    }
  });

  const progress = document.createElement('div');
  progress.classList.add('progress');
  progressBar.appendChild(progress);
  progress.style.width = '0%';

  const time = document.createElement('span');
  time.classList.add('time');
  playerUI.appendChild(time);

  return playerUI;
};

const removeAllPlayerUIs = () => {
  const playerUIs = document.querySelectorAll('.player-ui');
  playerUIs.forEach((playerUI) => playerUI.remove());
};

const playTrack = (index, player, trackElement) => {
  const track = tracks[index];
  player.src = getSrc(track.filename);
  player.dataset.index = index;
  player.play();
  setPlayButtonState(index);

  removeAllPlayerUIs();

  const playerUI = createPlayerUI();
  trackElement.appendChild(playerUI);
};

const handleSeek = (value, player) => {
  const seekTime = value / 100 * player.duration;
  player.currentTime = seekTime;
}

const renderTrack = (track, parent, player, index) => {
  const trackEl = document.createElement('div');
  trackEl.classList.add('track');

  const main = document.createElement('div');
  main.classList.add('main');
  trackEl.appendChild(main);

  const playButton = document.createElement('button');
  playButton.addEventListener('click', () => {
    if (player.dataset.index === index.toString()) {
      if (player.paused) {
        player.play();
      } else {
        player.pause();
        setPlayButtonState(-1);
      }
    } else {
      playTrack(index, player, trackEl);
    }
  });
  main.appendChild(playButton);
  const buttonImg = document.createElement('img');
  buttonImg.src = SYMBOLS.PLAY;
  playButton.appendChild(buttonImg);

  const title = document.createElement('h3');
  title.textContent = (index + 1) + ". " + track.title;
  main.appendChild(title);

  parent.appendChild(trackEl);

  return trackEl;
};

const renderTracks = (tracks, parent, player) => {
  return tracks.map((track, index) => renderTrack(
    track,
    parent,
    player,
    index,
  ));
}

const tracksEl = document.querySelector('#tracks');
const player = document.querySelector('#player');
const playAlbumButton = document.querySelector('#play-album-button');
const trackElements = renderTracks(tracks, tracksEl, player);
const playButtons = document.querySelectorAll('.track .main button');
const buttonImages = document.querySelectorAll('.track .main button img');
const titles = document.querySelectorAll('.track main h3');

const setPlayButtonState = (index) => {
  buttonImages.forEach((buttonImg, buttonImgIndex) => {
    if (buttonImgIndex === index) {
      buttonImg.src = SYMBOLS.PAUSE;
    } else {
      buttonImg.src = SYMBOLS.PLAY;
    }
  });
};

player.addEventListener('play', () => {
  const currentIndex = parseInt(player.dataset.index);
  setPlayButtonState(currentIndex);
});

player.addEventListener('pause', () => {
  setPlayButtonState(-1);
});

player.addEventListener('ended', () => {
  const currentIndex = parseInt(player.dataset.index);
  const nextIndex = currentIndex + 1;
  const nextTrack = tracks[nextIndex];
  if (nextTrack) {
    playTrack(nextIndex, player, trackElements[nextIndex]);
  } else {
    player.src = "";
    player.dataset.index = -1;
    setPlayButtonState(-1);
    removeAllPlayerUIs();
  }
});

playAlbumButton.addEventListener('click', () => {
  playTrack(0, player, trackElements[0]);
});

const getTimeFormatted = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds - (minutes * 60))
    .toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

const refreshClock = () => {
  const currentIndex = parseInt(player.dataset.index);
  if (currentIndex > -1 && player.duration) {
    const playerUI = document.querySelector('.player-ui');
    const timeSpan = playerUI.querySelector('span.time');
    timeSpan.textContent = `${getTimeFormatted(player.currentTime)} / ${getTimeFormatted(player.duration)}`;

    const progress = playerUI.querySelector('div.progress-bar .progress');
    const value = player.currentTime / player.duration * 100;
    progress.style.width = `${value}%`;
  }

  requestAnimationFrame(refreshClock);
};

requestAnimationFrame(refreshClock);