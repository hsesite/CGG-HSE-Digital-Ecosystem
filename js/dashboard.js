/* ==========================================
   CGG HDOS Dashboard Enterprise
   Build 7.1 (Dependency Safe)
   ========================================== */

window.Dashboard = (() => {

let clockTimer = null;
let kpiLoaded = false;

/* ==========================================
   Render Dashboard
   ========================================== */

async function render() {

  const view = document.getElementById("router-view");
  if (!view) return;

  view.innerHTML = `
<div class="dashboard-shell fade-in">

<div class="executive-header glass-card">

<div class="executive-left">

<div class="logo-circle">CGG</div>

<div>
<h1>CGG HSE Digital Operating System</h1>
<p>Command Center • Foreman Safety</p>
</div>

</div>

<div class="executive-right">
<div id="live-clock">00:00</div>
</div>

</div>

<div class="command-center">

<div class="command-bar">

<span>⌘</span>

<input
id="dashboard-command"
placeholder="Cari Unit, Area, PICA atau buka Modul...">

</div>

</div>

<div class="dashboard-grid">

<div class="kpi-card glass-card">
<div class="kpi-label">Inspection</div>
<div id="kpi-inspection" class="kpi-value">0</div>
</div>

<div class="kpi-card glass-card">
<div class="kpi-label">Finding</div>
<div id="kpi-finding" class="kpi-value">0</div>
</div>

<div class="kpi-card glass-card">
<div class="kpi-label">PICA</div>
<div id="kpi-pica" class="kpi-value">0</div>
</div>

<div class="kpi-card glass-card">
<div class="kpi-label">PTW Aktif</div>
<div id="kpi-ptw" class="kpi-value">0</div>
</div>

</div>

<div class="glass-card section-card">

<div class="section-title">Operational Zones</div>

<div class="zone-grid">

${zoneCard("Pit Jaja KM10","🟢","Normal")}
${zoneCard("Workshop","🟡","2 Finding")}
${zoneCard("Fuel Station","🟢","Normal")}
${zoneCard("Stockpile","🔴","PICA Overdue")}
${zoneCard("Office","🟢","Normal")}
${zoneCard("Jetty","🟢","Normal")}

</div>

</div>

<div class="glass-card section-card">

<div class="section-title">Quick Launch</div>

<div class="launch-grid">

${launch("🚙","Inspection")}
${launch("📋","PTW")}
${launch("⚠️","Incident")}
${launch("🛠","Audit")}
${launch("📑","SOP")}
${launch("📊","Analytics")}
${launch("📂","Reports")}
${launch("🏭","Mine Permit")}

</div>

</div>

<div class="dashboard-two">

<div class="glass-card section-card">

<div class="section-title">Live Activity</div>

<div id="live-activity">

${activity("07:10","Inspection LV")}
${activity("08:12","Hazard Report")}
${activity("09:30","PTW Approved")}
${activity("10:15","Safety Talk")}

</div>

</div>

<div class="glass-card section-card">

<div class="section-title">Notification</div>

<div class="notif danger">PICA Stockpile overdue</div>
<div class="notif warning">MCU bulan ini</div>
<div class="notif info">Inspection selesai</div>

</div>

</div>

</div>
`;

  startClock();
  bindCommand();

  await loadDashboardData();

}

/* ==========================================
   Components
   ========================================== */

function zoneCard(name,status,desc){

return `
<div class="zone-card">
<div class="zone-status">${status}</div>
<div class="zone-name">${name}</div>
<div class="zone-desc">${desc}</div>
</div>`;
}

function launch(icon,title){

return `
<div class="launch-card">
<div class="launch-icon">${icon}</div>
<div>${title}</div>
</div>`;
}

function activity(time,text){

return `
<div class="activity-item">
<span>${time}</span>
<b>${text}</b>
</div>`;
}

/* ==========================================
   Clock
   ========================================== */

function startClock(){

const el=document.getElementById("live-clock");
if(!el) return;

if(clockTimer) clearInterval(clockTimer);

const update=()=>{

el.textContent=new Date().toLocaleTimeString("id-ID",{
hour:"2-digit",
minute:"2-digit",
second:"2-digit"
});

};

update();

clockTimer=setInterval(update,1000);

}

/* ==========================================
   Dashboard Data
   ========================================== */

async function loadDashboardData(){

try{

/* Hindari loop Dashboard ↔ DashboardLive */

if(window.DashboardAPI && typeof DashboardAPI.getSummary==="function"){

const summary=await DashboardAPI.getSummary();

animateCounter("kpi-inspection",summary.inspection||0);
animateCounter("kpi-finding",summary.finding||0);
animateCounter("kpi-pica",summary.pica||0);
animateCounter("kpi-ptw",summary.ptw||0);

kpiLoaded=true;
return;

}

}catch(err){

console.log("DashboardAPI fallback",err);

}

/* Fallback sementara */

if(!kpiLoaded){

animateCounter("kpi-inspection",5);
animateCounter("kpi-finding",10);
animateCounter("kpi-pica",10);
animateCounter("kpi-ptw",2);

kpiLoaded=true;

}

}

/* Dipanggil dashboard-live.js */

async function refresh(){

kpiLoaded=false;
await loadDashboardData();

}

/* ==========================================
   Counter Animation
   ========================================== */

function animateCounter(id,target){

const el=document.getElementById(id);
if(!el) return;

const current=Number(el.textContent)||0;

if(current===target){

el.textContent=target;
return;

}

const step=Math.max(1,Math.ceil(target/30));

let value=0;

const timer=setInterval(()=>{

value+=step;

if(value>=target){

value=target;
clearInterval(timer);

}

el.textContent=value;

},18);

}

/* ==========================================
   Command Center
   ========================================== */

function bindCommand(){

const input=document.getElementById("dashboard-command");
if(!input) return;

input.onkeydown=e=>{

if(e.key!=="Enter") return;

const value=input.value.trim().toLowerCase();

switch(value){

case "inspection":

if(window.Router){

Router.navigate("inspection");

}

break;

case "incident":

alert("Modul Incident segera aktif.");
break;

case "ptw":

alert("Modul PTW segera aktif.");
break;

default:

alert("Pencarian: "+input.value);

}

input.value="";

};

}

/* ==========================================
   Public API
   ========================================== */

return{

render,
refresh

};

})();
/* ==========================================
   Legacy Compatibility (WAJIB)
   Jangan hapus, dipakai router.js lama
   ========================================== */

window.renderDashboardHome = function () {
  return Dashboard.render();
};
