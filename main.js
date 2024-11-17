import "./index.css";

async function loadScript(jsFilePath) {
  // Check if the script is already loaded
  let existingScript = document.querySelector(`script[src="${jsFilePath}"]`);

  if (existingScript) {
    console.log(`Script ${jsFilePath} already loaded.`);

    // Dynamically import the module and reinitialize
    try {
      const module = await import(`${jsFilePath}?v=${Date.now()}`); // Use cache-busting to ensure the latest version
      if (module.init) {
        module.init(); // Call the init function if available
        console.log(`Reinitialized script: ${jsFilePath}`);
      } else {
        console.warn(`No init() function exported from ${jsFilePath}`);
      }
    } catch (error) {
      console.error(`Failed to reinitialize ${jsFilePath}:`, error);
    }
    return;
  }

  // If the script doesn't exist, create and load it
  const script = document.createElement("script");
  script.src = jsFilePath;
  script.type = "module";

  // Append script and dynamically import after load
  script.onload = async () => {
    try {
      const module = await import(jsFilePath);
      if (module.init) {
        module.init(); // Call the init function if available
        console.log(`Initialized script: ${jsFilePath}`);
      }
    } catch (error) {
      console.error(`Failed to initialize ${jsFilePath}:`, error);
    }
  };

  script.onerror = () => {
    console.error(`Failed to load script: ${jsFilePath}`);
  };

  document.body.appendChild(script);
}

async function loadContent(path) {
  const relativePath = "/source/pages/" + path + "/";
  const htmlFilePath = relativePath + path + ".html";
  try {
    const view = await fetch(htmlFilePath)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load ${relativePath}: ${res.statusText}");
        }
        return res.text();
      })
      .then((html) => {
        document.getElementById("app").innerHTML = html;

        const jsFilePath = relativePath + path + ".js";
        loadScript(jsFilePath);
      });
  } catch (error) {
    console.error(error);
    document.getElementById("app").innerHTML = "<h1>Page not found.</h1>";
  }
}

function router() {
  const routes = {
    "": "home",
    home: "home",
    sol: "sol",
    clock: "clock",
    panorama: "panorama",
    lines: "lines",
  };

  const hash = window.location.hash.slice(1); // Remove the '#' from the hash
  const route = routes[hash] || "home";
  loadContent(route);
}

function navigate(path) {
  window.location.hash = path; // Update the hash
}

window.addEventListener("DOMContentLoaded", () => {
  router();

  document.querySelectorAll("a[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = e.target.getAttribute("href").slice(1); // Remove the leading '#'
      navigate(href);
    });
  });
});

window.addEventListener("hashchange", router);
