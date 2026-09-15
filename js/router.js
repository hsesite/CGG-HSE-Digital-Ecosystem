/* ==========================================
   CGG HSE Digital Operating System
   Router Engine
   Build 23.2 Stable
   Dynamic Module Router
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

/* ==========================================
   Register Route
   ========================================== */

registerDefaults(){

this.routes={

dashboard:async()=>{

if(window.Dashboard?.render){

await Dashboard.render();

}else{

this.placeholder("Dashboard belum tersedia.");

}

},

inspection:async()=>{

if(window.Inspection?.render){

await Inspection.render();

}else{

await this.dynamicModule("inspection","Inspection");

}

},

hazard:async()=>{

await this.dynamicModule("hazard","Hazard Report");

},

incident:async()=>{

await this.dynamicModule("incident","Incident");

},

ptw:async()=>{

await this.dynamicModule("ptw","Permit To Work");

},

pica:async()=>{

await this.dynamicModule("pica","PICA Management");

},

audit:()=>this.placeholder("Audit"),

sop:()=>this.placeholder("SOP Center"),

analytics:()=>this.placeholder("Analytics"),

reports:()=>this.placeholder("Reports"),

"mine-permit":()=>this.placeholder("Mine Permit"),

settings:()=>this.placeholder("Settings")

};

},

/* ==========================================
   Dynamic Module
   ========================================== */

async dynamicModule(module,title){

const view=document.getElementById("router-view");

if(!view) return;

view.innerHTML=`

<div class="glass-card section-card fade-in">

<h2>${title}</h2>

<p>Dynamic Schema Renderer</p>

<div id="dynamic-form">
  <div class="form-group">
    <div class="skeleton-input"></div>
  </div>
  <div class="form-group">
    <div class="skeleton-input"></div>
  </div>
  <div class="form-group">
    <div class="skeleton-input"></div>
  </div>
</div>>

`;

try{

const data=await CGGLoader.schema(module);

CGGRenderer.mount("#dynamic-form",data.schema);

console.log(`✓ Dynamic module "${module}" loaded.`);

}catch(err){

console.error("Dynamic Module:",err);

this.placeholder(`${title} gagal dimuat.`);

}

},

/* ==========================================
   Navigation
   ========================================== */

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

/* ==========================================
   Hash Change
   ========================================== */

bindHash(){

window.addEventListener("hashchange",()=>{

const route=location.hash.replace("#","")||"dashboard";

this.navigate(route,false);

});

},

/* ==========================================
   Sidebar
   ========================================== */

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

}

},
/* ==========================================
   Placeholder
   ========================================== */

placeholder(title){

const view=document.getElementById("router-view");

if(!view) return;

view.innerHTML=`

<div class="glass-card section-card fade-in">

<h2>${title}</h2>

<p>Modul belum memiliki Dynamic Schema.</p>

</div>

`;

}

};

window.Router=Router;

})();
