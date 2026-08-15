(function () {
  const page = document.querySelector(".page-7");
  const button = document.querySelector(".p7-watch");
  const video = document.querySelector(".p7-video");

  if (!page || !button || !video) return;

  let playTimer = 0;
  let restoreTimer = 0;

  video.removeAttribute("poster");

  function restoreCover() {
    window.clearTimeout(playTimer);
    window.clearTimeout(restoreTimer);
    playTimer = 0;
    restoreTimer = 0;
    video.pause();
    page.classList.remove("video-playing", "video-ending", "video-hidden");
  }

  button.addEventListener("click", () => {
    window.clearTimeout(playTimer);
    window.clearTimeout(restoreTimer);
    video.style.visibility = "hidden";
    video.pause();
    try {
      video.currentTime = 0;
    } catch (_error) {
      // Keep the interaction stable if metadata is not loaded yet.
    }
    page.classList.remove("video-playing", "video-ending", "video-hidden");

    playTimer = window.setTimeout(() => {
      page.classList.add("video-playing");
      video.style.visibility = "";
      const playResult = video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(() => {
          page.classList.remove("video-playing");
        });
      }
      playTimer = 0;
    }, 100);
  });

  video.addEventListener("ended", () => {
    video.pause();
    video.removeAttribute("poster");
    video.style.visibility = "hidden";
    page.classList.add("video-ending", "video-hidden");
    restoreTimer = window.setTimeout(restoreCover, 200);
  });
})();
