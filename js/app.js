/* ==========================================
   CGG HSE Digital Operating System
   App Bootstrap
   Build 16.3 Stable
   Safe Boot Sequence
   ========================================== */

(() => {

"use strict";

async function waitRegistry(retry = 5){

  for(let i = 1; i <= retry; i++){

    try{

      const modules = await CGGLoader.modules();

      if(Array.isArray(modules) && modules.length){

        console.log(`✓ Registry Ready (${modules.length} modules)`);

        return modules;

      }

    }catch(err){

      console.warn(`Registry percobaan ${i}/${retry} gagal`);

      if(i < retry){

        await new Promise(r => setTimeout(r,300));

      }

    }

  }

  console.warn("Registry gagal setelah retry.");

  return [];

}

async function boot(){

  console.log("CGG HDOS Boot Starting...");

  try{

    /* 1. Tunggu registry siap */
    await waitRegistry();

    /* 2. Sidebar */
    if(window.Sidebar){

      await Sidebar.init();

      console.log("✓ Sidebar Ready");

    }

    /* 3. Router */
    if(window.Router){

      await Router.init();

      console.log("✓ Router Ready");

    }

    /* 4. Dashboard Live */
    if(window.DashboardLive?.init){

      DashboardLive.init();

      console.log("✓ Dashboard Live");

    }

    console.log("CGG HDOS Boot Complete");

  }catch(err){

    console.error("Boot Error:", err);

  }

}

window.addEventListener("load", boot);

})();
