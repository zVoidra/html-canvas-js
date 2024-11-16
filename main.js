import "./index.css";

async function loadContent(path) {
  const relativePath = "/source/pages/" + path + "/" + path + ".html";
  try {
    const view = await fetch(relativePath).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load ${relativePath}: ${res.statusText}");
      }
      return res.text();
    });
    console.log(relativePath);
    document.getElementById("app").innerHTML = view;
  } catch (error) {
    console.error(error);
    document.getElementById("app").innerHTML = "<h1>Page not found.</h1>";
  }
}

function router() {
  const routes = {
    "/": "home",
    "/sol": "sol",
  };

  const path = window.location.pathname;
  const route = routes[path] || "home";
  loadContent(route);
}

function navigate(path) {
  window.history.pushState({}, "", path);
  router();
}

window.addEventListener("DOMContentLoaded", () => {
  router();

  document.querySelectorAll("a[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      navigate(href);
    });
  });
});

window.addEventListener("popstate", router);
