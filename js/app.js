
/* =========================================
   CGG HSE Digital Ecosystem
   Core Bootstrap v1.0
   ========================================= */

const APP = {
    name: "CGG HSE Digital Ecosystem",
    version: "7.0.0",
    build: "Sprint-3",
    initialized: false
};

function hideLoadingScreen() {
    const loading = document.getElementById("loading-screen");
    if (!loading) return;

    loading.style.opacity = "0";

    setTimeout(() => {
        loading.style.display = "none";
    }, 300);
}

function appHealthCheck() {

    console.group("CGG HSE System Check");

    console.log("Version:", APP.version);
    console.log("Build:", APP.build);
    console.log("Browser:", navigator.userAgent);

    console.groupEnd();

}

function initializeApp() {

    if (APP.initialized) return;

    APP.initialized = true;

    appHealthCheck();
   
    initializeRouter();

    initializeNavigation();

    window.setTimeout(hideLoadingScreen, 600);

}

window.addEventListener("DOMContentLoaded", initializeApp);
