
/* =========================================
   CGG HSE Digital Ecosystem
   Navigation Core v1.0
   ========================================= */

const Router = {

    currentRoute: "dashboard",

    routes: {

        dashboard: {
            title: "Executive Dashboard",
            icon: "layout-dashboard"
        },

        inspection: {
            title: "Safety Inspection",
            icon: "clipboard-check"
        },

        hazard: {
            title: "Hazard Report",
            icon: "triangle-alert"
        },

        incident: {
            title: "Incident Management",
            icon: "shield-alert"
        },

        environment: {
            title: "Environment",
            icon: "leaf"
        },

        medical: {
            title: "Medical",
            icon: "heart-pulse"
        },

        contractor: {
            title: "Contractor",
            icon: "building"
        },

        sop: {
            title: "SOP & Policy",
            icon: "book-open"
        },

        area: {
            title: "Area Management",
            icon: "map"
        },

        admin: {
            title: "Administration",
            icon: "settings"
        }

    }

};

/* ---------- Route Resolver ---------- */

function getCurrentHash(){

    const hash = window.location.hash.replace("#/","");

    return hash || "dashboard";

}

/* ---------- Render ---------- */

function renderRoute(routeName){

    const container = document.getElementById("router-view");

    if(!container) return;

    const route = Router.routes[routeName];

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
    if (routeName === "dashboard") {

       container.innerHTML = renderDashboardHome();

       initializeDashboard();

       return;

}
    container.innerHTML=`
        <div class="fade-in">
            <div class="section-header">
                <h2 class="section-title">${route.title}</h2>
                <span class="badge badge-info">Prototype</span>
            </div>

            <div class="empty-state">
                <h3>${route.title}</h3>
                <p>Modul ini akan dibangun pada sprint berikutnya.</p>
            </div>
        </div>
    `;

}

/* ---------- Navigate ---------- */

function navigate(route){

    window.location.hash=`/${route}`;

}

/* ---------- Listener ---------- */

window.addEventListener("hashchange",()=>{

    renderRoute(getCurrentHash());

});

/* ---------- Init ---------- */

function initializeRouter(){

    renderRoute(getCurrentHash());

}
