/* ==========================================
   CGG HDOS Router
   Build 8A
   ========================================== */

window.Router = (() => {

    let current = "dashboard";

    const routes = {

        dashboard: async () => {

            if (window.Dashboard) {
                await Dashboard.render();
            }

        },

        inspection: async () => {

            if (window.Inspection) {
                await Inspection.render();
            }

        },

        incident: async () => {

            placeholder("Incident");

        },

        ptw: async () => {

            placeholder("Permit To Work");

        },

        audit: async () => {

            placeholder("Audit");

        },

        sop: async () => {

            placeholder("SOP Center");

        },

        analytics: async () => {

            placeholder("Analytics");

        },

        reports: async () => {

            placeholder("Reports");

        },

        "mine-permit": async () => {

            placeholder("Mine Permit");

        }

    };

    async function init() {

        const hash = location.hash.replace("#", "") || "dashboard";

        await navigate(hash, false);

        window.addEventListener("hashchange", async () => {

            const next = location.hash.replace("#", "") || "dashboard";

            await navigate(next, false);

        });

    }

    async function navigate(route, push = true) {

        if (!routes[route]) {

            route = "dashboard";

        }

        current = route;

        if (push) {

            location.hash = route;

        }

        await routes[route]();

        highlightSidebar(route);

    }

    function highlightSidebar(route) {

        document.querySelectorAll(".nav-item").forEach(item => {

            item.classList.remove("active");

            if (item.dataset.route === route) {

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

            return current;

        }

    };

})();
