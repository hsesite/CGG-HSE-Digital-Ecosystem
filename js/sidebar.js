
/* =========================================
   CGG HSE Digital Ecosystem
   Sidebar v3 (Clean Rewrite)
   ========================================= */

const NAV_ITEMS = [
  { route: "dashboard", icon: "layout-dashboard", title: "Dashboard" },
  { route: "inspection", icon: "clipboard-check", title: "Inspection" },
  { route: "hazard", icon: "triangle-alert", title: "Hazard" },
  { route: "incident", icon: "shield-alert", title: "Incident" },
  { route: "environment", icon: "leaf", title: "Environment" }
];

function initializeNavigation() {
  renderSidebar();
  bindNavigationEvents();
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div style="
      width:76px;
      padding:16px 8px;
      border-radius:38px;
      background:rgba(8,20,45,.78);
      backdrop-filter:blur(24px);
      border:1px solid rgba(255,255,255,.08);
      display:flex;
      flex-direction:column;
      gap:14px;
      align-items:center;
    ">
      ${NAV_ITEMS.map(item => `
        <button
          class="dock-btn"
          data-route="${item.route}"
          title="${item.title}"
          style="
            width:60px;
            height:60px;
            border:none;
            border-radius:20px;
            background:${location.hash === "#/"+item.route || (item.route==="dashboard" && location.hash==="") ? "rgba(0,230,118,.16)" : "transparent"};
            color:${location.hash === "#/"+item.route || (item.route==="dashboard" && location.hash==="") ? "#00E676" : "#B8C7E8"};
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
            transition:.2s;
            position:relative;
          ">
          <i data-lucide="${item.icon}" style="width:30px;height:30px;"></i>
        </button>
      `).join("")}
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({
      attrs: {
        width: 30,
        height: 30,
        "stroke-width": 2.2
      }
    });
  }
}

function bindNavigationEvents() {
  document.addEventListener("click", e => {
    const btn = e.target.closest(".dock-btn");
    if (!btn) return;

    location.hash = "#/" + btn.dataset.route;
    renderSidebar();
  });

  window.addEventListener("hashchange", renderSidebar);
}
