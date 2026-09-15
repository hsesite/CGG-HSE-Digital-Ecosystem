/* ==========================================
   CGG HSE Digital Operating System
   App Bootstrap
   Build 16.2 Foundation
   ========================================== */

(() => {

"use strict";

async function boot(){

console.log("CGG HDOS Boot Starting...");

try{

/* Sidebar harus selesai dulu */
if(window.Sidebar){

await Sidebar.init();

console.log("✓ Sidebar Ready");

}

/* Router setelah sidebar */
if(window.Router){

await Router.init();

console.log("✓ Router Ready");

}

/* Dashboard Live */
if(window.DashboardLive?.start){

DashboardLive.start();

console.log("✓ Dashboard Live");

}

/* Command Center */
if(window.CommandCenter?.init){

CommandCenter.init();

console.log("✓ Command Center");

}

/* Window Manager */
if(window.WindowManager?.init){

WindowManager.init();

console.log("✓ Window Manager");

}

/* Warmup cache schema */
if(window.CGGWarmup){

setTimeout(CGGWarmup,300);

}

console.log("CGG HDOS Boot Complete");

}catch(err){

console.error("Boot Error:",err);

}

}

window.addEventListener("load",boot);

})();
