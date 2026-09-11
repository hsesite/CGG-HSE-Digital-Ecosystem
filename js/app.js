
/* =========================================
   CGG HSE Digital Ecosystem
   Core Bootstrap v1.0
   ========================================= */

const APP = {
    name: "CGG HSE Digital Ecosystem",
    version: "7.0.0",
    build: "Sprint-3",
    initialized: false
};

function hideLoadingScreen() {
    const loading = document.getElementById("loading-screen");
    if (!loading) return;

    loading.style.opacity = "0";

    setTimeout(() => {
        loading.style.display = "none";
    }, 300);
}

function appHealthCheck() {

    console.group("CGG HSE System Check");

    console.log("Version:", APP.version);
    console.log("Build:", APP.build);
    console.log("Browser:", navigator.userAgent);

    console.groupEnd();

}

function initializeApp() {

    if (APP.initialized) return;

    APP.initialized = true;

    appHealthCheck();
   
    initializeRouter();

    initializeNavigation();

    window.setTimeout(hideLoadingScreen, 600);

}

window.addEventListener("DOMContentLoaded", initializeApp);
/* ==========================================
   Enterprise Modal Manager
   FF-01B
   ========================================== */

window.EnterpriseModal = (() => {

  let backdrop = null;
  let modal = null;
  let body = null;

  function ensure() {

    if (backdrop) return;

    backdrop = document.createElement("div");
    backdrop.className = "enterprise-backdrop";

    modal = document.createElement("div");
    modal.className = "enterprise-modal";

    modal.innerHTML = `
      <div class="enterprise-modal-header">

        <div style="display:flex;align-items:center;gap:14px;">

          <div class="enterprise-handle"></div>

          <div class="enterprise-title">
            <strong id="modal-title">Workspace</strong>
            <small id="modal-subtitle">CGG HSE Digital Ecosystem</small>
          </div>

        </div>

        <button class="enterprise-close">✕</button>

      </div>

      <div class="enterprise-modal-body" id="enterprise-body"></div>
    `;

    body = modal.querySelector("#enterprise-body");

    document.body.append(backdrop, modal);

    backdrop.onclick = close;

    modal.querySelector(".enterprise-close").onclick = close;

    document.addEventListener("keydown", e => {

      if (e.key === "Escape") close();

    });

  }

  function open(title, element) {

    ensure();

    document.getElementById("modal-title").textContent = title;

    body.innerHTML = "";

    return body;

    backdrop.classList.add("show");
    modal.classList.add("show");

    document.body.style.overflow = "hidden";

  }

  function close() {

    if (!backdrop) return;

    backdrop.classList.remove("show");
    modal.classList.remove("show");

    document.body.style.overflow = "";

  }

  return { open, close };

})();
