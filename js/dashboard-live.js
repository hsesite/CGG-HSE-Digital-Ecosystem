/* ==========================================
   Dashboard Live Engine v1.0
   CGG HSE Digital Ecosystem
   ========================================== */

async function refreshDashboard(){

  try{

    const res = await apiGet("dashboard");

    if(!res.success){
      console.error("Dashboard API gagal.");
      return;
    }

    setValue("kpi-inspection", res.kpi.inspection);
    setValue("kpi-finding", res.kpi.finding);
    setValue("kpi-pica", res.kpi.pica);
    setValue("kpi-hazard", res.kpi.hazard);
    setValue("kpi-incident", res.kpi.incident);
    setValue("notif-count", res.notification.unread);

    const hero = document.getElementById("hero-inspection");
    if(hero){
      hero.textContent = res.kpi.inspection;
    }

  }catch(err){

    console.error("Dashboard Error:", err);

  }

}

function setValue(id,value){

  const el=document.getElementById(id);

  if(el){
    el.textContent=value;
  }

}

document.addEventListener("DOMContentLoaded",()=>{

  refreshDashboard();

  setInterval(refreshDashboard,30000);

});
