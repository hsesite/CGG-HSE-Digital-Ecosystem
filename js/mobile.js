/* ==========================================
   CGG HDOS Mobile Engine
   Build 10A
   HP ONLY
   Desktop LOCK
   ========================================== */

(() => {
"use strict";

const Mobile = {

  breakpoint:768,

  init(){

    if(window.innerWidth > this.breakpoint) return;

    document.body.classList.add("mobile-mode");

    this.closeSidebar();

    this.bindToggle();

    this.bindOverlay();

    this.bindResize();

    console.log("✓ Mobile Engine");

  },

  bindToggle(){

    const btn=document.getElementById("sb-toggle");

    if(!btn) return;

    btn.addEventListener("click",(e)=>{

      e.stopPropagation();

      document.body.classList.toggle("sidebar-open");

    });

  },

  bindOverlay(){

    document.addEventListener("click",(e)=>{

      if(window.innerWidth>this.breakpoint) return;

      const sidebar=document.getElementById("sidebar");

      const btn=document.getElementById("sb-toggle");

      if(!sidebar) return;

      if(
        document.body.classList.contains("sidebar-open") &&
        !sidebar.contains(e.target) &&
        e.target!==btn
      ){
        this.closeSidebar();
      }

    });

  },

 bindResize(){

  window.addEventListener("resize",()=>{

    if(window.innerWidth>this.breakpoint){

    }

  });

}

  closeSidebar(){

    document.body.classList.remove("sidebar-open");

  }

};

window.MobileEngine=Mobile;

document.addEventListener("DOMContentLoaded",()=>{

  Mobile.init();

});

})();
