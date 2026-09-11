/* ==========================================
   CGG HDOS Sidebar Enterprise
   Build V1.1
   Compatible with App Build 8
   ========================================== */

(() => {
"use strict";

/* ================= MENU ================= */

const MENU = [

{
group:"Dashboard",
items:[
{ id:"dashboard", icon:"grid", label:"Dashboard"}
]
},

{
group:"Safety",
items:[
{ id:"inspection", icon:"clipboard", label:"Inspection"},
{ id:"hazard", icon:"alert", label:"Hazard"},
{ id:"incident", icon:"shield", label:"Incident"},
{ id:"ptw", icon:"file", label:"PTW"},
{ id:"mine-permit", icon:"landmark", label:"Mine Permit"},
{ id:"commissioning", icon:"check", label:"Commissioning"},
{ id:"audit", icon:"list", label:"Audit"}
]
},

{
group:"Environment",
items:[
{ id:"waste", icon:"recycle", label:"Waste B3"},
{ id:"spill", icon:"droplet", label:"Spill Report"},
{ id:"dust", icon:"wind", label:"Dust"},
{ id:"water", icon:"waves", label:"Water"},
{ id:"noise", icon:"volume", label:"Noise"},
{ id:"emission", icon:"cloud", label:"Emission"},
{ id:"flora", icon:"leaf", label:"Flora & Fauna"},
{ id:"housekeeping", icon:"home", label:"Housekeeping"}
]
},

{
group:"Medical",
items:[
{ id:"first-aid", icon:"cross", label:"First Aid"},
{ id:"clinic", icon:"hospital", label:"Clinic Register"},
{ id:"mcu", icon:"heart", label:"MCU"},
{ id:"fatigue", icon:"moon", label:"Fatigue"},
{ id:"fit-work", icon:"activity", label:"Fit to Work"},
{ id:"emergency", icon:"siren", label:"Emergency"}
]
},

{
group:"PICA",
items:[
{ id:"pica", icon:"wrench", label:"PICA"}
]
},

{
group:"Kebijakan",
items:[
{ id:"policy", icon:"book", label:"Policy Center"}
]
},

{
group:"Analytics",
items:[
{ id:"analytics", icon:"chart", label:"Analytics"},
{ id:"reports", icon:"report", label:"Reports"}
]
},

{
group:"Settings",
items:[
{ id:"settings", icon:"settings", label:"Settings"}
]
}

];

/* ================= ICON SVG ================= */

const SVG = {

grid:`<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/></svg>`,

clipboard:`<svg viewBox="0 0 24 24"><path d="M9 2h6l1 2h3v18H5V4h3zm1 11l2 2 4-4"/></svg>`,

alert:`<svg viewBox="0 0 24 24"><path d="M12 3 2 21h20L12 3zm0 6v5m0 3h.01"/></svg>`,

shield:`<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5z"/></svg>`,

file:`<svg viewBox="0 0 24 24"><path d="M14 2H6v20h12V8z"/></svg>`,

landmark:`<svg viewBox="0 0 24 24"><path d="M3 10h18M5 10v8m14-8v8M12 3l9 5H3z"/></svg>`,

check:`<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>`,

list:`<svg viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12"/></svg>`,

recycle:`<svg viewBox="0 0 24 24"><path d="M12 2l3 5H9z"/></svg>`,

droplet:`<svg viewBox="0 0 24 24"><path d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-4-3-7-6-11z"/></svg>`,

wind:`<svg viewBox="0 0 24 24"><path d="M3 12h12"/></svg>`,

waves:`<svg viewBox="0 0 24 24"><path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>`,

volume:`<svg viewBox="0 0 24 24"><path d="M5 9h4l5-4v14l-5-4H5z"/></svg>`,

cloud:`<svg viewBox="0 0 24 24"><path d="M6 18h12a4 4 0 000-8 6 6 0 00-12 1"/></svg>`,

leaf:`<svg viewBox="0 0 24 24"><path d="M5 19c8-2 12-8 14-14"/></svg>`,

home:`<svg viewBox="0 0 24 24"><path d="M3 10l9-7 9 7"/></svg>`,

cross:`<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,

hospital:`<svg viewBox="0 0 24 24"><path d="M5 3h14v18H5z"/></svg>`,

heart:`<svg viewBox="0 0 24 24"><path d="M12 20l-7-7a5 5 0 017-7 5 5 0 017 7z"/></svg>`,

moon:`<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-9-9"/></svg>`,

activity:`<svg viewBox="0 0 24 24"><path d="M3 12h4l3-6 4 12 3-6h4"/></svg>`,

siren:`<svg viewBox="0 0 24 24"><path d="M12 4a5 5 0 00-5 5v5h10V9a5 5 0 00-5-5z"/></svg>`,

wrench:`<svg viewBox="0 0 24 24"><path d="M21 3l-6 6"/></svg>`,

book:`<svg viewBox="0 0 24 24"><path d="M12 7c-2-2-5-2-8-2v13"/></svg>`,

chart:`<svg viewBox="0 0 24 24"><path d="M4 20V10m8 10V4m8 16v-8"/></svg>`,

report:`<svg viewBox="0 0 24 24"><path d="M14 2H6v20h12V8z"/></svg>`,

settings:`<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 110 8 4 4 0 010-8z"/></svg>`

};

/* ================= SIDEBAR ================= */

const Sidebar={

collapsed:false,

init(){

const root=document.getElementById("sidebar");
if(!root) return;

root.innerHTML=this.template();

this.bind();

this.activate("dashboard");

},

bind(){

document.querySelectorAll(".sb-item").forEach(btn=>{

btn.onclick=()=>{

window.Router?.navigate(btn.dataset.route);

this.activate(btn.dataset.route);

};

});

document.getElementById("sb-toggle")?.addEventListener("click",()=>{

this.toggle();

});

},

toggle(){

this.collapsed=!this.collapsed;

document.body.classList.toggle("sidebar-collapsed",this.collapsed);

},

activate(route){

document.querySelectorAll(".sb-item").forEach(el=>{

el.classList.toggle("active",el.dataset.route===route);

});

},

template(){

return`

<div class="sb-shell">

<div class="sb-header">

<button id="sb-toggle" class="sb-toggle">☰</button>

<img src="assets/Logo/logo-cgg.png" alt="CGG">

<div class="sb-brand">

<b>CGG HDOS</b>

<span>Enterprise</span>

</div>

</div>

<div class="sb-scroll">

${MENU.map(group=>`

<div class="sb-group">

<div class="sb-title">${group.group}</div>

${group.items.map(item=>`

<button class="sb-item"

data-route="${item.id}"

title="${item.label}">

${SVG[item.icon]}

<span>${item.label}</span>

</button>

`).join("")}

</div>

`).join("")}

</div>

</div>`;

}

};

window.Sidebar=Sidebar;

})();
