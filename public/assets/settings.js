// Get references to dropdowns
var proxySelect = document.getElementById("proxy-select");
var wispSelect = document.getElementById("wisp-select");
var themeSelect = document.getElementById("theme-select");
var urlInput = document.getElementById("url-input"); // For top bar search input

// Proxy settings
if (proxySelect) {
  proxySelect.value = localStorage.getItem("proxy") || "uv";
  proxySelect.addEventListener("change", function () {
    const selectedProxy = proxySelect.value;
    localStorage.setItem("proxy", selectedProxy);
    console.log(`Proxy selected: ${selectedProxy}`);
  });
}

// Theme settings
if (themeSelect) {
  themeSelect.value = localStorage.getItem("theme") || "black";
  applyTheme(themeSelect.value); // Apply theme on page load

  themeSelect.addEventListener("change", function () {
    const selectedTheme = themeSelect.value;
    localStorage.setItem("theme", selectedTheme);
    applyTheme(selectedTheme); // Apply theme on change
  });
}

// Wisp settings
if (wispSelect) {
  const defaultWispUrl =
    (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

  wispSelect.value = localStorage.getItem("wisp") === defaultWispUrl ? "default" : "tp";

  wispSelect.addEventListener("change", function () {
    if (wispSelect.value === "default") {
      localStorage.setItem("wisp", defaultWispUrl);
      console.log("Wisp set to default.");
    } else if (wispSelect.value === "tp") {
      const wispUrl = prompt("Enter your WISP URL:");
      if (wispUrl) {
        localStorage.setItem("wisp", wispUrl);
        console.log(`Wisp set to: ${wispUrl}`);
      }
    }
  });
}

// Apply the selected theme
function applyTheme(theme) {
  const body = document.body;
  if (theme === "black") {
    body.style.backgroundColor = "rgb(0, 0, 0)";
    body.style.color = "rgb(255, 255, 255)";
  } else if (theme === "blue") {
    body.style.backgroundColor = "#073673";
    body.style.color = "rgb(255, 255, 255)";
  } else if (theme === "purple") {
    body.style.backgroundColor = "#20124d";
    body.style.color = "rgb(255, 255, 255)";
  }
}

// Settings content
let settingsContent = {
  general: `
    <h1>General Settings</h1>
    <p>Configure your general preferences here.</p>
  `,
  themes: `
    <h1>Themes</h1>
    <p>Customize the look and feel of your app here.</p>
    <div class="settings-item" id="theme">
      <h1 class="proxytitle">Themes</h1>
      <select id="theme-select">
        <option value="black">Black</option>
        <option value="blue">Blue</option>
        <option value="purple">Purple</option>
      </select>
    </div>
  `,
  advanced: `
    <div class="settings-item" id="proxy">
      <h1 class="proxytitle">Proxy</h1>
      <select id="proxy-select">
        <option value="uv">Ultraviolet</option>
        <option value="sj">Scramjet</option>
        <option value="rammerhead">Rammerhead</option>
      </select>
    </div>
    <div class="settings-item" id="wisp">
      <h1 class="proxytitle">Wisp</h1>
      <select id="wisp-select">
        <option value="default">Default</option>
        <option value="tp">Third-Party</option>
      </select>
    </div>
  `,
};

// Add event listeners to settings buttons
document.querySelectorAll(".settings-button").forEach((button) => {
  button.addEventListener("click", () => {
    const contentKey = button.getAttribute("data-content");
    const settingsDiv = document.querySelector(".settings");

    if (settingsContent[contentKey]) {
      settingsDiv.innerHTML = settingsContent[contentKey];
      console.log(`Loading content for: ${contentKey}`);

      // Reattach listeners after content load
      if (contentKey === "themes") {
        themeSelect = document.getElementById("theme-select");
        themeSelect.value = localStorage.getItem("theme") || "black";
        themeSelect.addEventListener("change", function () {
          const selectedTheme = themeSelect.value;
          localStorage.setItem("theme", selectedTheme);
          applyTheme(selectedTheme);
        });
      }

      if (contentKey === "advanced") {
        proxySelect = document.getElementById("proxy-select");
        proxySelect.value = localStorage.getItem("proxy") || "uv";
        proxySelect.addEventListener("change", function () {
          const selectedProxy = proxySelect.value;
          localStorage.setItem("proxy", selectedProxy);
          console.log(`Proxy selected: ${selectedProxy}`);
        });

        wispSelect = document.getElementById("wisp-select");
        const defaultWispUrl =
          (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        wispSelect.value = localStorage.getItem("wisp") === defaultWispUrl ? "default" : "tp";
        wispSelect.addEventListener("change", function () {
          if (wispSelect.value === "default") {
            localStorage.setItem("wisp", defaultWispUrl);
            console.log("Wisp set to default.");
          } else if (wispSelect.value === "tp") {
            const wispUrl = prompt("Enter your WISP URL:");
            if (wispUrl) {
              localStorage.setItem("wisp", wispUrl);
              console.log(`Wisp set to: ${wispUrl}`);
            }
          }
        });
      }
    } else {
      settingsDiv.innerHTML = "<h1>Not Found</h1>";
      console.error(`Content not found for key: ${contentKey}`);
    }
  });
});

// Top Bar Search Handling
if (urlInput) {
  urlInput.addEventListener("input", function (event) {
    const query = urlInput.value.trim();
    if (query) {
      if (isUrl(query)) {
        // Handle URL input
        window.location.href = normalizeUrl(query);
      } else {
        // Handle search query (like Google search)
        window.location.href = `https://www.google.com/search?q=${query}`;
      }
    }
  });
}

// Function to check if the input is a valid URL
function isUrl(val) {
  const pattern = /^(http(s?):\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}([\/\w .-]*)*\/?$/i;
  return pattern.test(val);
}

// Normalize URL if it’s not a full URL (i.e., missing protocol)
function normalizeUrl(url) {
  if (!(url.startsWith("https://") || url.startsWith("http://"))) {
    return "https://" + url;
  }
  return url;
}
