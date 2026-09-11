/* ==========================================
   CGG HDOS Router
   Build 8A Stable
   Full Replacement
   ========================================== */

window.Router = (() => {

    let currentRoute = "dashboard";

    const ROUTES = {

        dashboard: () => window.Dashboard?.render?.(),

        inspection: () => window.Inspection?.render?.() || placeholder("Inspection"),

        ptw: () => placeholder("Permit To Work"),

        incident: () => placeholder("Incident"),

        hazard: () => placeholder("Hazard"),

        pica: () => placeholder("PICA"),

        audit: () => placeholder("Audit"),

        sop: () => placeholder("SOP Center"),

        analytics: () => placeholder("Analytics"),

        reports: () => placeholder("Reports"),

        "mine-permit": () => placeholder("Mine Permit"),

        settings: () => placeholder("Settings")

    };

    async function init() {

        ensureRouterView();

        const first = location.hash.replace("#", "") || "dashboard";

        await navigate(first, false);

        window.addEventListener("hashchange", async () => {

            const next = location.hash.replace("#", "") || "dashboard";

            await navigate(next, false);

        });

    }

    async function navigate(route, push = true) {

        if (!ROUTES[route]) route = "dashboard";

        currentRoute = route;

        if (push) {

            history.replaceState({}, "", "#" + route);

        }

        try {

            await Promise.resolve(ROUTES[route]());

        } catch (err) {

            console.error("Router:", err);

            if (route !== "dashboard") {

                await Promise.resolve(ROUTES.dashboard());

            }

        }

        activateSidebar(route);

    }

    function ensureRouterView() {

        let view = document.getElementById("router-view");

        if (view) return;

        const main =
            document.querySelector("main") ||
            document.querySelector(".workspace") ||
            document.querySelector(".content") ||
            document.body;

        view = document.createElement("div");
        view.id = "router-view";

        main.appendChild(view);

    }

    function activateSidebar(route) {

        document.querySelectorAll(".nav-item").forEach(item => {

            item.classList.remove("active");

            const target =
                item.dataset.route ||
                item.dataset.page ||
                item.dataset.module;

            if (target === route) {

                item.classList.add("active");

            }

        });

    }

    function placeholder(title) {

        const view = document.getElementById("router-view");

        if (!view) return;

        view.innerHTML = `
            <div class="glass-card section-card fade-in">

                <h2>${title}</h2>

                <p>Modul sedang dipersiapkan.</p>

            </div>`;

    }

    return {

        init,
        navigate,

        get current() {

            return currentRoute;

        }

    };

})();
