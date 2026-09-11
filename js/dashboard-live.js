/* ==========================================
   CGG HDOS Dashboard Live Engine
   Build 7.1 (Dependency Safe)
   ========================================== */

/* ---------- Compatibility Layer ---------- */

window.DashboardState = window.DashboardState || {
  inspection: 0,
  finding: 0,
  pica: 0,
  ptw: 0,
  notifications: [],
  contractor: {},
  liveActivity: []
};

window.DashboardLive = (() => {

  let refreshTimer = null;
  let initialized = false;

  /* ==========================================
     Refresh Dashboard Data
     ========================================== */

  async function refresh() {

    try {

      if (
        window.DashboardAPI &&
        typeof DashboardAPI.getSummary === "function"
      ) {

        const summary = await DashboardAPI.getSummary();

        DashboardState.inspection = summary.inspection || 0;
        DashboardState.finding = summary.finding || 0;
        DashboardState.pica = summary.pica || 0;
        DashboardState.ptw = summary.ptw || 0;

      } else {

        /* Fallback sementara */

        DashboardState.inspection ||= 5;
        DashboardState.finding ||= 10;
        DashboardState.pica ||= 10;
        DashboardState.ptw ||= 2;

      }

      updateDOM();

    } catch (err) {

      console.error("Dashboard Error:", err);

      DashboardState.inspection ||= 5;
      DashboardState.finding ||= 10;
      DashboardState.pica ||= 10;
      DashboardState.ptw ||= 2;

      updateDOM();

    }

  }

  /* ==========================================
     Update KPI ke Dashboard
     ========================================== */

  function updateDOM() {

    setText("kpi-inspection", DashboardState.inspection);
    setText("kpi-finding", DashboardState.finding);
    setText("kpi-pica", DashboardState.pica);
    setText("kpi-ptw", DashboardState.ptw);

  }

  function setText(id, value) {

    const el = document.getElementById(id);
    if (el) el.textContent = value;

  }

  /* ==========================================
     Live Timer
     ========================================== */

  function start() {

    if (initialized) return;

    initialized = true;

    refresh();

    refreshTimer = setInterval(refresh, 30000);

  }

  function stop() {

    initialized = false;

    if (refreshTimer) {

      clearInterval(refreshTimer);
      refreshTimer = null;

    }

  }

  /* ==========================================
     Public API
     ========================================== */

  return {

    refresh,
    start,
    stop

  };

})();

/* ==========================================
   Legacy Compatibility
   ========================================== */

window.initializeDashboardLive = function () {
  DashboardLive.start();
};
