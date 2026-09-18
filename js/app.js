/* ==========================================
   CGG HSE Digital Operating System
   App Bootstrap - Fast Boot Engine
   Build 26.3 Stable
   ========================================== */

(() => {

"use strict";

/* ==========================================
   Main Boot Sequence
   ========================================== */

async function boot(){

  console.log("⚡ CGG HDOS Fast Boot Starting...");

  try{

    /* --------------------------------------
       1. Render UI Instan
       -------------------------------------- */

    if(window.Sidebar?.init){
      await Sidebar.init();
      console.log("✓ Sidebar Ready");
    }

    if(window.Router?.init){
      await Router.init();
      console.log("✓ Router Ready");
    }

    if(window.DashboardLive?.init){
      DashboardLive.init();
      console.log("✓ Dashboard Live");
    }

    if(window.HDOSUpload?.init){
      HDOSUpload.init();
      console.log("✓ Upload Engine Ready");
    }

    /* --------------------------------------
       2. Hilangkan Splash
       -------------------------------------- */

    const splash=document.getElementById("splash-screen");

    if(splash){
      splash.classList.add("fade-out");
    }

    /* --------------------------------------
       3. Sync Registry Background
       -------------------------------------- */

    if(window.CGGLoader?.modules){

      CGGLoader.modules()
        .then(()=>{

          console.log("✓ Network Registry Synchronized in Background");

        })
        .catch(err=>{

          console.warn("Registry background fetch skipped:",err);

        });

    }

    /* --------------------------------------
       4. Offline Sync
       -------------------------------------- */

    if(window.CGGSync?.start){

      CGGSync.start();

    }

  }catch(err){

    console.error("Boot Critical Error:",err);

    const view=document.getElementById("router-view");

    if(view){

      view.innerHTML=`
      <div class="glass-card section-card fade-in">

        <h2>Boot Error</h2>

        <p>${err.message}</p>

      </div>
      `;

    }

  }

}

/* ==========================================
   Start Application
   ========================================== */

window.addEventListener("load",boot);

})();
