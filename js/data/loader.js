/* ==========================================
   CGG HDOS Loader Engine
   Build 18.3 Production
   Foundation Lock
   Compatible with Build 16.2
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

const DEFAULT_ENDPOINT =
"https://script.google.com/macros/s/AKfycbxI1I0jxW14JY_H4gwqoVYkxdpCY635lm-LAPZVdh0-zwN9vK_yalQSLjAFkiho6Tkp9g/exec";

function getEndpoint(){

  let endpoint = localStorage.getItem("CGG_ENDPOINT");

  if(!endpoint){

    endpoint = DEFAULT_ENDPOINT;
    localStorage.setItem("CGG_ENDPOINT",endpoint);

  }

  return endpoint;

}

function setEndpoint(url){

  localStorage.setItem("CGG_ENDPOINT",url);

}

/* ==========================
   Memory Cache
   ========================== */

const memoryCache = new Map();
let registryCache = null;

/* ==========================
   Generic Fetch JSON
   ========================== */

async function fetchJSON(action,params={}){

  const endpoint=getEndpoint();

  const query=new URLSearchParams({
    action,
    ...params,
    _:Date.now()
  });

  const res=await fetch(`${endpoint}?${query.toString()}`,{
    method:"GET",
    cache:"no-store",
    redirect:"follow"
  });

  if(!res.ok){

    throw new Error(`${action} gagal (${res.status})`);

  }

  return await res.json();

}

/* ==========================
   Load Sheet
   ========================== */

async function load(sheet){

  if(memoryCache.has(sheet)){

    return memoryCache.get(sheet);

  }

  const data=await fetchJSON("get",{sheet});

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
  registryCache=null;

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
   Build 18.3
   Memory Registry Cache
   ========================================== */

CGGLoader.modules=async function(force=false){

  if(registryCache && !force){

    return registryCache;

  }

  const json=await fetchJSON("registry");

  if(!json.success){

    throw new Error(json.message||"Registry gagal.");

  }

  registryCache=json.modules||[];

  return registryCache;

};

/* ==========================================
   Module Manifest Loader
   Build 18.3
   ========================================== */

CGGLoader.manifest=async function(module){

  const json=await fetchJSON("manifest",{module});

  return json;

};

/* ==========================================
   Dynamic Schema Loader
   Build 18.3
   Smart Cache
   ========================================== */

CGGLoader.schema=async function(module){

  const cacheKey=`schema_${module}`;

  if(window.CGGCache){

    const cached=await CGGCache.load(cacheKey);

    if(cached?.data){

      refreshSchema(module,cacheKey);

      return cached.data;

    }

  }

  const json=await fetchJSON("schema",{sheet:module});

  if(json.success && window.CGGCache){

    await CGGCache.save(cacheKey,json);

  }

  return json;

};

/* ==========================================
   Background Refresh
   ========================================== */

async function refreshSchema(module,cacheKey){

  try{

    const json=await fetchJSON("schema",{sheet:module});

    if(json.success && window.CGGCache){

      await CGGCache.save(cacheKey,json);

    }

  }catch(err){

    console.warn(`Schema refresh ${module} gagal`,err);

  }

}

/* ==========================================
   Health Check
   ========================================== */

CGGLoader.health=async function(){

  return await fetchJSON("ping");

};

})();
