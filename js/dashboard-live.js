/* ==========================================
   Dashboard Live Engine v2.0
   CGG HSE Digital Ecosystem
   ========================================== */

const DashboardLive = {

    refreshInterval:30000,
    cacheKey:"cgg_dashboard_cache",

    async refresh(){

        try{

            const res = await apiGet("dashboard");

            if(!res.success){
                throw new Error("Dashboard API gagal.");
            }

            this.updateUI(res);

            this.saveCache(res);

            this.setStatus(true);

        }catch(err){

            console.error("Dashboard Error:",err);

            this.setStatus(false);

            this.loadCache();

        }

    },

    updateUI(res){

        setValue("kpi-inspection",res.kpi.inspection);
        setValue("kpi-finding",res.kpi.finding);
        setValue("kpi-pica",res.kpi.pica);
        setValue("kpi-hazard",res.kpi.hazard);
        setValue("kpi-incident",res.kpi.incident);
        setValue("notif-count",res.notification.unread);

        const hero=document.getElementById("hero-inspection");

        if(hero){
            hero.textContent=res.kpi.inspection;
        }

        const badge=document.querySelector(".badge-success");

        if(badge){
            badge.textContent="System Online";
        }

    },

    saveCache(data){

        try{

            localStorage.setItem(
                this.cacheKey,
                JSON.stringify(data)
            );

        }catch(e){}

    },

    loadCache(){

        try{

            const raw=localStorage.getItem(this.cacheKey);

            if(!raw) return;

            const data=JSON.parse(raw);

            this.updateUI(data);

        }catch(e){}

    },

    setStatus(online){

        const badge=document.querySelector(".badge-success");

        if(!badge) return;

        if(online){

            badge.textContent="System Online";

        }else{

            badge.textContent="Mode Offline";

        }

    }

};

/* ---------- Helper ---------- */

function setValue(id,value){

    const el=document.getElementById(id);

    if(el){
        el.textContent=value ?? 0;
    }

}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded",()=>{

    DashboardLive.refresh();

    setInterval(
        ()=>DashboardLive.refresh(),
        DashboardLive.refreshInterval
    );

});
