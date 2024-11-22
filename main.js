import * as HomePage from "./src/pages/home/home.js";
import * as SolPage from "./src/pages/sol/sol.js";
import * as ClockPage from "./src/pages/clock/clock.js";
import * as PanoramaPage from "./src/pages/panorama/panorama.js";
import * as LinesPage from "./src/pages/lines/lines.js";

const routes = {
  "/": HomePage,
  sol: SolPage,
  clock: ClockPage,
  panorama: PanoramaPage,
  lines: LinesPage,
};

async function loadContent(route) {
  const module = routes[route] || routes["/"];
  document.getElementById("app").innerHTML = module.HTML;

  if (module.init) {
    module.init();
  } else {
    console.warn(`No init function for route: ${route}`);
  }
}

function router() {
  const hash = window.location.hash.slice(2);
  loadContent(hash || "/");
}

function navigate(path) {
  window.location.hash = `#/${path}`;
}

function attachLinkEvents() {
  document.querySelectorAll("a[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = e.target.getAttribute("href").slice(2);
      navigate(href);
    });
  });
}

// Initialize router on page load and hash change
window.addEventListener("DOMContentLoaded", () => {
  router();
  attachLinkEvents();
});
window.addEventListener("hashchange", router);
