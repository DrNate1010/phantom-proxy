var form = document.getElementById("form");
var input = document.getElementById("input");




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

if (form && input) {
    form.addEventListener("submit", async (event) => {


        function isUrl(val = "") {
            if (
                /^http(s?):\/\//.test(val) ||
                (val.includes(".") && val.substr(0, 1) !== " ")
            ) {
                return true;
            }
            return false;
        }

        event.preventDefault();

        if (!localStorage.getItem("proxy")) {
            localStorage.setItem("proxy", "uv");
        }

        try {
            await registerSW();

            console.log("Registering service worker...");
        } catch (err) {
            err.textContent = err.toString();
            throw err;
        }
        var url = input.value;

        if (!isUrl(url)) {
            url = "https://www.google.com/search?q=" + url;
        } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = `https://${url}`;
        }

        if (localStorage.getItem("proxy") == "uv") {
            uvEncode();
        }
        else if (localStorage.getItem("proxy") == "sj") {
            sjEncode();
        }
        else if (localStorage.getItem("proxy") == "rammerhead") {
            rhEncode();
        }


        async function rhEncode() {
            url = await RammerheadEncode(url);
            window.location.href = "/" + url;
            window.location.href = "/browser.html";
            console.log('van is retarded');
        }
        async function uvEncode() {
            url = __uv$config.prefix + __uv$config.encodeUrl(url);
            localStorage.setItem("url", url);
            window.location.href = "/browser.html";
            console.log('van is retarded');
        }
        async function sjEncode() {
            url = "/scramjet/service/" + encodeURIComponent(url);
            localStorage.setItem("url", url);
            window.location.href = "/browser.html";
            console.log('van is retarded');
        }
    });

}

