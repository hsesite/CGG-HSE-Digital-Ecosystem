/* ==========================================
   CGG HSE Digital Operating System
   Router Engine
   Build 16.2 Foundation
   Dynamic Schema Ready
   ========================================== */

(() => {

"use strict";

const Router={

current:"dashboard",

routes:{},

init(){

this.registerDefaults();

this.bindSidebar();

this.bindHash();

const first=location.hash.replace("#","")||"dashboard";

return this.navigate(first,false);

},

registerDefaults(){

this.routes={

dashboard:async()=>{

if(window.Dashboard?.render){

await Dashboard.render();

}else{

this.placeholder("Dashboard belum tersedia.");

}

},

upload:async()=>{

  if(window.HDOSUpload?.render){

    await HDOSUpload.render();

  }else{

    this.placeholder("Upload Center");

  }

},
   
inspection:async()=>{

if(window.Inspection?.render){

await Inspection.render();

}else{

await this.renderDynamic("inspection","Inspection");

}

},

finding:()=>this.renderDynamic("finding","Finding"),

pica:()=>this.renderDynamic("pica","PICA"),

hazard:async()=>{

if(window.Hazard?.render){

await Hazard.render();

}else{

await this.renderDynamic("hazard","Hazard Report");

}

},

incident:()=>this.renderDynamic("incident","Incident"),

ptw:()=>this.renderDynamic("ptw","Permit To Work"),

audit:()=>this.renderDynamic("audit","Audit"),

sop:()=>this.renderDynamic("sop","SOP"),

policy:()=>this.renderDynamic("policy","Policy"),

contractor:()=>this.renderDynamic("contractor","Contractor"),

notification:()=>this.renderDynamic("notification","Notification"),

master:()=>this.renderDynamic("master","Master"),

users:()=>this.renderDynamic("users","Users"),

analytics:()=>this.placeholder("Analytics"),

reports:()=>this.placeholder("Reports"),

settings:()=>this.placeholder("Settings"),

"mine-permit":()=>this.placeholder("Mine Permit"),

commissioning:()=>this.placeholder("Commissioning"),

waste:()=>this.placeholder("Waste B3"),

spill:()=>this.placeholder("Spill Report"),

dust:()=>this.placeholder("Dust"),

water:()=>this.placeholder("Water"),

noise:()=>this.placeholder("Noise"),

emission:()=>this.placeholder("Emission"),

flora:()=>this.placeholder("Flora & Fauna"),

housekeeping:()=>this.placeholder("Housekeeping"),

"first-aid":()=>this.placeholder("First Aid"),

clinic:()=>this.placeholder("Clinic"),

mcu:()=>this.placeholder("Medical Check Up"),

fatigue:()=>this.placeholder("Fatigue Management"),

"fit-work":()=>this.placeholder("Fit To Work"),

emergency:()=>this.placeholder("Emergency Response")

};

},

async navigate(route="dashboard",push=true){

if(!this.routes[route]){

route="dashboard";

}

this.current=route;

if(push){

history.replaceState({},"","#"+route);

}

this.activateSidebar(route);

const view=document.getElementById("router-view");

if(view){

view.innerHTML="";

}

try{

await Promise.resolve(this.routes[route]());

}catch(err){

console.error("Router:",err);

this.placeholder("Terjadi kesalahan saat membuka modul.");

}

},

bindHash(){

window.addEventListener("hashchange",()=>{

const route=location.hash.replace("#","")||"dashboard";

this.navigate(route,false);

});

},

bindSidebar(){

document.addEventListener("click",e=>{

const item=e.target.closest("[data-route]");

if(!item) return;

e.preventDefault();

this.navigate(item.dataset.route);

});

},

activateSidebar(route){

if(window.Sidebar?.activate){

Sidebar.activate(route);

return;

}

document.querySelectorAll("[data-route]").forEach(el=>{

el.classList.toggle("active",el.dataset.route===route);

});

},

async renderDynamic(module,title){

const view=document.getElementById("router-view");

if(!view) return;

view.innerHTML=`
<div class="glass-card section-card fade-in">

<h2>${title}</h2>

<p>Dynamic Schema Renderer</p>

<div id="dynamic-form"></div>

</div>
`;

try{

const data=await CGGLoader.schema(module);

if(!data.success){

throw new Error("Schema gagal dimuat");

}

CGGRenderer.mount("#dynamic-form",data.schema);

console.log(`✓ Dynamic module "${module}" loaded.`);

}catch(err){

console.error(err);

view.innerHTML=`
<div class="glass-card section-card fade-in">

<h2>${title}</h2>

<p>Schema belum tersedia.</p>

</div>
`;

}

},

placeholder(title){

const view=document.getElementById("router-view");

if(!view) return;

view.innerHTML=`
<div class="glass-card section-card fade-in">

<h2>${title}</h2>

<p>Modul akan dibangun pada Build berikutnya.</p>

</div>
`;

}

};

window.Router=Router;

})();
