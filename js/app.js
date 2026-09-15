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

  await this.safe("Window Manager",()=>window.WindowManager?.init?.());

  await this.safe("Command Center",()=>window.CommandCenter?.init?.());

  await this.safe("Dashboard Live",()=>window.DashboardLive?.start?.());

  await this.safe("Router",()=>window.Router?.init?.());

  // Render sidebar setelah Router siap
  if(window.Sidebar?.init){

    window.Sidebar.init();

    const root=document.getElementById("sidebar");

    console.log("Sidebar HTML:",root.innerHTML.length);

  }

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
/* ==========================================
   Registry Warmup Engine
   Build 24.0
   ========================================== */

window.CGGWarmup=async function(){

  if(!window.CGGLoader) return;

  try{

    const modules=await CGGLoader.modules();

    const operational=modules.filter(m=>

      m.category==="operational" &&
      m.status==="active"

    );

    for(const module of operational){

      try{

        await CGGLoader.schema(module.module);

        console.log(`✓ Warmup ${module.module}`);

      }catch(e){

        console.warn(`Warmup gagal: ${module.module}`);

      }

    }

  }catch(err){

    console.error("Warmup Registry:",err);

  }

};
