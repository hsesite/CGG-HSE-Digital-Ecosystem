/* ==========================================
   CGG HDOS Sidebar Engine
   Build 8 Stable
   Full Replacement
   ========================================== */

(() => {
"use strict";

const SIDEBAR_ITEMS = [
  { id:"dashboard", icon:"grid-2x2", label:"Dashboard" },
  { id:"inspection", icon:"clipboard-check", label:"Inspection" },
  { id:"hazard", icon:"triangle-alert", label:"Hazard" },
  { id:"incident", icon:"shield-alert", label:"Incident" },
  { id:"ptw", icon:"file-check", label:"PTW" },
  { id:"pica", icon:"wrench", label:"PICA" },
  { id:"audit", icon:"clipboard-list", label:"Audit" },
  { id:"sop", icon:"book-open", label:"SOP" },
  { id:"analytics", icon:"chart-bar", label:"Analytics" },
  { id:"reports", icon:"file-text", label:"Reports" },
  { id:"mine-permit", icon:"landmark", label:"Mine Permit" },
  { id:"settings", icon:"settings", label:"Settings" }
];

const ICONS = {
  "grid-2x2":`<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/></svg>`,
  "clipboard-check":`<svg viewBox="0 0 24 24"><path d="M9 2h6l1 2h3v18H5V4h3zm1 11l2 2 4-4"/></svg>`,
  "triangle-alert":`<svg viewBox="0 0 24 24"><path d="M12 3 2 21h20L12 3zm0 6v5m0 3h.01"/></svg>`,
  "shield-alert":`<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5zm0 5v5m0 3h.01"/></svg>`,
  "file-check":`<svg viewBox="0 0 24 24"><path d="M14 2H6v20h12V8zm0 0v6h6M9 13l2 2 4-4"/></svg>`,
  "wrench":`<svg viewBox="0 0 24 24"><path d="m21 3-6 6M8 14l-5 5"/></svg>`,
  "clipboard-list":`<svg viewBox="0 0 24 24"><path d="M9 2h6l1 2h3v18H5V4h3zm0 6h6m-6 4h6m-6 4h4"/></svg>`,
  "book-open":`<svg viewBox="0 0 24 24"><path d="M12 7c-2-2-5-2-8-2v13c3 0 6 0 8 2 2-2 5-2 8-2V5c-3 0-6 0-8 2z"/></svg>`,
  "chart-bar":`<svg viewBox="0 0 24 24"><path d="M4 20V10m8 10V4m8 16v-8"/></svg>`,
  "file-text":`<svg viewBox="0 0 24 24"><path d="M14 2H6v20h12V8zm0 0v6h6M9 13h6M9 17h4"/></svg>`,
  "landmark":`<svg viewBox="0 0 24 24"><path d="M3 10h18M5 10v8m14-8v8M2 20h20M12 3l9 5H3z"/></svg>`,
  "settings":`<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/></svg>`
};

const Sidebar = {

  init(){
    const root=document.getElementById("sidebar");
    if(!root) return;

    root.innerHTML=this.template();

    root.querySelectorAll(".sb-item").forEach(btn=>{
      btn.addEventListener("click",()=>{
        window.Router?.navigate(btn.dataset.route);
      });
    });

    this.activate("dashboard");
  },

  activate(route){
    document.querySelectorAll(".sb-item").forEach(i=>{
      i.classList.toggle("active",i.dataset.route===route);
    });
  },

  template(){
    return `
    <div class="sb-shell">

      <div class="sb-logo">
        <img src="assets/Logo/logo-cgg.png" alt="CGG"
             onerror="this.src='assets/logo-cgg.png';this.onerror=null;">
      </div>

      <nav class="sb-nav">
        ${SIDEBAR_ITEMS.map(i=>`
          <button class="sb-item"
                  data-route="${i.id}"
                  title="${i.label}">
            ${ICONS[i.icon]}
          </button>
        `).join("")}
      </nav>

    </div>`;
  }

};

window.Sidebar=Sidebar;

})();
