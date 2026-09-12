/* ==========================================
   CGG HDOS Sidebar Enterprise V2
   Architecture Lock V1.1
   Compatible with App Build 8
   ========================================== */

(() => {
"use strict";

const MENU = [
{
group:"Dashboard",
items:[
{id:"dashboard",icon:"grid",label:"Dashboard"}
]
},
{
group:"Safety",
items:[
{id:"inspection",icon:"clipboard",label:"Inspection"},
{id:"hazard",icon:"alert",label:"Hazard"},
{id:"incident",icon:"shield",label:"Incident"},
{id:"ptw",icon:"file",label:"PTW"},
{id:"mine-permit",icon:"landmark",label:"Mine Permit"},
{id:"commissioning",icon:"check",label:"Commissioning"},
{id:"audit",icon:"list",label:"Audit"}
]
},
{
group:"Environment",
items:[
{id:"waste",icon:"recycle",label:"Waste B3"},
{id:"spill",icon:"droplet",label:"Spill Report"},
{id:"dust",icon:"wind",label:"Dust"},
{id:"water",icon:"waves",label:"Water"},
{id:"noise",icon:"volume",label:"Noise"},
{id:"emission",icon:"cloud",label:"Emission"},
{id:"flora",icon:"leaf",label:"Flora & Fauna"},
{id:"housekeeping",icon:"home",label:"Housekeeping"}
]
},
{
group:"Medical",
items:[
{id:"first-aid",icon:"cross",label:"First Aid"},
{id:"clinic",icon:"hospital",label:"Clinic Register"},
{id:"mcu",icon:"heart",label:"MCU"},
{id:"fatigue",icon:"moon",label:"Fatigue Management"},
{id:"fit-work",icon:"activity",label:"Fit to Work"},
{id:"emergency",icon:"siren",label:"Emergency Response"}
]
},
{
group:"PICA",
items:[
{id:"pica",icon:"wrench",label:"PICA Engine"}
]
},
{
group:"Kebijakan",
items:[
{id:"policy",icon:"book",label:"Policy Center"}
]
},
{
group:"Analytics",
items:[
{id:"analytics",icon:"chart",label:"Analytics"},
{id:"reports",icon:"report",label:"Reports"}
]
},
{
group:"Settings",
items:[
{id:"settings",icon:"settings",label:"Settings"}
]
}
];

const SVG={

grid:`<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>`,

clipboard:`<svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h3v16H5V5h3z"/><path d="m9 13 2 2 4-4"/></svg>`,

alert:`<svg viewBox="0 0 24 24"><path d="M12 3 2 21h20z"/><path d="M12 9v5"/><circle cx="12" cy="17" r="1"/></svg>`,

shield:`<svg viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 5 3 8 7 10 4-2 7-5 7-10V6z"/></svg>`,

file:`<svg viewBox="0 0 24 24"><path d="M14 3H6v18h12V9z"/><path d="M14 3v6h6"/></svg>`,

landmark:`<svg viewBox="0 0 24 24"><path d="M3 10h18"/><path d="M5 10v8"/><path d="M19 10v8"/><path d="M3 21h18"/><path d="M12 3 3 8h18z"/></svg>`,

check:`<svg viewBox="0 0 24 24"><path d="M5 12l4 4L19 6"/></svg>`,

list:`<svg viewBox="0 0 24 24"><path d="M8 6h12"/><path d="M8 12h12"/><path d="M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>`,

recycle:`<svg viewBox="0 0 24 24"><path d="M12 3l3 5H9z"/></svg>`,

droplet:`<svg viewBox="0 0 24 24"><path d="M12 3C9 7 6 10 6 14a6 6 0 0012 0c0-4-3-7-6-11z"/></svg>`,

wind:`<svg viewBox="0 0 24 24"><path d="M3 12h14"/><path d="M7 8h10"/><path d="M5 16h12"/></svg>`,

waves:`<svg viewBox="0 0 24 24"><path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>`,

volume:`<svg viewBox="0 0 24 24"><path d="M5 10h4l5-4v12l-5-4H5z"/></svg>`,

cloud:`<svg viewBox="0 0 24 24"><path d="M6 18h12a4 4 0 000-8 6 6 0 00-12 1"/></svg>`,

leaf:`<svg viewBox="0 0 24 24"><path d="M5 19c7-2 11-8 14-14"/><path d="M9 15c1 1 3 3 6 4"/></svg>`,

home:`<svg viewBox="0 0 24 24"><path d="M3 10 12 3l9 7"/><path d="M5 10v10h14V10"/></svg>`,

cross:`<svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`,

hospital:`<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 7v8"/><path d="M8 11h8"/></svg>`,

heart:`<svg viewBox="0 0 24 24"><path d="M12 20 5 13a5 5 0 117-7 5 5 0 117 7z"/></svg>`,

moon:`<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 11-8-8"/></svg>`,

activity:`<svg viewBox="0 0 24 24"><path d="M3 12h4l3-6 4 12 3-6h4"/></svg>`,

siren:`<svg viewBox="0 0 24 24"><path d="M12 4a5 5 0 00-5 5v5h10V9a5 5 0 00-5-5z"/><path d="M5 19h14"/></svg>`,

wrench:`<svg viewBox="0 0 24 24"><path d="M21 3 15 9"/><path d="M8 16 3 21"/></svg>`,

book:`<svg viewBox="0 0 24 24"><path d="M12 6c-2-2-5-2-8-2v15c3 0 6 0 8 2"/><path d="M12 6c2-2 5-2 8-2v15c-3 0-6 0-8 2"/></svg>`,

chart:`<svg viewBox="0 0 24 24"><path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-8"/></svg>`,

report:`<svg viewBox="0 0 24 24"><path d="M14 3H6v18h12V9z"/><path d="M14 3v6h6"/></svg>`,

settings:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1-2-3-2 1a7 7 0 0 0-2-1l-.3-2H10l-.3 2a7 7 0 0 0-2 1l-2-1-2 3 2 1a7 7 0 0 0 0 2l-2 1 2 3 2-1a7 7 0 0 0 2 1l.3 2h4l.3-2a7 7 0 0 0 2-1l2 1 2-3-2-1c.1-.3.1-.7.1-1z"/></svg>`

};

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

const toggleBtn = document.getElementById("sb-toggle");

if (toggleBtn) {
  toggleBtn.onclick = () => {
    this.toggle();
  };
}

},

toggle(){

this.collapsed=!this.collapsed;

document.body.classList.toggle("sidebar-collapsed",this.collapsed);

},

activate(route){

document.querySelectorAll(".sb-item").forEach(btn=>{

btn.classList.toggle("active",btn.dataset.route===route);

});

},

template(){

return`

<div class="sb-shell">

<div class="sb-header">

<button id="sb-toggle" class="sb-toggle">☰</button>

<img src="/CGG-HSE-Digital-Ecosystem/assets/Logo/logo-cgg.png"
     alt="CGG Logo"
     onerror="this.src='assets/Logo/logo-cgg.png'">
<div class="sb-brand">
<b>CGG HDOS</b>
<span>Digital Operating System</span>
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

<div class="sb-footer">

<div class="sb-user">

<div class="sb-avatar">FS</div>

<div class="sb-info">

<b>Foreman Safety</b>

<span>CGG Mining</span>

</div>

</div>

</div>

</div>`;

}

};

window.Sidebar=Sidebar;

})();
