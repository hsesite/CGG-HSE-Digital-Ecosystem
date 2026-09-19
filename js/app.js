/* ==========================================
   CGG HSE Digital Operating System
   Build 26.4 LTS
   Fast Boot Engine
========================================== */

(() => {

"use strict";

async function fastBoot(){

    console.log("⚡ CGG HDOS Fast Boot Starting...");

    try{

        if(window.Sidebar){
            await Sidebar.init();
            console.log("✓ Sidebar Ready");
        }

        if(window.Router){
            await Router.init();
            console.log("✓ Router Ready");
        }

        document.getElementById("splash-screen")
            ?.classList.add("fade-out");

        requestIdleCallback?.(()=>backgroundBoot());

        if(!window.requestIdleCallback){
            setTimeout(backgroundBoot,50);
        }

    }catch(err){

        console.error("Boot Error:",err);

    }

}

async function backgroundBoot(){

    try{

        if(window.CGGLoader){
            await CGGLoader.modules();
            console.log("✓ Registry Background Ready");
        }

        if(window.CGGSync){
            CGGSync.start();
            console.log("✓ Sync Ready");
        }

    }catch(err){

        console.warn("Background Boot:",err);

    }

}

window.addEventListener("load",fastBoot);

})();
