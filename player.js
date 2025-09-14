document.addEventListener("DOMContentLoaded", function() {
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

  const audio = new Audio();
  let currentTrack = 0;

  const stopBtn = document.getElementById("stopBtn");
const homeBtn = document.getElementById("homeBtn");

  const playPauseBtn = document.getElementById("playPauseBtn");
  const trackList = document.getElementById("trackList");
  const seekSlider = document.getElementById("seekSlider");
  const trackTime = document.getElementById("trackTime");

  const openPlayerBtn = document.getElementById("openPlayerBtn");
  const playerModal = document.getElementById("playerModal");
  const closePlayerBtn = document.getElementById("closePlayerBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const miniControls = document.getElementById("miniControls");
  const miniPrevBtn = document.getElementById("miniPrevBtn");
  const miniPlayPauseBtn = document.getElementById("miniPlayPauseBtn");
  const miniNextBtn = document.getElementById("miniNextBtn");

  const backgroundAudio = document.getElementById("backgroundAudio");
  function playRandomBackgroundTrack() {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    backgroundAudio.src = tracks[randomIndex].src;
    backgroundAudio.play().catch(() => {});
  }
  playRandomBackgroundTrack();

  function renderTrackList() {
    trackList.innerHTML = "";
    tracks.forEach((track, index) => {
      const li = document.createElement("li");
      li.textContent = track.title;
      if (index === currentTrack) li.classList.add("active");

      li.addEventListener("click", () => {
        if (currentTrack === index) {
          if (audio.paused) {
            playTrack();
          } else {
            pauseTrack();
          }
        } else {
          currentTrack = index;
          loadTrack();
          playTrack();
        }
      });

      trackList.appendChild(li);
    });
  }

  function loadTrack() {
    audio.src = tracks[currentTrack].src;
    audio.load();
    renderTrackList();
  }

  function playTrack() {
    backgroundAudio.pause();
    audio.play().then(() => {
      playPauseBtn.innerHTML = '<img src="img/pause.png" alt="Pause">';
      miniPlayPauseBtn.querySelector("img").src = "img/pause.png";
    });
  }

  function pauseTrack() {
    audio.pause();
    playPauseBtn.innerHTML = '<img src="img/play.png" alt="Play">';
    miniPlayPauseBtn.querySelector("img").src = "img/play.png";
  }

  function updateTime() {
    if (!isNaN(audio.duration)) {
      seekSlider.max = Math.floor(audio.duration);
      seekSlider.value = Math.floor(audio.currentTime);

      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      };

      trackTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  }

  function changeTrack(direction) {
    currentTrack = (currentTrack + direction + tracks.length) % tracks.length;
    loadTrack();
    playTrack();
  }

  function openPlayer() {
    playerModal.style.display = "block";
    setTimeout(() => {
      playerModal.classList.add("open");
      openPlayerBtn.style.display = "none";
      miniControls.style.display = "none";
    }, 10);

    if (!audio.src) loadTrack();
  }

  function closePlayer() {
    playerModal.classList.remove("open");
    openPlayerBtn.style.display = "inline-block";
    miniControls.style.display = "inline-flex";

    setTimeout(() => {
      playerModal.style.display = "none";
    }, 500);
  }

  miniPrevBtn.addEventListener("click", () => changeTrack(-1));
  miniPlayPauseBtn.addEventListener("click", () => audio.paused ? playTrack() : pauseTrack());
  miniNextBtn.addEventListener("click", () => changeTrack(1));

  openPlayerBtn.addEventListener("click", openPlayer);
  closePlayerBtn.addEventListener("click", closePlayer);
  playPauseBtn.addEventListener("click", () => audio.paused ? playTrack() : pauseTrack());
  prevBtn.addEventListener("click", () => changeTrack(-1));
  nextBtn.addEventListener("click", () => changeTrack(1));
  seekSlider.addEventListener("input", () => (audio.currentTime = seekSlider.value));

  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("loadedmetadata", updateTime);
  audio.addEventListener("ended", () => changeTrack(1));

 // 🔇 Стоп — останавливает и фон, и плеер
stopBtn.addEventListener("click", () => {
  // Фоновый трек
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }

  // Музыка из плеера
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    playPauseBtn.innerHTML = `<img src="img/play.png" alt="Play">`;
    document.getElementById("miniPlayPauseBtn").innerHTML =
      `<img src="img/play.png" alt="Play">`;
  }
});

// 🏠 На главную
homeBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

  renderTrackList();
});
