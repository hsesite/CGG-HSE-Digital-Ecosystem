/* ==========================================
   CGG HDOS Loader Engine
   Build 18.2.1 Production
   C-039 Endpoint Registry Constitution
   ========================================== */

(() => {

"use strict";

/* ==========================
   Namespace
   ========================== */

window.CGGLoader = window.CGGLoader || {};

/* ==========================
   Endpoint Registry
   ========================== */

/* Default backend (boleh diganti admin nanti) */
const DEFAULT_ENDPOINT =
"https://script.google.com/macros/s/AKfycbxI1I0jxW14JY_H4gwqoVYkxdpCY635lm-LAPZVdh0-zwN9vK_yalQSLjAFkiho6Tkp9g/exec";

/* Ambil endpoint aktif */
   
function getEndpoint(){

  let endpoint = localStorage.getItem("CGG_ENDPOINT");

  if(!endpoint){

    endpoint = DEFAULT_ENDPOINT;
    localStorage.setItem("CGG_ENDPOINT", endpoint);

  }

  return endpoint;

}

/* Simpan endpoint */
function setEndpoint(url){

  localStorage.setItem("CGG_ENDPOINT",url);

}

/* ==========================
   Memory Cache
   ========================== */

const memoryCache=new Map();

/* ==========================
   Load Sheet
   ========================== */

async function load(sheet){

  if(memoryCache.has(sheet)){

    return memoryCache.get(sheet);

  }

  const endpoint=getEndpoint();

  const res=await fetch(

    `${endpoint}?action=get&sheet=${encodeURIComponent(sheet)}`

  );

  if(!res.ok){

    throw new Error(`Gagal mengambil sheet ${sheet}`);

  }

  const data=await res.json();

  memoryCache.set(sheet,data);

  return data;

}

/* ==========================
   Clear Cache
   ========================== */

function clear(sheet=null){

  if(sheet){

    memoryCache.delete(sheet);

    return;

  }

  memoryCache.clear();

}

/* ==========================
   Public Config API
   ========================== */

window.CGGConfig={

  setEndpoint,

  get endpoint(){

    return getEndpoint();

  },

  load,

  clear

};

/* ==========================================
   Dynamic Module Loader
   Build 18.2.1
   ========================================== */

CGGLoader.modules=async function(){

  const endpoint=CGGConfig.endpoint;

  const res=await fetch(

    `${endpoint}?action=registry`

  );

  if(!res.ok){

    throw new Error(`Registry gagal (${res.status})`);

  }

  const json=await res.json();

  if(!json.success){

    return [];

  }

  return json.modules;

};

/* ==========================================
   Dynamic Schema Loader
   ========================================== */

CGGLoader.schema=async function(sheet){

  const endpoint=CGGConfig.endpoint;

  const res=await fetch(

    `${endpoint}?action=schema&sheet=${encodeURIComponent(sheet)}`

  );

  return res.json();

};

/* ==========================================
   Health Check
   ========================================== */

CGGLoader.health=async function(){

  const endpoint=CGGConfig.endpoint;

  const res=await fetch(

    `${endpoint}?action=ping`

  );

  return res.json();

};

})();
