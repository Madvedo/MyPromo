document.addEventListener("DOMContentLoaded", function() {
  // Конфигурация треков
  const tracks = [
  { title: "Aritmia", src: "audio/0. Aritmia.mp3" },
  { title: "Поднимайся вновь", src: "audio/1. Поднимайся вновь.mp3" },
  { title: "Зоя", src: "audio/2. Зоя.mp3" },
  { title: "Сезон Осень", src: "audio/3. Сезон Осень.mp3" },
  { title: "Doktor.A", src: "audio/4. Doktor.A.mp3" },
  { title: "Лето", src: "audio/5. Лето.mp3" },
  { title: "Вихри", src: "audio/6. Вихри.mp3" },
  { title: "Привет", src: "audio/7. Привет.mp3" },
  { title: "Рассвет", src: "audio/8. Рассвет.mp3" },
  { title: "Холод", src: "audio/9. Холод.mp3" },
  { title: "Margaret", src: "audio/10. Margaret.mp3" }
];

  // Основные элементы
  const audio = new Audio();
  let currentTrack = 0;
  
  // Получаем элементы управления
  const playPauseBtn = document.getElementById("playPauseBtn");
  const trackList = document.getElementById("trackList");
  const seekSlider = document.getElementById("seekSlider") || (function() {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = "seekSlider";
    slider.value = "0";
    slider.min = "0";
    document.querySelector(".controls").prepend(slider);
    return slider;
  })();
  
  const trackTime = document.getElementById("trackTime") || (function() {
    const time = document.createElement("div");
    time.id = "trackTime";
    time.textContent = "0:00 / 0:00";
    document.querySelector(".controls").prepend(time);
    return time;
  })();
  
  const openPlayerBtn = document.getElementById("openPlayerBtn");
  const playerModal = document.getElementById("playerModal");
  const closePlayerBtn = document.getElementById("closePlayerBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Отрисовка списка треков
  function renderTrackList() {
    trackList.innerHTML = "";
    tracks.forEach((track, index) => {
      const li = document.createElement("li");
      li.textContent = track.title;
      if (index === currentTrack) li.classList.add("active");
      li.addEventListener("click", () => {
        currentTrack = index;
        loadTrack();
        playTrack();
      });
      trackList.appendChild(li);
    });
  }

  // Управление аудио
  function loadTrack() {
    audio.src = tracks[currentTrack].src;
    audio.load();
    renderTrackList();
  }

  function playTrack() {
    audio.play()
      .then(() => {
        playPauseBtn.innerHTML = '<img src="img/pause.png" alt="Pause">';
      })
      .catch(console.error);
  }

  function pauseTrack() {
    audio.pause();
    playPauseBtn.innerHTML = '<img src="img/play.png" alt="Play">';
  }

  function updateTime() {
    if (!isNaN(audio.duration)) {
      seekSlider.max = Math.floor(audio.duration);
      seekSlider.value = Math.floor(audio.currentTime);
      
      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      };

      trackTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  }

  // Управление модальным окном
 function openPlayer() {
    const playerModal = document.getElementById("playerModal");
    const openPlayerBtn = document.getElementById("openPlayerBtn");
    
    playerModal.style.display = "block";
    setTimeout(() => {
      playerModal.classList.add("open");
      
      // Полное скрытие кнопки (не только визуально, но и функционально)
      openPlayerBtn.style.display = "none";
      openPlayerBtn.classList.add("hidden");
    }, 10);
    
    loadTrack();
  }

  function closePlayer() {
  const playerModal = document.getElementById("playerModal");
  const openPlayerBtn = document.getElementById("openPlayerBtn");
  
  playerModal.classList.remove("open");
  
  // Мгновенное отображение кнопки ПЕРЕД анимацией закрытия плеера
  openPlayerBtn.style.display = "block";
  openPlayerBtn.classList.remove("fade-out");
  openPlayerBtn.style.opacity = "1";
  openPlayerBtn.style.pointerEvents = "auto";
  
  // Анимация закрытия плеера (не влияет на кнопку)
  setTimeout(() => {
    playerModal.style.display = "none";
  }, 500); // Только анимация закрытия модального окна
  
  pauseTrack();
}
  // Переключение треков
  function changeTrack(direction) {
    currentTrack = (currentTrack + direction + tracks.length) % tracks.length;
    loadTrack();
    playTrack();
  }

  // Назначение обработчиков событий
  openPlayerBtn.addEventListener("click", openPlayer);
  closePlayerBtn.addEventListener("click", closePlayer);
  playPauseBtn.addEventListener("click", () => audio.paused ? playTrack() : pauseTrack());
  prevBtn.addEventListener("click", () => changeTrack(-1));
  nextBtn.addEventListener("click", () => changeTrack(1));
  seekSlider.addEventListener("input", () => audio.currentTime = seekSlider.value);
  
  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("loadedmetadata", updateTime);
  audio.addEventListener("ended", () => changeTrack(1));

  // Инициализация
  renderTrackList();
});