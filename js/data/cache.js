
/* ==========================================
   CGG HDOS Cache Engine
   Build 15.1
   Persistent Config Cache
   ========================================== */

(() => {
"use strict";

const DB_NAME = "CGG_HDOS_DB";
const DB_VERSION = 2; // naik dari v1 agar store "config" dibuat

let dbPromise = null;

/* ==========================
   Open Database
   ========================== */

function openDB(){

  if(dbPromise) return dbPromise;

  dbPromise = new Promise((resolve,reject)=>{

    const req = indexedDB.open(DB_NAME,DB_VERSION);

    req.onupgradeneeded = (e)=>{

      const db = e.target.result;

      if(!db.objectStoreNames.contains("config")){

        const store = db.createObjectStore("config",{
          keyPath:"key"
        });

        store.createIndex("updatedAt","updatedAt");

      }

    };

    req.onsuccess=()=>resolve(req.result);

    req.onerror=()=>reject(req.error);

  });

  return dbPromise;

}

/* ==========================
   Save Config
   ========================== */

async function save(key,data,version=1){

  const db=await openDB();

  return new Promise((resolve,reject)=>{

    const tx=db.transaction("config","readwrite");

    tx.objectStore("config").put({

      key,
      version,
      updatedAt:new Date().toISOString(),
      data

    });

    tx.oncomplete=()=>resolve(true);

    tx.onerror=()=>reject(tx.error);

  });

}

/* ==========================
   Load Config
   ========================== */

async function load(key){

  const db=await openDB();

  return new Promise((resolve,reject)=>{

    const req=db
      .transaction("config")
      .objectStore("config")
      .get(key);

    req.onsuccess=()=>resolve(req.result||null);

    req.onerror=()=>reject(req.error);

  });

}

/* ==========================
   Delete Config
   ========================== */

async function remove(key){

  const db=await openDB();

  return new Promise((resolve,reject)=>{

    const tx=db.transaction("config","readwrite");

    tx.objectStore("config").delete(key);

    tx.oncomplete=()=>resolve(true);

    tx.onerror=()=>reject(tx.error);

  });

}

/* ==========================
   Clear All
   ========================== */

async function clear(){

  const db=await openDB();

  return new Promise((resolve,reject)=>{

    const tx=db.transaction("config","readwrite");

    tx.objectStore("config").clear();

    tx.oncomplete=()=>resolve(true);

    tx.onerror=()=>reject(tx.error);

  });

}

/* ==========================
   List All
   ========================== */

async function list(){

  const db=await openDB();

  return new Promise((resolve,reject)=>{

    const req=db
      .transaction("config")
      .objectStore("config")
      .getAll();

    req.onsuccess=()=>resolve(req.result);

    req.onerror=()=>reject(req.error);

  });

}

/* ==========================
   Public API
   ========================== */

window.CGGCache={

  openDB,
  save,
  load,
  remove,
  clear,
  list

};

})();
