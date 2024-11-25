// Common references
var urlInput = document.getElementById("url-input"); // Top bar input field

async function init() {
    try {
        const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

        let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

        if (await connection.getTransport() !== "/epoxy/index.mjs") {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            console.log("Using websocket transport " + "wisp url is: " + wispUrl);
        }

        const scramjet = new ScramjetController({
            prefix: "/scramjet/service/",
            files: {
                wasm: "/scramjet/scramjet.wasm.js",
                worker: "/scramjet/scramjet.worker.js",
                client: "/scramjet/scramjet.client.js",
                shared: "/scramjet/scramjet.shared.js",
                sync: "/scramjet/scramjet.sync.js"
            },
        });
        window.sj = scramjet;
        scramjet.init("../sjsw.js");
    } catch (error) {
        console.error("Error setting up BareMux transport:", error);
    }
}
init();

// Check if the input exists and attach event listeners
if (urlInput) {
    function isUrl(val = "") {
        return /^http(s?):\/\//.test(val) || (val.includes(".") && val[0] !== " ");
    }

    async function processSearch(url) {
        if (!localStorage.getItem("proxy")) {
            localStorage.setItem("proxy", "uv");
        }

        try {
            await registerSW();
            console.log("Registering service worker...");
        } catch (err) {
            console.error("Error registering service worker:", err);
            throw err;
        }

        if (!isUrl(url)) {
            url = "https://www.google.com/search?q=" + encodeURIComponent(url);
        } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = `https://${url}`;
        }

        if (localStorage.getItem("proxy") === "uv") {
            uvEncode(url);
        } else if (localStorage.getItem("proxy") === "sj") {
            sjEncode(url);
        } else if (localStorage.getItem("proxy") === "rammerhead") {
            rhEncode(url);
        }
    }

    async function rhEncode(url) {
        url = await RammerheadEncode(url);
        window.location.href = "/" + url;
        window.location.href = "/browser.html";
        console.log("Rammerhead encoding used.");
    }

    async function uvEncode(url) {
        url = __uv$config.prefix + __uv$config.encodeUrl(url);
        localStorage.setItem("url", url);
        window.location.href = "/browser.html";
        console.log("Ultraviolet encoding used.");
    }

    async function sjEncode(url) {
        url = "/scramjet/service/" + encodeURIComponent(url);
        localStorage.setItem("url", url);
        window.location.href = "/browser.html";
        console.log("Scramjet encoding used.");
    }

    // Add listener for top bar input field
    urlInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            processSearch(urlInput.value);
        }
    });
}
