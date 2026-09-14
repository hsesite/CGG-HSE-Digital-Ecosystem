
/* ==========================================
   CGG HDOS Schema Evolution Engine
   Build 15.4
   ========================================== */

(() => {
"use strict";

/* ==========================
   Save Evolution Log
   ========================== */

async function saveLog(sheet,oldSig,newSig,schema){

  const db=await CGGCache.openDB();

  return new Promise((resolve,reject)=>{

    const tx=db.transaction("systemlog","readwrite");

    tx.objectStore("systemlog").add({

      type:"schema",

      sheet,

      oldSignature:oldSig,

      newSignature:newSig,

      schema,

      time:new Date().toISOString()

    });

    tx.oncomplete=()=>resolve(true);

    tx.onerror=()=>reject(tx.error);

  });

}

/* ==========================
   Check Evolution
   ========================== */

async function check(sheet,headers){

  const newSchema=CGGSchema.build(headers);

  const newSig=CGGSignature.hash(headers);

  const cached=await CGGCache.load(`schema:${sheet}`);

  if(!cached){

    await CGGCache.save(`schema:${sheet}`,newSchema);

    await saveLog(sheet,null,newSig,newSchema);

    return{

      changed:true,

      signature:newSig,

      schema:newSchema,

      reason:"first_install"

    };

  }

  const oldSig=CGGSignature.hash(
    cached.data.map(x=>x.label)
  );

  if(!CGGSignature.changed(oldSig,newSig)){

    return{

      changed:false,

      signature:newSig,

      schema:cached.data,

      reason:"no_change"

    };

  }

  await CGGCache.save(`schema:${sheet}`,newSchema);

  await saveLog(sheet,oldSig,newSig,newSchema);

  return{

    changed:true,

    signature:newSig,

    schema:newSchema,

    reason:"updated"

  };

}

/* ==========================
   Read Logs
   ========================== */

async function history(){

  const db=await CGGCache.openDB();

  return new Promise((resolve,reject)=>{

    const req=db
      .transaction("systemlog")
      .objectStore("systemlog")
      .getAll();

    req.onsuccess=()=>resolve(req.result);

    req.onerror=()=>reject(req.error);

  });

}

/* ==========================
   Public API
   ========================== */

window.CGGEvolution={

  check,
  history

};

})();
