/* ==========================================
   Live Dashboard Engine v1.0
   ========================================== */

async function refreshDashboard(){

  try{

    const data=await apiGet("dashboard");

    if(!data.success) return;

    setText("kpi-inspection",data.kpi.inspection);
    setText("kpi-finding",data.kpi.finding);
    setText("kpi-pica",data.kpi.pica);
    setText("kpi-hazard",data.kpi.hazard);
    setText("kpi-incident",data.kpi.incident);
    setText("notif-count",data.notification.unread);

  }catch(err){

    console.error(err);

  }

}

function setText(id,value){

  const el=document.getElementById(id);

  if(el){
    el.textContent=value;
  }

}

document.addEventListener("DOMContentLoaded",()=>{

  refreshDashboard();

  setInterval(refreshDashboard,30000);

});
