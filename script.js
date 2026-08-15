const viewport = document.querySelector(".viewport");
const sceneStage = document.querySelector(".scene-stage");
const entryObjects = document.querySelectorAll(".entry-object");
const view1Button = document.querySelector(".view1-button");

const sceneSize = {
  width: 3840,
  height: 1462,
};

const cameraSize = {
  width: 1920,
  height: 1080,
};

const cameras = {
  cover: {
    x: 0,
    y: sceneSize.height - cameraSize.height,
  },
  entrance: {
    x: 1920,
    y: 0,
  },
};

const transitionMs = 1100;
const transitionTiming = "cubic-bezier(0.65, 0, 0.35, 1)";

let currentView = "cover";
let currentCamera = cameras.cover;
let isTransitioning = false;
let transitionTimer = 0;

function shouldOpenEntrance() {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") === "entrance";
}

function cleanEntranceUrl() {
  if (window.location.search.includes("view=entrance")) {
    window.history.replaceState(null, "", window.location.pathname);
  }
}

function getScale() {
  return Math.max(
    window.innerWidth / cameraSize.width,
    window.innerHeight / cameraSize.height
  );
}

function getTransform(camera) {
  const scale = getScale();
  const centerX = (window.innerWidth - cameraSize.width * scale) / 2;
  const centerY = (window.innerHeight - cameraSize.height * scale) / 2;
  const x = centerX - camera.x * scale;
  const y = centerY - camera.y * scale;

  return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
}

function positionCamera(camera, animated = false) {
  currentCamera = camera;
  sceneStage.style.transition = animated
    ? `transform ${transitionMs}ms ${transitionTiming}`
    : "none";
  sceneStage.style.transform = getTransform(camera);
}

function setCoverState() {
  currentView = "cover";
  isTransitioning = false;
  viewport.classList.remove("is-entered", "can-interact", "is-transitioning");
}

function setEntranceState() {
  currentView = "entrance";
  isTransitioning = false;
  viewport.classList.remove("is-transitioning");
  viewport.classList.add("is-entered", "can-interact");
}

function finishTransition(targetView) {
  clearTimeout(transitionTimer);
  if (targetView === "entrance") {
    setEntranceState();
  } else {
    setCoverState();
  }
}

function animateTo(targetView) {
  if (isTransitioning || currentView === targetView) {
    return;
  }

  isTransitioning = true;
  viewport.classList.remove("can-interact");
  viewport.classList.add("is-transitioning");

  const targetCamera = targetView === "entrance" ? cameras.entrance : cameras.cover;
  positionCamera(targetCamera, true);

  clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => finishTransition(targetView), transitionMs + 80);
}

function enterPortfolio() {
  if (currentView !== "cover") {
    return;
  }
  animateTo("entrance");
}

function returnToCover() {
  if (currentView !== "entrance") {
    return;
  }
  animateTo("cover");
}

window.addEventListener("resize", () => {
  positionCamera(currentCamera, false);
});

viewport.addEventListener("click", enterPortfolio);
viewport.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && currentView === "cover") {
    event.preventDefault();
    enterPortfolio();
  }
});

sceneStage.addEventListener("transitionend", (event) => {
  if (event.propertyName === "transform" && isTransitioning) {
    const targetView = currentCamera === cameras.entrance ? "entrance" : "cover";
    finishTransition(targetView);
  }
});

view1Button?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!viewport.classList.contains("can-interact")) {
    return;
  }
  returnToCover();
});

entryObjects.forEach((entry) => {
  entry.addEventListener("click", (event) => {
    if (!viewport.classList.contains("can-interact")) {
      return;
    }

    event.stopPropagation();
    entry.classList.add("is-clicked");
    window.setTimeout(() => {
      entry.classList.remove("is-clicked");
    }, 180);

    if (entry.dataset.href) {
      window.history.replaceState(null, "", `${window.location.pathname}?view=entrance`);
      if (window.PageTransition) {
        window.PageTransition.goTo(entry.dataset.href);
      } else {
        window.location.href = entry.dataset.href;
      }
    }
  });
});

viewport.tabIndex = 0;

if (shouldOpenEntrance()) {
  positionCamera(cameras.entrance, false);
  setEntranceState();
  cleanEntranceUrl();
} else {
  positionCamera(cameras.cover, false);
  setCoverState();
}
