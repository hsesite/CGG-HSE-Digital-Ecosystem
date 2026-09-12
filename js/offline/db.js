
/* ==========================================
   CGG HDOS Offline Database
   Build 1.0
   IndexedDB Core Engine
   ========================================== */

(() => {
"use strict";

const DB_NAME = "CGG_HDOS_DB";
const DB_VERSION = 1;

const STORES = [
  "inspection",
  "hazard",
  "incident",
  "ptw",
  "pica",
  "audit",
  "environment",
  "syncQueue",
  "settings"
];

let db = null;

/* ==========================
   OPEN DATABASE
   ========================== */

function open(){

  return new Promise((resolve,reject)=>{

    if(db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = e=>{

      const database = e.target.result;

      STORES.forEach(store=>{

        if(!database.objectStoreNames.contains(store)){

          database.createObjectStore(store,{
            keyPath:"id"
          });

        }

      });

    };

    request.onsuccess = e=>{

      db = e.target.result;

      console.log("✓ IndexedDB aktif");

      resolve(db);

    };

    request.onerror = ()=>{

      reject("IndexedDB gagal dibuka");

    };

  });

}

/* ==========================
   SAVE
   ========================== */

async function save(store,data){

  const database = await open();

  return new Promise((resolve,reject)=>{

    const tx = database.transaction(store,"readwrite");

    tx.objectStore(store).put(data);

    tx.oncomplete = ()=>resolve(true);

    tx.onerror = ()=>reject(false);

  });

}

/* ==========================
   GET ALL
   ========================== */

async function getAll(store){

  const database = await open();

  return new Promise(resolve=>{

    const tx = database.transaction(store,"readonly");

    const req = tx.objectStore(store).getAll();

    req.onsuccess = ()=>resolve(req.result);

  });

}

/* ==========================
   REMOVE
   ========================== */

async function remove(store,id){

  const database = await open();

  return new Promise(resolve=>{

    const tx = database.transaction(store,"readwrite");

    tx.objectStore(store).delete(id);

    tx.oncomplete = ()=>resolve(true);

  });

}

window.CGGDB = {

  open,
  save,
  getAll,
  remove

};

})();
