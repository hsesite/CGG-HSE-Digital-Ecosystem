/* ==========================================
   HDOS Document Store
   Build 26.2 Foundation
   Offline First
========================================== */

(() => {

"use strict";

const DB_NAME="HDOS_DOCUMENTS";
const STORE="documents";
const VERSION=2;

const Store={

db:null,

async open(){

if(this.db) return this.db;

return new Promise((resolve,reject)=>{

const req=indexedDB.open(DB_NAME,VERSION);

req.onupgradeneeded=e=>{

const db=e.target.result;

if(!db.objectStoreNames.contains(STORE)){

const s=db.createObjectStore(STORE,{
keyPath:"id"
});

s.createIndex("module","module");
s.createIndex("company","company");
s.createIndex("status","status");

}

if(!db.objectStoreNames.contains("audit")){

const audit=db.createObjectStore("audit",{
keyPath:"id"
});

audit.createIndex("entityId","entityId");
audit.createIndex("time","time");

}

};

req.onsuccess=e=>{
this.db=e.target.result;
resolve(this.db);
};

req.onerror=()=>reject(req.error);

});

},

id(){

return "DOC-"+Date.now();

},

async save(file,meta){

const db=await this.open();
const id=this.id();
const now=new Date().toISOString();

const tx=db.transaction(STORE,"readwrite");

const store=tx.objectStore(STORE);

const doc={

id,

name:file.name,

size:file.size,

type:file.name.split(".").pop().toLowerCase(),

blob:file,

uploadedAt:now,
updatedAt:now,

status:"pending-sync",

version:meta.revision||"1.0",
originalFile:{
  name:file.name,
  size:file.size,
  type:file.type||"application/octet-stream",
  lastModified:file.lastModified||null
},
digitalVersion:{
  status:"pending-sync",
  generatedAt:now,
  source:"HDOS AI Hybrid"
},

...meta

};

store.put(doc);

return new Promise((resolve,reject)=>{

tx.oncomplete=()=>resolve(doc);
tx.onerror=()=>reject(tx.error);

});

},

async update(id,patch={}){

const current=await this.get(id);
if(!current) throw new Error("Dokumen tidak ditemukan.");

const db=await this.open();
const updated={
 ...current,
 ...patch,
 updatedAt:new Date().toISOString()
};

const tx=db.transaction(STORE,"readwrite");
tx.objectStore(STORE).put(updated);

return new Promise((resolve,reject)=>{
tx.oncomplete=()=>resolve(updated);
tx.onerror=()=>reject(tx.error);
});

},

async audit(event,entityId,details={}){

const db=await this.open();
const entry={
 id:`AUDIT-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
 event,
 entityId,
 time:new Date().toISOString(),
 details
};

const tx=db.transaction("audit","readwrite");
tx.objectStore("audit").put(entry);

return new Promise((resolve,reject)=>{
tx.oncomplete=()=>resolve(entry);
tx.onerror=()=>reject(tx.error);
});

},

async listAudit(entityId){

const db=await this.open();
const index=db.transaction("audit","readonly")
 .objectStore("audit").index("entityId");

return new Promise((resolve,reject)=>{
const req=index.getAll(entityId);
req.onsuccess=()=>resolve(req.result||[]);
req.onerror=()=>reject(req.error);
});

},

async list(module){

const db=await this.open();

const tx=db.transaction(STORE,"readonly");

const index=tx.objectStore(STORE).index("module");

return new Promise(resolve=>{

const req=index.getAll(module);

req.onsuccess=()=>resolve(req.result||[]);

});

},

async get(id){

const db=await this.open();

const tx=db.transaction(STORE,"readonly");

const store=tx.objectStore(STORE);

return new Promise(resolve=>{

const req=store.get(id);

req.onsuccess=()=>resolve(req.result);

});

},

async remove(id){

const db=await this.open();

const tx=db.transaction(STORE,"readwrite");

tx.objectStore(STORE).delete(id);

return new Promise(resolve=>{

tx.oncomplete=resolve;

});

}

};
window.DocumentStore = DocumentStore;

})();
