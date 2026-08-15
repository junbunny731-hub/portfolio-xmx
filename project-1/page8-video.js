(function () {
  const page = document.querySelector(".page-8");
  const openButton = document.querySelector(".p8-watch");
  const playHistoryButton = document.querySelector(".p8-play-history");
  const playViewButton = document.querySelector(".p8-play-view");
  const exitButton = document.querySelector(".p8-exit-video");
  const videos = [
    document.querySelector(".p8-video1"),
    document.querySelector(".p8-video2"),
  ].filter(Boolean);

  if (!page || !openButton || !playHistoryButton || !playViewButton || !exitButton || videos.length < 2) return;

  let openTimer = 0;
  let exitTimer = 0;
  let restoreTimer = 0;
  let idleTimer = 0;
  let activeVideo = null;

  function clearTimers() {
    window.clearTimeout(openTimer);
    window.clearTimeout(exitTimer);
    window.clearTimeout(restoreTimer);
    window.clearTimeout(idleTimer);
    openTimer = 0;
    exitTimer = 0;
    restoreTimer = 0;
    idleTimer = 0;
  }

  function hideAllVideos() {
    videos.forEach((video) => {
      video.pause();
      video.classList.remove("is-active");
      video.style.visibility = "hidden";
    });
    activeVideo = null;
  }

  function resetVideoPosition(video) {
    try {
      video.currentTime = 0;
    } catch (_error) {
      // Metadata may not be ready on first interaction.
    }
  }

  function showCover() {
    clearTimers();
    hideAllVideos();
    page.classList.remove("video-ui-visible", "video-playing", "video-ending", "video-hidden");
  }

  function startIdleTimer() {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(showCover, 10000);
  }

  function showVideoUi() {
    hideAllVideos();
    page.classList.remove("video-playing", "video-ending", "video-hidden");
    page.classList.add("video-ui-visible");
    startIdleTimer();
  }

  function playVideo(video) {
    if (!page.classList.contains("video-ui-visible")) return;

    window.clearTimeout(idleTimer);
    window.clearTimeout(restoreTimer);
    page.classList.remove("video-ending", "video-hidden");
    page.classList.add("video-playing");
    hideAllVideos();
    activeVideo = video;
    activeVideo.classList.add("is-active");
    resetVideoPosition(activeVideo);

    requestAnimationFrame(() => {
      activeVideo.style.visibility = "";
      const playResult = activeVideo.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(showVideoUi);
      }
    });
  }

  openButton.addEventListener("click", () => {
    clearTimers();
    openTimer = window.setTimeout(showVideoUi, 100);
  });

  playHistoryButton.addEventListener("click", () => playVideo(videos[0]));
  playViewButton.addEventListener("click", () => playVideo(videos[1]));

  exitButton.addEventListener("click", () => {
    if (!page.classList.contains("video-ui-visible")) return;
    window.clearTimeout(exitTimer);
    exitTimer = window.setTimeout(showCover, 100);
  });

  videos.forEach((video) => {
    video.addEventListener("ended", () => {
      video.pause();
      video.style.visibility = "hidden";
      page.classList.add("video-ending", "video-hidden");
      restoreTimer = window.setTimeout(showVideoUi, 200);
    });
  });
})();
