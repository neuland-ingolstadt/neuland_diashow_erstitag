// Settings
// =======================================================================
// =======================================================================

let language = "de"; // Default festlegen ['de', 'en'] in url: ?lang=en ODER ?language=en

let screenIntervalTime = 30; // [Sekunden]

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

const events_images = [
  {
    src: "infoveranstaltung.png",
    text: "Infoveranstaltung",
  },
  { src: "stammtisch.jpg", text: "Stammtisch" },
  { src: "brettspielabend.jpg", text: "Spieleabend" },
  {
    src: "lanparty.jpeg",
    text: "LAN-Party mit HGI",
  },
  {
    src: "docker.png", //! Logo
    text: "Docker-Workshop",
  },
  { src: "cookietalks.jpeg", text: "Cookie Talks" }, //! bild von Software Testing Workshop
  {
    src: "3d_druck_workshop.jpg",
    text: "3D-Druck-Workshop",
  },
  { src: "hackathon.jpeg", text: "App Hackathon" },
  { src: "latex.png", text: "LaTeX Workshop" }, //! Logo
];

// Vars
// =======================================================================
// =======================================================================

let screenInterval;
let screens = document.querySelectorAll(".screen");
let screenIndex = 0;

let neulandNext_currentIndex = 0;
let neulandNext_progressBars;

let events_currentIndex = 0;
let events_progressBars;

// functions
// =======================================================================
// =======================================================================

function init() {
  readUrl();

  screesHideAll();
  screenToggleCurrent();
  setScreenInterval();

  //* Diashow Neuland
  {
    const wieOftPro_screenIntervalTime = 2;
    const intervalTime =
      screenIntervalTime /
      wieOftPro_screenIntervalTime /
      neulandNext_images.length;
    document.documentElement.style.setProperty(
      "--neulandNext_animationTime",
      `${intervalTime}s`
    );

    summonProgressbars({
      count: neulandNext_images.length,
      id: "neulandNext_progressbarContainer",
    });
    neulandNext_progressBars = document.querySelectorAll(
      "#screen_neulandNext .progressbar"
    );

    // Startet die Slideshow
    neulandNext_updateSlideshow();
    setInterval(neulandNext_updateSlideshow, intervalTime * 1000);
  }

  //* Diashow Events
  {
    const wieOftPro_screenIntervalTime = 2;
    const intervalTime =
      screenIntervalTime / wieOftPro_screenIntervalTime / events_images.length;
    document.documentElement.style.setProperty(
      "--events_animationTime",
      `${intervalTime}s`
    );

    summonProgressbars({
      count: events_images.length,
      id: "events_progressbarContainer",
    });
    events_progressBars = document.querySelectorAll(
      "#screen_events .progressbar"
    );

    // Startet die Slideshow
    events_updateSlideshow();
    setInterval(events_updateSlideshow, intervalTime * 1000);
  }
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

// Screens
// =======================================================================
// =======================================================================

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
function screenNext_body() {
  if (window.innerWidth < 1200) {
    screenNext();
  }
}

function setScreenInterval() {
  screenInterval = setInterval(screenNext, screenIntervalTime * 1000);
}
function resetScreenInterval() {
  clearInterval(screenInterval);
  setScreenInterval();
}

// Diashow
// =======================================================================
// =======================================================================

function summonProgressbars({ count, id }) {
  console.log(id);
  for (let index = 0; index < count; index++) {
    const code = `<div class="progressbar"> <div> <div></div> </div> </div>`;
    document.getElementById(id).insertAdjacentHTML("beforeend", code);
  }
}

function neulandNext_updateSlideshow() {
  const imageElement = document.getElementById("neulandNext_diashow_img");
  const textElement = document.getElementById("neulandNext_imagetext");

  // Setzt das neue Bild und den neuen Text
  imageElement.src = `imgs/${language}/${neulandNext_images[neulandNext_currentIndex].src}`;
  textElement.textContent =
    neulandNext_images[neulandNext_currentIndex][`text_${language}`];

  // Setzt alle Progress Bars zurück
  if (neulandNext_currentIndex == 0) {
    neulandNext_progressBars.forEach((bar, index) => {
      bar.classList.remove("progressbarCurrent");
    });

    void neulandNext_progressBars[0].offsetWidth; // Dies erzwingt einen Reflow und startet die Animation neu
  }

  // Aktualisiert die Progress Bars
  neulandNext_progressBars.forEach((bar, index) => {
    if (index == neulandNext_currentIndex) {
      bar.classList.add("progressbarCurrent");
    } else if (index > neulandNext_currentIndex) {
      bar.classList.remove("progressbarCurrent");
    }
  });

  // Erhöht den Index für das nächste Bild
  neulandNext_currentIndex =
    (neulandNext_currentIndex + 1) % neulandNext_images.length;
}

function events_updateSlideshow() {
  const imageElement = document.getElementById("events_diashow_img");
  const textElement = document.getElementById("events_imagetext");

  // Setzt das neue Bild und den neuen Text
  imageElement.src = `https://kevinploss.de/neuland_diashow/imgs/events/${events_images[events_currentIndex].src}`;
  textElement.textContent = events_images[events_currentIndex]["text"];

  // Setzt alle Progress Bars zurück
  if (events_currentIndex == 0) {
    events_progressBars.forEach((bar, index) => {
      bar.classList.remove("progressbarCurrent");
    });

    void events_progressBars[0].offsetWidth; // Dies erzwingt einen Reflow und startet die Animation neu
  }

  // Aktualisiert die Progress Bars
  events_progressBars.forEach((bar, index) => {
    if (index == events_currentIndex) {
      bar.classList.add("progressbarCurrent");
    } else if (index > events_currentIndex) {
      bar.classList.remove("progressbarCurrent");
    }
  });

  events_currentIndex = (events_currentIndex + 1) % events_images.length;
}

// Input
// =======================================================================
// =======================================================================

document.addEventListener("keydown", (event) => {
  // console.log(event.key);

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
