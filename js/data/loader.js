/* ==========================================
   CGG HDOS Loader Engine
   Build 18.2
   ========================================== */

(function(){

"use strict";

/* Namespace Loader */
window.CGGLoader = window.CGGLoader || {};

})();

/* ==========================================
   CGG HDOS Config Loader
   Build 15.0
   Core Foundation
   ========================================== */

(() => {
"use strict";

/* Endpoint akan dipindahkan ke Settings nanti */
let API_URL = "";

/* Cache sementara di memory */
const memoryCache = new Map();

/* ==========================
   Set Endpoint
   ========================== */

function setEndpoint(url){
  API_URL = url;
}

/* ==========================
   Load Sheet
   ========================== */

async function load(sheet){

  if(memoryCache.has(sheet)){
    return memoryCache.get(sheet);
  }

  if(!API_URL){
    throw new Error("API endpoint belum diset.");
  }

  const res = await fetch(
    `${API_URL}?action=get&sheet=${encodeURIComponent(sheet)}`
  );

  if(!res.ok){
    throw new Error(`Gagal mengambil sheet ${sheet}`);
  }

  const data = await res.json();

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
   Public API
   ========================== */

window.CGGConfig = {

  setEndpoint,
  load,
  clear

};
})();

/* ==========================================
   Dynamic Module Loader
   Build 18.2
   ========================================== */

CGGLoader.modules = async function(){

  const endpoint =
    localStorage.getItem("CGG_ENDPOINT") ||
    CGGConfig.endpoint;

  const res = await fetch(`${endpoint}?action=registry`);

  const json = await res.json();

  if(!json.success) return [];

  return json.modules;

};
   

