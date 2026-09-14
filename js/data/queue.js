
/* ==========================================
   CGG HDOS Universal Queue Engine
   Build 15.5
   ========================================== */

(() => {
"use strict";

const PRIORITY={
  incident:1,
  hazard:2,
  ptw:3,
  inspection:4,
  audit:5,
  default:9
};

/* ==========================
   Generate Queue ID
   ========================== */

function id(){

  return "Q-"+Date.now()+"-"+Math.random().toString(36).slice(2,6);

}

/* ==========================
   Add Queue
   ========================== */

async function add({

  module,
  tenant="CGG",
  company="CGG",
  createdBy="anonymous",
  payload={}

}){

  const db=await CGGCache.openDB();

  const item={

    id:id(),

    module,

    tenant,

    company,

    createdBy,

    createdAt:new Date().toISOString(),

    status:"pending",

    retry:0,

    priority:PRIORITY[module]||PRIORITY.default,

    payload

  };

  return new Promise((resolve,reject)=>{

    const tx=db.transaction("queue","readwrite");

    tx.objectStore("queue").add(item);

    tx.oncomplete=()=>resolve(item);

    tx.onerror=()=>reject(tx.error);

  });

}

/* ==========================
   Get Pending
   ========================== */

async function pending(){

  const db=await CGGCache.openDB();

  return new Promise((resolve,reject)=>{

    const req=db
      .transaction("queue")
      .objectStore("queue")
      .index("status")
      .getAll("pending");

    req.onsuccess=()=>{

      const data=req.result.sort((a,b)=>{

        if(a.priority!==b.priority)
          return a.priority-b.priority;

        return new Date(a.createdAt)-new Date(b.createdAt);

      });

      resolve(data);

    };

    req.onerror=()=>reject(req.error);

  });

}

/* ==========================
   Update Status
   ========================== */

async function update(item){

  const db=await CGGCache.openDB();

  return new Promise((resolve,reject)=>{

    const tx=db.transaction("queue","readwrite");

    tx.objectStore("queue").put(item);

    tx.oncomplete=()=>resolve(true);

    tx.onerror=()=>reject(tx.error);

  });

}

/* ==========================
   Count
   ========================== */

async function count(){

  const list=await pending();

  return list.length;

}

/* ==========================
   Public API
   ========================== */

window.CGGQueue={

  add,
  pending,
  update,
  count

};

})();
