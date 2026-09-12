/* ==========================================
   BUILD 12.6
   Apple Dynamic Light
   HP ONLY
   Struktur Tetap
   ========================================== */

(() => {
"use strict";

const MobileEffects = {

  breakpoint:768,

  init(){

    if(window.innerWidth>this.breakpoint) return;

    this.bindCards();

    window.addEventListener("resize",()=>{
      if(window.innerWidth<=this.breakpoint){
        this.bindCards();
      }
    });

    console.log("✓ Apple Dynamic Light");

  },

  bindCards(){

    const cards=document.querySelectorAll(
      ".card,.dashboard-card,.metric-card,.zone-card,.quick-card,.hero-card,.dashboard-header"
    );

    cards.forEach(card=>{

      if(card.dataset.lightBound) return;
      card.dataset.lightBound="1";

      card.addEventListener("pointermove",(e)=>{

        const r=card.getBoundingClientRect();

        const x=((e.clientX-r.left)/r.width)*100;
        const y=((e.clientY-r.top)/r.height)*100;

        card.style.setProperty("--mx",x+"%");
        card.style.setProperty("--my",y+"%");

      });

      card.addEventListener("pointerleave",()=>{

        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");

      });

    });

  }

};

document.addEventListener("DOMContentLoaded",()=>MobileEffects.init());

})();
