const containerEl = document.querySelector(".container");
const btnEl = document.querySelector(".btn");
const popupContainerEl = document.querySelector(".popup-container");
const closeIconEl = document.querySelector(".close-icon");
const preloader = document.querySelector(".preloader");
const preloaderDuration = 400;
containerEl.classList.add("active");
popupContainerEl.classList.remove("active");
const hidePreloader = () => {
  setTimeout(() => {
      preloader.classList.add("hide");
  }, preloaderDuration);
}
window.addEventListener("load", hidePreloader);
