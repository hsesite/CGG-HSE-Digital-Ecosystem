/* ==========================================
   CGG HSE Digital Operating System
   Router Engine
   Build 8A Stable
   ========================================== */

(() => {

"use strict";

const Router = {

current: "dashboard",

routes: {},

init() {

this.registerDefaults();

this.bindSidebar();

this.bindHash();

const first = location.hash.replace("#", "") || "dashboard";

return this.navigate(first, false);

},

registerDefaults() {

this.routes = {

dashboard: async () => {

if (window.Dashboard?.render) {

await Dashboard.render();

} else {

this.placeholder("Dashboard belum tersedia.");

}

},

inspection: async () => {

if (window.Inspection?.render) {

await Inspection.render();

} else {

this.placeholder("Modul Inspection sedang dipersiapkan.");

}

},

ptw: () => this.placeholder("Permit To Work"),

incident: () => this.placeholder("Incident Management"),

hazard: () => this.placeholder("Hazard Report"),

pica: () => this.placeholder("PICA Management"),

audit: () => this.placeholder("Audit"),

sop: () => this.placeholder("SOP Center"),

analytics: () => this.placeholder("Analytics"),

reports: () => this.placeholder("Reports"),

"mine-permit": () => this.placeholder("Mine Permit"),

settings: () => this.placeholder("Settings")

};

},

async navigate(route = "dashboard", push = true) {

if (!this.routes[route]) {

route = "dashboard";

}

this.current = route;

if (push) {

history.replaceState({}, "", "#" + route);

}

this.activateSidebar(route);

const view = document.getElementById("router-view");

if (view) {

view.innerHTML = "";

}

try {

await Promise.resolve(this.routes[route]());

} catch (err) {

console.error("Router:", err);

this.placeholder("Terjadi kesalahan saat membuka modul.");

}

},

bindHash() {

window.addEventListener("hashchange", () => {

const route = location.hash.replace("#", "") || "dashboard";

this.navigate(route, false);

});

},

bindSidebar() {

document.addEventListener("click", e => {

const item = e.target.closest("[data-route]");

if (!item) return;

e.preventDefault();

this.navigate(item.dataset.route);

});

},

activateSidebar(route) {

document.querySelectorAll("[data-route]").forEach(el => {

el.classList.toggle("active", el.dataset.route === route);

});

},

placeholder(title) {

const view = document.getElementById("router-view");

if (!view) return;

view.innerHTML = `
<div class="glass-card section-card fade-in">

<h2>${title}</h2>

<p>Modul akan dibangun pada Build berikutnya.</p>

</div>`;

}

};

window.Router = Router;

})();
