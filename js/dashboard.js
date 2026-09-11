/* ==========================================
   CGG HDOS Dashboard Enterprise
   Build #007
   ========================================== */

window.Dashboard = (() => {

async function render(){

const view=document.getElementById("router-view");
if(!view) return;

view.innerHTML=`

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
loadDashboardData();
bindCommand();

}

function zoneCard(name,status,desc){

return`

<div class="zone-card">

<div class="zone-status">${status}</div>

<div class="zone-name">${name}</div>

<div class="zone-desc">${desc}</div>

</div>`;

}

function launch(icon,title){

return`

<div class="launch-card">

<div class="launch-icon">${icon}</div>

<div>${title}</div>

</div>`;

}

function activity(time,text){

return`

<div class="activity-item">

<span>${time}</span>

<b>${text}</b>

</div>`;

}

function startClock(){

const el=document.getElementById("live-clock");

setInterval(()=>{

if(!el) return;

el.textContent=new Date().toLocaleTimeString("id-ID");

},1000);

}

async function loadDashboardData(){

try{

if(window.DashboardLive){

await DashboardLive.refresh();

}

}catch(e){

console.log(e);

}

count("kpi-inspection",28);
count("kpi-finding",12);
count("kpi-pica",4);
count("kpi-ptw",7);

}

function count(id,target){

const el=document.getElementById(id);

let n=0;

const t=setInterval(()=>{

n++;

el.textContent=n;

if(n>=target) clearInterval(t);

},20);

}

function bindCommand(){

const input=document.getElementById("dashboard-command");

input.addEventListener("keydown",e=>{

if(e.key==="Enter"){

alert("Command: "+input.value);

input.value="";

}

});

}

return{

render

};

})();
