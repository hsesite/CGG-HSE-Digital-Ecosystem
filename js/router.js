/* =========================================
   CGG HSE Digital Ecosystem
   Navigation Core v2.0
   Router Engine
   ========================================= */

const Router = {

    currentRoute:"dashboard",

    routes:{

        dashboard:{
            title:"Executive Dashboard",
            icon:"layout-dashboard"
        },

        inspection:{
            title:"Safety Inspection",
            icon:"clipboard-check"
        },

        hazard:{
            title:"Hazard Report",
            icon:"triangle-alert"
        },

        incident:{
            title:"Incident Management",
            icon:"shield-alert"
        },

        environment:{
            title:"Environment",
            icon:"leaf"
        },

        medical:{
            title:"Medical",
            icon:"heart-pulse"
        },

        contractor:{
            title:"Contractor",
            icon:"building"
        },

        sop:{
            title:"SOP & Policy",
            icon:"book-open"
        },

        area:{
            title:"Area Management",
            icon:"map"
        },

        admin:{
            title:"Administration",
            icon:"settings"
        }

    }

};

/* =========================================
   Current Route
   ========================================= */

function getCurrentHash(){

    const hash=window.location.hash.replace("#/","");

    return hash||"dashboard";

}

/* =========================================
   Render Route
   ========================================= */

function renderRoute(routeName){

    const container=document.getElementById("router-view");

    if(!container) return;

    const route=Router.routes[routeName];

    if(!route){

        container.innerHTML=`
            <div class="empty-state fade-in">
                <h3>404</h3>
                <p>Halaman tidak ditemukan.</p>
            </div>
        `;

        return;

    }

    Router.currentRoute=routeName;

    document.title=`${route.title} • CGG HSE`;

    /* ---------- Dashboard ---------- */

if(routeName==="dashboard"){

    container.innerHTML=renderDashboardHome();

    initializeDashboard();

    return;

}

/* ---------- Inspection ---------- */

if(routeName==="inspection"){

    InspectionModule.render(true);

    return;

}

    /* ---------- Inspection ---------- */

    if(routeName==="inspection"){

        InspectionModule.render();

        return;

    }

    /* ---------- Placeholder Module ---------- */

    container.innerHTML=`

        <div class="fade-in">

            <div class="section-header">

                <h2 class="section-title">
                    ${route.title}
                </h2>

                <span class="badge badge-info">
                    Sprint Berikutnya
                </span>

            </div>

            <div class="empty-state">

                <h3>${route.title}</h3>

                <p>Modul ini akan dibangun setelah Inspection selesai.</p>

            </div>

        </div>

    `;

}

/* =========================================
   Navigate
   ========================================= */

function navigate(route){

    window.location.hash=`/${route}`;

}

/* =========================================
   Listener
   ========================================= */

window.addEventListener("hashchange",()=>{

    renderRoute(getCurrentHash());

});

/* =========================================
   Init
   ========================================= */

function initializeRouter(){

    renderRoute(getCurrentHash());

}
