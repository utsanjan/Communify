var preloader = document.querySelector(".preloader");

function hidePreloader() {
  if (!preloader) return;
  preloader.classList.add("hide");
}

window.addEventListener("load", hidePreloader);
setTimeout(hidePreloader, 2500);
