
/* =========================================
   CGG HSE Digital Ecosystem
   Sidebar v4 (Force Size)
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

  const current = location.hash.replace("#/","") || "dashboard";

  sidebar.innerHTML = `
    <div style="
      width:76px;
      padding:18px 8px;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:14px;
      border-radius:38px;
      background:rgba(8,20,45,.78);
      border:1px solid rgba(255,255,255,.08);
      backdrop-filter:blur(24px);
    ">
      ${NAV_ITEMS.map(item=>`
        <button
          class="dock-btn"
          data-route="${item.route}"
          title="${item.title}"
          style="
            width:60px;
            height:60px;
            display:flex;
            align-items:center;
            justify-content:center;
            border:none;
            border-radius:20px;
            cursor:pointer;
            transition:.2s;
            background:${current===item.route ? "rgba(0,230,118,.16)" : "transparent"};
            color:${current===item.route ? "#00E676" : "#B8C7E8"};
            position:relative;
          ">
          <i data-lucide="${item.icon}"></i>
        </button>
      `).join("")}
    </div>
  `;

  // PAKSA ukuran ikon
  if (window.lucide) {
    window.lucide.createIcons({
      attrs:{
        width:32,
        height:32,
        "stroke-width":2.4
      }
    });
  }

  // Kalau createIcons tetap memberi ukuran default,
  // paksa lagi lewat JS.
  sidebar.querySelectorAll("svg").forEach(svg=>{
    svg.setAttribute("width","32");
    svg.setAttribute("height","32");
    svg.style.width="32px";
    svg.style.height="32px";
  });
}

function bindNavigationEvents(){

  document.removeEventListener("click", window.__dockClickHandler);

  window.__dockClickHandler=function(e){

    const btn=e.target.closest(".dock-btn");

    if(!btn) return;

    location.hash="#/"+btn.dataset.route;

    renderSidebar();

  };

  document.addEventListener("click",window.__dockClickHandler);

  window.removeEventListener("hashchange",renderSidebar);
  window.addEventListener("hashchange",renderSidebar);

}
