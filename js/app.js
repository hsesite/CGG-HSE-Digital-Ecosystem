/* ==========================================
   CGG HDOS Bootstrap
   Build 8A Emergency Fix
   ========================================== */

window.addEventListener("DOMContentLoaded", async () => {

    const splash = document.getElementById("splash-screen");

    // Splash hilang dulu (jangan menunggu modul)
    if (splash) {
        splash.classList.add("fade-out");
        setTimeout(() => splash.remove(), 300);
    }

    // Sidebar
    try {
        window.Sidebar?.init?.();
    } catch (e) {
        console.error("Sidebar:", e);
    }

    // Dashboard Live
    try {
        window.DashboardLive?.start?.();
    } catch (e) {
        console.error("DashboardLive:", e);
    }

    // Router
    try {

        if (window.Router?.init) {

            await Router.init();

        } else if (window.Dashboard?.render) {

            // Fallback paksa render dashboard
            await Dashboard.render();

        }

    } catch (e) {

        console.error("Router:", e);

        // Fallback terakhir
        if (window.Dashboard?.render) {
            await Dashboard.render();
        }

    }

    console.log("CGG HDOS Boot Complete");

});
