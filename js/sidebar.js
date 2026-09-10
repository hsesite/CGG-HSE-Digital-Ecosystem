
/* =========================================
   CGG HSE Digital Ecosystem
   Navigation UI v1.0
   ========================================= */

const PRIMARY_NAV = [
  "dashboard",
  "inspection",
  "hazard",
  "incident",
  "environment"
];

function createNavItem(routeKey, mobile = false) {
  const route = Router.routes[routeKey];
  const active = Router.currentRoute === routeKey ? "active" : "";

  const cls = mobile ? "mobile-nav-item" : "dock-item";

  return `
    <button
      class="${cls} ${active}"
      data-route="${routeKey}"
      title="${route.title}">
        <i data-lucide="${route.icon}"></i>
        ${mobile ? `<span>${route.title.split(" ")[0]}</span>` : ""}
    </button>
  `;
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="dock">
      ${PRIMARY_NAV.map(route => createNavItem(route)).join("")}
    </div>
  `;
}

function renderMobileNav() {
  const nav = document.getElementById("mobile-nav");
  if (!nav) return;

  nav.innerHTML = PRIMARY_NAV
    .map(route => createNavItem(route, true))
    .join("");
}

function bindNavigationEvents() {
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-route]");
    if (!btn) return;

    navigate(btn.dataset.route);
  });
}

function refreshNavigation() {
  renderSidebar();
  renderMobileNav();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function initializeNavigation() {
  refreshNavigation();
  bindNavigationEvents();
}
