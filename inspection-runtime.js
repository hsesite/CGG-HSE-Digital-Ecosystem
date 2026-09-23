
/* ==========================================
   Legacy Runtime Shim
   Build 28 Enterprise

   File ini sengaja dipertahankan untuk
   kompatibilitas lama.

   Runtime utama sekarang berada di:
   js/inspection/runtime-engine.js
   ========================================== */

(() => {

  "use strict";

  if (window.HDOSInspectionRuntime) {
    console.info("HDOS Runtime menggunakan engine baru.");
    return;
  }

  console.warn(
    "Legacy inspection-runtime.js dimuat tanpa runtime-engine.js"
  );

})();