/* ==========================================
   CGG HSE Digital Operating System
   App Bootstrap
   Build 16.3 Stable (Locked)
   Original Boot Sequence Recovery
   ========================================== */

(() => {

"use strict";

/* ==========================================
   Registry Waiter
   ========================================== */

async function waitRegistry(retry = 5){

  for(let i=1;i<=retry;i++){

    try{

      const modules = await CGGLoader.modules();

      if(Array.isArray(modules) && modules.length){

        console.log(`✓ Registry Ready (${modules.length} modules)`);

        return modules;

      }

    }catch(err){

      console.warn(`Registry percobaan ${i}/${retry} gagal`);

      if(i<retry){

        await new Promise(r=>setTimeout(r,300));

      }

    }

  }

  console.warn("Registry gagal setelah retry.");

  return [];

}

/* ==========================================
   Boot Sequence
   ========================================== */

async function boot(){

  console.log("CGG HDOS Boot Starting...");

  try{

    /* 1. Sidebar langsung dibuat (shell muncul dulu) */
    if(window.Sidebar){

      await Sidebar.init();

      console.log("✓ Sidebar Ready");

    }

    /* 2. Router langsung aktif */
    if(window.Router){

      await Router.init();

      console.log("✓ Router Ready");

    }

    /* 3. Registry dimuat di belakang layar */
    const modules = await waitRegistry();

    /* 4. Kalau registry berhasil, refresh isi sidebar */
    if(modules.length && window.Sidebar?.refresh){

      await Sidebar.refresh();

    }

    /* 5. Dashboard Live */
    if(window.DashboardLive?.init){

      DashboardLive.init();

      console.log("✓ Dashboard Live");

    }

    console.log("CGG HDOS Boot Complete");

  }catch(err){

    console.error("Boot Error:",err);

  }

}

/* ==========================================
   Start
   ========================================== */

window.addEventListener("load",boot);

})();
