
/* ==========================================
   CGG HDOS Schema Signature Engine
   Build 15.3
   FNV-1a 32bit
   ========================================== */

(() => {
"use strict";

/* ==========================
   Generate Signature
   ========================== */

function hash(headers){

  const text=headers.join("|");

  let h=0x811c9dc5;

  for(let i=0;i<text.length;i++){

    h^=text.charCodeAt(i);

    h=(h>>>0)*0x01000193;

  }

  return (h>>>0)
    .toString(16)
    .toUpperCase()
    .padStart(8,"0");

}

/* ==========================
   Compare Signature
   ========================== */

function changed(oldSig,newSig){

  return oldSig!==newSig;

}

/* ==========================
   Public API
   ========================== */

window.CGGSignature={

  hash,
  changed

};

})();
