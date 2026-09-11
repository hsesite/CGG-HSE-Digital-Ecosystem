/* ==========================================
   CGG HSE Digital Operating System
   App Bootstrap
   Build 9 Stable
   ========================================== */

(() => {

"use strict";

window.CGG = window.CGG || {};
CGG.version = "9 Stable";

const Boot = {

started:false,

async start(){

if(this.started) return;
this.started=true;

console.log("CGG HDOS Boot Starting...");

await this.hideSplash();

this.ensureStructure();

await this.initModules();

console.log("CGG HDOS Boot Complete");

},

/* Splash */

async hideSplash(){

const splash=document.getElementById("splash-screen");
if(!splash) return;

await new Promise(r=>requestAnimationFrame(r));

splash.classList.add("fade-out");

setTimeout(()=>{
if(splash.parentNode){
splash.parentNode.removeChild(splash);
}
},450);

},

/* DOM */

ensureStructure(){

let app=document.getElementById("app");

if(!app){

app=document.createElement("div");
app.id="app";
document.body.appendChild(app);

}

/* Sidebar */

let sidebar=document.getElementById("sidebar");

if(!sidebar){

sidebar=document.createElement("aside");
sidebar.id="sidebar";
app.prepend(sidebar);

}

/* Main */

let main=app.querySelector("main");

if(!main){

main=document.createElement("main");
app.appendChild(main);

}

/* Router */

let view=document.getElementById("router-view");

if(!view){

view=document.createElement("div");
view.id="router-view";
main.appendChild(view);

}

},

/* Module */

async initModules(){

await this.safe("Sidebar",()=>window.Sidebar?.init?.());

await this.safe("Window Manager",()=>window.WindowManager?.init?.());

await this.safe("Command Center",()=>window.CommandCenter?.init?.());

await this.safe("Dashboard Live",()=>window.DashboardLive?.start?.());

await this.safe("Router",()=>window.Router?.init?.());

},

/* Safe */

async safe(name,fn){

try{

if(typeof fn==="function"){

await fn();

console.log("✔",name);

}else{

console.log("•",name,"skipped");

}

}catch(err){

console.error("✖",name,err);

}

}

};

document.addEventListener("DOMContentLoaded",()=>Boot.start());

window.CGG.boot=Boot;

})();
