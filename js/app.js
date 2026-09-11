/* ==========================================
   CGG HDOS App Bootstrap
   Build 8A Stable
   ========================================== */

window.CGG = window.CGG || {};

CGG.boot = async function () {

    const splash = document.getElementById("splash-screen");

    const safeRun = async (name, fn) => {
        try {
            if (typeof fn === "function") {
                await fn();
            }
        } catch (err) {
            console.error(`${name} Error:`, err);
        }
    };

    // Jalankan setiap modul satu-satu (tidak saling mematikan)
    await safeRun("Sidebar", () => window.Sidebar?.init?.());
    await safeRun("DashboardLive", () => window.DashboardLive?.start?.());
    await safeRun("Router", () => window.Router?.init?.());

    // Splash WAJIB hilang walaupun ada error
    if (splash) {
        splash.classList.add("fade-out");
        setTimeout(() => splash.remove(), 400);
    }

    console.log("CGG HDOS Boot Complete");
};

document.addEventListener("DOMContentLoaded", CGG.boot);
