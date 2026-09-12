/* ==========================================
   CGG HDOS Dashboard Enterprise
   Build 7.2 (Dependency Safe)
   ========================================== */

/* ---------- Global Compatibility ---------- */

window.DashboardState = window.DashboardState || {
    inspection: 0,
    finding: 0,
    pica: 0,
    ptw: 0,
    notifications: [],
    contractor: {},
    liveActivity: []
};

/* ==========================================
   Dashboard Module
   ========================================== */

window.Dashboard = (() => {

    let clockTimer = null;

    async function render() {

        const view = document.getElementById("router-view");
        if (!view) return;

        view.innerHTML = `
<div class="dashboard-shell fade-in">

<div class="executive-header glass-card">

<div class="executive-left">

<div class="logo-circle">
<img src="/CGG-HSE-Digital-Ecosystem/assets/Logo/logo-cgg.png"
     alt="CGG Logo"
     class="header-logo"
     onerror="this.src='assets/Logo/logo-cgg.png'">
</div>

<div>

<h1>CGG HSE Digital Operating System</h1>

<p>Command Center • Foreman Safety</p>

</div>

</div>

<div class="executive-right">

<div id="live-clock">00:00:00</div>

</div>

</div>

<div class="command-center">

<div class="command-bar">

<span>⌘</span>

<input id="dashboard-command"
placeholder="Cari Unit, Area, PICA atau buka Modul...">

</div>

</div>

<div class="dashboard-grid">

${kpiCard("Inspection","kpi-inspection")}
${kpiCard("Finding","kpi-finding")}
${kpiCard("PICA","kpi-pica")}
${kpiCard("PTW Aktif","kpi-ptw")}

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

${launch("🚙","Inspection","inspection")}
${launch("📋","PTW","ptw")}
${launch("⚠️","Incident","incident")}
${launch("🛠","Audit","audit")}
${launch("📑","SOP","sop")}
${launch("📊","Analytics","analytics")}
${launch("📂","Reports","reports")}
${launch("🏭","Mine Permit","mine-permit")}

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

</div>`;

        startClock();
        bindCommand();
        bindLaunch();

        await loadDashboardData();

    }

    /* ---------- Components ---------- */

    function kpiCard(title,id){

        return `
<div class="kpi-card glass-card">

<div class="kpi-label">${title}</div>

<div id="${id}" class="kpi-value">0</div>

</div>`;

    }

    function zoneCard(name,status,desc){

        return `
<div class="zone-card">

<div class="zone-status">${status}</div>

<div class="zone-name">${name}</div>

<div class="zone-desc">${desc}</div>

</div>`;

    }

    function launch(icon,title,module){

        return `
<div class="launch-card" data-module="${module}">

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

    /* ---------- Clock ---------- */

    function startClock(){

        const el=document.getElementById("live-clock");
        if(!el) return;

        if(clockTimer){

            clearInterval(clockTimer);

        }

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

    /* ---------- Data ---------- */

    async function loadDashboardData(){

        try{

            if(window.DashboardAPI &&
               typeof DashboardAPI.getSummary==="function"){

                const summary=await DashboardAPI.getSummary();

                DashboardState.inspection=summary.inspection||0;
                DashboardState.finding=summary.finding||0;
                DashboardState.pica=summary.pica||0;
                DashboardState.ptw=summary.ptw||0;

            }else{

                DashboardState.inspection=5;
                DashboardState.finding=10;
                DashboardState.pica=10;
                DashboardState.ptw=2;

            }

        }catch(err){

            console.error("DashboardAPI Error",err);

            DashboardState.inspection=5;
            DashboardState.finding=10;
            DashboardState.pica=10;
            DashboardState.ptw=2;

        }

        animateCounter("kpi-inspection",DashboardState.inspection);
        animateCounter("kpi-finding",DashboardState.finding);
        animateCounter("kpi-pica",DashboardState.pica);
        animateCounter("kpi-ptw",DashboardState.ptw);

    }

    async function refresh(){

        await loadDashboardData();

    }

    /* ---------- Counter ---------- */

    function animateCounter(id,target){

        const el=document.getElementById(id);
        if(!el) return;

        let value=0;

        const step=Math.max(1,Math.ceil(target/30));

        const timer=setInterval(()=>{

            value+=step;

            if(value>=target){

                value=target;
                clearInterval(timer);

            }

            el.textContent=value;

        },18);

    }

    /* ---------- Command ---------- */

    function bindCommand(){

        const input=document.getElementById("dashboard-command");
        if(!input) return;

        input.onkeydown=e=>{

            if(e.key!=="Enter") return;

            navigateModule(input.value.trim().toLowerCase());

            input.value="";

        };

    }

    function bindLaunch(){

        document.querySelectorAll(".launch-card").forEach(card=>{

            card.onclick=()=>{

                navigateModule(card.dataset.module);

            };

        });

    }

    function navigateModule(module){

        if(window.Router &&
           typeof Router.navigate==="function"){

            Router.navigate(module);

        }else{

            console.log("Navigate:",module);

        }

    }

    return{

        render,
        refresh

    };

})();

/* ==========================================
   Legacy Router Compatibility
   ========================================== */

window.renderDashboardHome = function(){

    return Dashboard.render();

};

window.initializeDashboard = function(){

    return Dashboard.render();

};

window.initializeDashboardLive = function(){

    if(window.DashboardLive &&
       DashboardLive.start){

        DashboardLive.start();

    }

};
