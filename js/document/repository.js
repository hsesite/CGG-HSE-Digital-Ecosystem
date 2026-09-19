/* ==========================================
   CGG HDOS Repository Engine
   Build 27.0
   ========================================== */

(() => {

"use strict";

const Repository = {

async save(document){

if(!window.DocumentStore){

throw new Error("DocumentStore belum tersedia.");

}

const id=document.id || `DOC-${Date.now()}`;

const payload={

...document,

id,

createdAt:new Date().toISOString(),

updatedAt:new Date().toISOString(),

status:document.status || "Approved"

};

await DocumentStore.save(payload);

return payload;

},

async list(){

return await DocumentStore.list("documents");

},

async get(id){

return await DocumentStore.get(id);

},

async remove(id){

return await DocumentStore.remove(id);

}

};

window.HDOSRepository=Repository;

})();
