/* ==========================================
   CGG HDOS Mobile Engine
   Build 10E
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

    console.log("✓ Mobile Engine 10E");

  },

  createFloatingButton(){

    if(document.getElementById("mobile-menu-btn")) return;

    const btn=document.createElement("button");

    btn.id="mobile-menu-btn";
    btn.innerHTML="☰";

    btn.style.cssText=`
      position:fixed;
      top:12px;
      left:12px;
      width:42px;
      height:42px;
      border:none;
      background:transparent;
      color:#fff;
      font-size:24px;
      font-weight:600;
      cursor:pointer;
      z-index:10002;
      display:flex;
      align-items:center;
      justify-content:center;
      transition:
        transform .25s ease,
        color .25s ease;
      -webkit-tap-highlight-color:transparent;
    `;

    const updateButton=()=>{

      const open=document.body.classList.contains("sidebar-open");

      btn.innerHTML=open?"✕":"☰";
      btn.style.transform=open?"rotate(90deg)":"rotate(0deg)";

    };

    btn.onclick=(e)=>{

      e.stopPropagation();

      document.body.classList.toggle("sidebar-open");

      updateButton();

    };

    btn.onpointerdown=()=>{

      btn.style.transform+=" scale(.90)";

    };

    btn.onpointerup=()=>{

      updateButton();

    };

    btn.onpointerleave=()=>{

      updateButton();

    };

    document.body.appendChild(btn);

    updateButton();

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

    const btn=document.getElementById("mobile-menu-btn");

    if(btn){

      btn.innerHTML="☰";
      btn.style.transform="rotate(0deg)";

    }

  }

};

window.MobileEngine=Mobile;

document.addEventListener("DOMContentLoaded",()=>Mobile.init());

})();
