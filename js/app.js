/* ==========================================
   CGG HSE Digital Operating System
   App Bootstrap
   Build 8A
   ========================================== */

window.CGG = window.CGG || {};

CGG.boot = async function () {

    try {

        // Splash Screen
        const splash = document.getElementById("splash-screen");

        if (splash) {

            splash.classList.add("fade-out");

            setTimeout(() => {

                splash.remove();

            }, 400);

        }

        // Sidebar
        if (window.Sidebar && Sidebar.init) {
            Sidebar.init();
        }

        // Dashboard Live
        if (window.DashboardLive && DashboardLive.start) {
            DashboardLive.start();
        }

        // Router
        if (window.Router && Router.init) {
            await Router.init();
        }

        console.log("CGG HDOS Boot Success");

    } catch (err) {

        console.error("Boot Error", err);

    }

};

document.addEventListener("DOMContentLoaded", CGG.boot);
