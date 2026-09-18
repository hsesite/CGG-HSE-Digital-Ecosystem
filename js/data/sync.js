
/* ==========================================
   CGG HDOS Sync Engine
   Build 15.6 Production
   Offline First • Transactional Sync
   ========================================== */

(() => {
"use strict";

/* ==========================================
   Sync Configuration
   ========================================== */

const MAX_RETRY = 5;
const RETRY_DELAY = 3000;

/* ==========================================
   Send One Queue Item
   ========================================== */

async function send(item){

  const endpoint = window.CGGConfig?.endpoint;

  if(!endpoint){

    throw new Error("Endpoint HDOS belum dikonfigurasi.");

  }

  const payload = {

    action:item.module,
    module:item.module,
    queue_id:item.id,
    tenant:item.tenant,
    company:item.company,
    createdBy:item.createdBy,
    createdAt:item.createdAt,
    payload:item.payload

  };

  const res = await fetch(endpoint,{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify(payload)

  });

  if(!res.ok){

    throw new Error("HTTP "+res.status);

  }

  const json = await res.json();

  if(!json.success){

    throw new Error(json.message||"Sync gagal");

  }

  return json;

}

/* ==========================================
   Process Queue
   ========================================== */

async function processQueue(){

  if(!navigator.onLine){

    return {
      online:false,
      processed:0
    };

  }

  const list = await CGGQueue.pending();

  let processed = 0;

  for(const item of list){

    try{

      item.status="processing";

      await CGGQueue.update(item);

      const result = await send(item);

      item.status="sent";

      item.serverId=result.id||null;

      item.syncedAt=new Date().toISOString();

      await CGGQueue.update(item);

      processed++;

      console.log("✓ Synced:",item.module,item.id);

    }

    catch(err){

      item.retry++;

      item.status = item.retry>=MAX_RETRY
        ? "failed"
        : "pending";

      item.lastError=err.message;

      await CGGQueue.update(item);

      console.warn("Retry:",item.id,item.retry,err.message);

    }

  }

  return{

    online:true,
    processed

  };

}

/* ==========================================
   Auto Sync
   ========================================== */

function start(){

  window.addEventListener("online",()=>{

    processQueue();

  });

  setInterval(()=>{

    processQueue();

  },RETRY_DELAY);

}

/* ==========================================
   Public API
   ========================================== */

window.CGGSync={

  send,
  processQueue,
  start

};

})();
