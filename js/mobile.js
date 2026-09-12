/* ==========================================
   CGG HDOS Mobile Engine
   Build 10D
   HP ONLY
   Desktop LOCK
   ========================================== */

(() => {
"use strict";

const Mobile = {

  breakpoint:768,

  init(){

    if(window.innerWidth>this.breakpoint) return;

    this.createFloatingButton();
    this.closeSidebar();
    this.bindOverlay();
    this.bindResize();

    console.log("✓ Mobile Engine");

  },

  createFloatingButton(){

    if(document.getElementById("mobile-menu-btn")) return;

    const btn=document.createElement("button");

    btn.id="mobile-menu-btn";

    btn.innerHTML="☰";

    btn.style.cssText=`
      position:fixed;
      top:16px;
      left:16px;
      width:46px;
      height:46px;
      border:none;
      border-radius:14px;
      background:rgba(12,22,45,.95);
      color:white;
      font-size:22px;
      cursor:pointer;
      z-index:10001;
      box-shadow:0 10px 30px rgba(0,0,0,.35);
      backdrop-filter:blur(20px);
    `;

    btn.onclick=(e)=>{

      e.stopPropagation();

      document.body.classList.toggle("sidebar-open");

    };

    document.body.appendChild(btn);

  },

  bindOverlay(){

    document.addEventListener("click",(e)=>{

      if(window.innerWidth>this.breakpoint) return;

      const sidebar=document.getElementById("sidebar");
      const btn=document.getElementById("mobile-menu-btn");

      if(
        document.body.classList.contains("sidebar-open") &&
        sidebar &&
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

        this.closeSidebar();

        document.getElementById("mobile-menu-btn")?.remove();

      }else{

        this.createFloatingButton();

      }

    });

  },

  closeSidebar(){

    document.body.classList.remove("sidebar-open");

  }

};

window.MobileEngine=Mobile;

document.addEventListener("DOMContentLoaded",()=>Mobile.init());

})();
