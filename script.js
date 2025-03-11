// Settings
// =======================================================================
// =======================================================================

let language = "de"; // Default festlegen ['de', 'en'] in url: ?lang=en ODER ?language=en

let screenIntervalTime = 90; // [Sekunden]

const neulandNext_images = [
  { src: "home.png", text_de: "Home", text_en: "Home" },
  { src: "timetable2.png", text_de: "Stundenplan", text_en: "Timetable" },
  { src: "timetable.png", text_de: "Stundenplan", text_en: "Timetable" },
  { src: "map.png", text_de: "Karte", text_en: "Map" },
  { src: "food.png", text_de: "Essen", text_en: "Food" },
  { src: "news.png", text_de: "News", text_en: "News" },
  { src: "events.png", text_de: "Events", text_en: "Events" },
  { src: "roomsearch.png", text_de: "Raumsuche", text_en: "Room Search" },
  // {src: "library.png", text_de: "Bibliothek", text_en: "Library"},
];
const neulandNext_intervalTime =
  screenIntervalTime / 2 / neulandNext_images.length; // [Sekunden] in url: ?time=5
const neulandNext_frame = false; // Bilder in iP frame

// Vars
// =======================================================================
// =======================================================================

let screens = document.querySelectorAll(".screen");
let screenIndex = 0;

let neulandNext_currentIndex = 0;
let neulandNext_progressBars;

// functions
// =======================================================================
// =======================================================================

function init() {
  readUrl();

  screesHideAll();
  screenToggleCurrent();
  setInterval(screenNext, screenIntervalTime * 1000);

  document.documentElement.style.setProperty(
    "--neulandNext_animationTime",
    `${neulandNext_intervalTime}s`
  );

  if (neulandNext_frame) {
    document
      .getElementById("neulandNext_frameImg")
      .style.removeProperty("display");
  }

  neulandNext_summonProgressbars();

  neulandNext_progressBars = document.querySelectorAll(
    ".neulandNext_progressbar"
  );

  // Startet die Slideshow
  neulandNext_updateSlideshow();
  setInterval(neulandNext_updateSlideshow, neulandNext_intervalTime * 1000);
}
init();

function readUrl() {
  let urlVars = window.location.search.split("?")[1];
  if (urlVars != undefined) {
    urlVars = urlVars.split("&");
    for (let index = 0; index < urlVars.length; index++) {
      if (urlVars[index].split("=")[0] == "time") {
        screenIntervalTime = urlVars[index].split("=")[1];
      }
      if (urlVars[index].split("=")[0] == "lang") {
        language = urlVars[index].split("=")[1];
      }
      if (urlVars[index].split("=")[0] == "language") {
        language = urlVars[index].split("=")[1];
      }
    }
  }
}

function screesHideAll() {
  screens.forEach((screen) => {
    screen.style.display = "none";
  });
}

function screenToggleCurrent() {
  if (screens[screenIndex].style.display == "none") {
    screens[screenIndex].style.removeProperty("display");
  } else {
    screens[screenIndex].style.display = "none";
  }
}
function screenIndex_plus() {
  screenIndex = (screenIndex + 1) % screens.length;
}
function screenIndex_minus() {
  screenIndex = (screens.length + screenIndex - 1) % screens.length;
}
function screenNext() {
  screenToggleCurrent();
  screenIndex_plus();
  screenToggleCurrent();
}
function screenPrevious() {
  screenToggleCurrent();
  screenIndex_minus();
  screenToggleCurrent();
}

function neulandNext_summonProgressbars() {
  for (let index = 0; index < neulandNext_images.length; index++) {
    const code = `<div class="neulandNext_progressbar"> <div> <div></div> </div> </div>`;
    document
      .getElementById("neulandNext_progressbarContainer")
      .insertAdjacentHTML("beforeend", code);
  }
}

function neulandNext_updateSlideshow() {
  const imageElement = document.getElementById("neulandNext_slideshowImage");
  const textElement = document.getElementById("neulandNext_imagetext");

  // Setzt das neue Bild und den neuen Text
  imageElement.src = `imgs/${language}/${neulandNext_images[neulandNext_currentIndex].src}`;
  textElement.textContent =
    neulandNext_images[neulandNext_currentIndex][`text_${language}`];

  // Setzt alle Progress Bars zurück
  if (neulandNext_currentIndex == 0) {
    neulandNext_progressBars.forEach((bar, index) => {
      bar.classList.remove("neulandNext_progressbarCurrent");
    });

    void neulandNext_progressBars[0].offsetWidth; // Dies erzwingt einen Reflow und startet die Animation neu
  }

  // Aktualisiert die Progress Bars
  neulandNext_progressBars.forEach((bar, index) => {
    if (index == neulandNext_currentIndex) {
      bar.classList.add("neulandNext_progressbarCurrent");
    } else if (index > neulandNext_currentIndex) {
      bar.classList.remove("neulandNext_progressbarCurrent");
    }
  });

  // Erhöht den Index für das nächste Bild
  neulandNext_currentIndex =
    (neulandNext_currentIndex + 1) % neulandNext_images.length;
}

document.addEventListener("keydown", (event) => {
  console.log(event.key);

  //* Number Keys
  if (!isNaN(Number(event.key))) {
    screenToggleCurrent();
    screenIndex = Number(event.key) % screens.length;
    screenToggleCurrent();
    return;
  }

  //* Pfeiltasten
  if (event.key === "ArrowLeft") {
    screenPrevious();
    return;
  }
  if (event.key === "ArrowRight") {
    screenNext();
    return;
  }
});
