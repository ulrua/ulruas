const frame = document.querySelector("iframe");
const loadingScreen = document.querySelector(".loading-screen");
const navbar = document.querySelector(".navbar");

const targetUrl = "https://streamm4u.com.co/"; 

navbar.style.display = "none";
frame.style.display = "none";

function preloadResources(url) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = url;
    link.as = "fetch";
    document.head.appendChild(link);
}

function showLoadingScreen() {
    loadingScreen.style.display = "flex";
    loadingScreen.querySelector(".loading-text").textContent = "Loading...";
}

function hideLoadingScreen() {
    loadingScreen.querySelector(".loading-text").textContent = "Ready.";
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 2000);
}

function getUrlWithDelay(url) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(__uv$config.prefix + __uv$config.encodeUrl(url));
        }, 0);
    });
}

function updateTitleAndIcon() {
    try {
        const iframeDocument = frame.contentDocument || frame.contentWindow.document;
        if (iframeDocument) {
            const iframeTitle = iframeDocument.title;
            if (iframeTitle && document.title !== iframeTitle) {
                document.title = iframeTitle;
            }
            const iframeIconLink =
                iframeDocument.querySelector("link[rel~='icon']") ||
                iframeDocument.querySelector("link[rel~='shortcut icon']");
            if (iframeIconLink) {
                updateFavicon(iframeIconLink.href);
            }
        }
    } catch (error) {
        console.error("Error accessing iframe content:", error);
    }
}

function updateFavicon(iconUrl) {
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    if (favicon.href !== iconUrl) {
        favicon.href = iconUrl;
    }
}

async function autoNavigate() {
    const encodedUrl = await getUrlWithDelay(targetUrl);
    preloadResources(encodedUrl);
    showLoadingScreen();

    frame.style.display = "block";
    frame.src = encodedUrl;

    frame.onload = () => {
        hideLoadingScreen();
        navbar.style.display = "block";
    };
}

window.addEventListener("load", autoNavigate);

setInterval(updateTitleAndIcon, 100);
