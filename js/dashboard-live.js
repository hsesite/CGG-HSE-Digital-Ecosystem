/* ==========================================
   Compatibility Layer
   ========================================== */

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
   Dashboard Live Engine v2.1
   CGG HSE Digital Ecosystem
   ========================================== */

const DashboardLive={

    timer:null,

    async refresh(){

        try{

            const res=await apiGet("dashboard");

            if(!res.success){

                console.error("Dashboard API gagal.");

                return;

            }

            /* ---------- Simpan ke DashboardState ---------- */

            DashboardState.inspection=res.kpi.inspection;
            DashboardState.finding=res.kpi.finding;
            DashboardState.pica=res.kpi.pica;
            DashboardState.hazard=res.kpi.hazard;
            DashboardState.incident=res.kpi.incident;
            DashboardState.notification=res.notification.unread;

            /* ---------- Update Hero ---------- */

            setValue("hero-inspection",DashboardState.inspection);

            /* ---------- Update KPI ---------- */

            setValue("kpi-inspection",DashboardState.inspection);
            setValue("kpi-finding",DashboardState.finding);
            setValue("kpi-pica",DashboardState.pica);
            setValue("kpi-hazard",DashboardState.hazard);
            setValue("kpi-incident",DashboardState.incident);
            setValue("notif-count",DashboardState.notification);

        }catch(err){

            console.error("Dashboard Error:",err);

        }

    },

    start(){

        if(this.timer){

            clearInterval(this.timer);

        }

        this.refresh();

        this.timer=setInterval(()=>{

            this.refresh();

        },30000);

    },

    stop(){

        if(this.timer){

            clearInterval(this.timer);

            this.timer=null;

        }

    }

};

/* ---------- Helper ---------- */

function setValue(id,value){

    const el=document.getElementById(id);

    if(el){

        el.textContent=value;

    }

}

/* ---------- Auto Start ---------- */

document.addEventListener("DOMContentLoaded",()=>{

    DashboardLive.start();

});
