/* ==========================================
   CGG HSE Digital Operating System
   App Bootstrap - Fast Boot Engine
   ========================================== */

(() => {

"use strict";

async function boot() {
  console.log("⚡ CGG HDOS Fast Boot Starting...");

  try {

    /* 1. Render UI Utama secara Instan (Menggunakan Fallback Local / Cache) */
    if (window.Sidebar) {
      await Sidebar.init();
      console.log("✓ Sidebar Ready");
    }

    if (window.Router) {
      await Router.init();
      console.log("✓ Router Ready");
    }

    if (window.DashboardLive?.init) {
      DashboardLive.init();
      console.log("✓ Dashboard Live");
    }

    // Sembunyikan Splash Screen segera setelah UI utama ter-render
    const splash = document.getElementById("splash-screen");
    if (splash) {
      splash.classList.add("fade-out");
    }

    /* 2. Jalankan Sync/Fetch Registry di Latar Belakang (Non-blocking) */
    CGGLoader.modules().then(() => {
      console.log("✓ Network Registry Synchronized in Background");
    }).catch(err => {
      console.warn("Registry background fetch skipped/failed:", err);
    });

  } catch (err) {
    console.error("Boot Critical Error:", err);
  }

}

window.addEventListener("DOMContentLoaded", boot);

})();
