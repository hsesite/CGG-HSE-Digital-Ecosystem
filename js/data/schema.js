
/* ==========================================
   CGG HDOS Dynamic Schema Engine
   Build 15.2
   Production Version
   ========================================== */

(() => {
"use strict";

/* ------------------------------
   Header Alias (Dikunci)
------------------------------ */

const ALIAS = {

  "Area":"location",
  "Lokasi Kerja":"location",
  "Work Area":"location",

  "Shift":"shift",

  "Cuaca":"weather",

  "Status":"status",

  "Tanggal":"date",

  "Foto":"image"

};

/* ------------------------------
   Field Intelligence
------------------------------ */

function detectType(header){

  const h=header.toLowerCase();

  if(h.includes("foto")) return "image";

  if(h.includes("tanggal")) return "date";

  if(h.includes("status")) return "select";

  if(h.includes("severity")) return "select";

  if(h.includes("shift")) return "select";

  if(h.includes("cuaca")) return "select";

  if(h.includes("keterangan")) return "textarea";

  return "text";

}

/* ------------------------------
   Build Schema
------------------------------ */

function build(headers){

  return headers.map(header=>({

    label:header,

    key:ALIAS[header]||header.toLowerCase().replace(/\s+/g,"_"),

    type:detectType(header)

  }));

}

/* ------------------------------
   Get Schema
------------------------------ */

async function get(sheet){

  /* Coba cache dulu */

  const cached=await CGGCache.load(`schema:${sheet}`);

  if(cached){

    return cached.data;

  }

  /* Ambil dari server */

  const rows=await CGGConfig.load(sheet);

  if(!rows||!rows.length){

    return [];

  }

  const headers=Object.keys(rows[0]);

  const schema=build(headers);

  await CGGCache.save(`schema:${sheet}`,schema);

  return schema;

}

/* ------------------------------
   Public API
------------------------------ */

window.CGGSchema={

  get,
  build,
  detectType

};

})();
