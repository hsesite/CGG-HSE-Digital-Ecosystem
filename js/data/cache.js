/* ==========================================
   CGG HDOS Cache Engine
   Build 15.5 Production
   Core Foundation (Frozen)
   ========================================== */

(() => {
"use strict";

/* ==========================================
   Database Configuration
   ========================================== */

const DB_NAME = "CGG_HDOS_DB";
const DB_VERSION = 4;

let dbPromise = null;

/* ==========================================
   Open Database
   ========================================== */

function openDB(){

  if(dbPromise) return dbPromise;

  dbPromise = new Promise((resolve,reject)=>{

    const req = indexedDB.open(DB_NAME,DB_VERSION);

    req.onupgradeneeded = (e)=>{

      const db = e.target.result;

      /* ---------- Config Store ---------- */

      if(!db.objectStoreNames.contains("config")){

        const store = db.createObjectStore("config",{
          keyPath:"key"
        });

        store.createIndex("updatedAt","updatedAt");

      }

      /* ---------- System Log ---------- */

      if(!db.objectStoreNames.contains("systemlog")){

        const log = db.createObjectStore("systemlog",{
          keyPath:"id",
          autoIncrement:true
        });

        log.createIndex("time","time");

      }

      /* ---------- Universal Queue ---------- */

      if(!db.objectStoreNames.contains("queue")){

        const queue = db.createObjectStore("queue",{
          keyPath:"id"
        });

        queue.createIndex("status","status");
        queue.createIndex("module","module");
        queue.createIndex("createdAt","createdAt");
        queue.createIndex("priority","priority");
        queue.createIndex("tenant","tenant");
        queue.createIndex("company","company");

      }

    };

    req.onsuccess = ()=>resolve(req.result);

    req.onerror = ()=>reject(req.error);

  });

  return dbPromise;

}

/* ==========================================
   CONFIG STORE
   ========================================== */

async function save(key,data,version=1){

  const db = await openDB();

  return new Promise((resolve,reject)=>{

    const tx = db.transaction("config","readwrite");

    tx.objectStore("config").put({

      key,
      version,
      updatedAt:new Date().toISOString(),
      data

    });

    tx.oncomplete = ()=>resolve(true);

    tx.onerror = ()=>reject(tx.error);

  });

}

async function load(key){

  const db = await openDB();

  return new Promise((resolve,reject)=>{

    const req = db
      .transaction("config")
      .objectStore("config")
      .get(key);

    req.onsuccess = ()=>resolve(req.result || null);

    req.onerror = ()=>reject(req.error);

  });

}

async function remove(key){

  const db = await openDB();

  return new Promise((resolve,reject)=>{

    const tx = db.transaction("config","readwrite");

    tx.objectStore("config").delete(key);

    tx.oncomplete = ()=>resolve(true);

    tx.onerror = ()=>reject(tx.error);

  });

}

async function clear(){

  const db = await openDB();

  return new Promise((resolve,reject)=>{

    const tx = db.transaction("config","readwrite");

    tx.objectStore("config").clear();

    tx.oncomplete = ()=>resolve(true);

    tx.onerror = ()=>reject(tx.error);

  });

}

async function list(){

  const db = await openDB();

  return new Promise((resolve,reject)=>{

    const req = db
      .transaction("config")
      .objectStore("config")
      .getAll();

    req.onsuccess = ()=>resolve(req.result);

    req.onerror = ()=>reject(req.error);

  });

}

/* ==========================================
   Health Check
   ========================================== */

async function health(){

  const db = await openDB();

  return {
    name: db.name,
    version: db.version,
    stores: [...db.objectStoreNames]
  };

}

/* ==========================================
   Public API
   ========================================== */

window.CGGCache = {

  openDB,

  save,
  load,
  remove,
  clear,
  list,

  health

};

})();
