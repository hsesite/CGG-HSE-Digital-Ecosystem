/* ==========================================
   HDOS Document Store
   Build 27.1 Enterprise Stable
   Offline First + Repository Compatible
   ========================================== */

(() => {

"use strict";

const DB_NAME = "HDOS_DOCUMENTS";
const STORE = "documents";
const VERSION = 3;

const Store = {

db:null,

/* ==========================
   Open Database
========================== */

async open(){

if(this.db) return this.db;

return new Promise((resolve,reject)=>{

const req=indexedDB.open(DB_NAME,VERSION);

req.onupgradeneeded=e=>{

const db=e.target.result;

if(!db.objectStoreNames.contains(STORE)){

const s=db.createObjectStore(STORE,{ keyPath:"id" });

s.createIndex("module","module");
s.createIndex("category","category");
s.createIndex("department","department");
s.createIndex("status","status");

}

if(!db.objectStoreNames.contains("audit")){

const audit=db.createObjectStore("audit",{ keyPath:"id" });

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

/* ==========================
   Generate ID
========================== */

id(){

return "DOC-"+Date.now();

},

/* ==========================
   Save (Support File & Metadata)
========================== */

async save(fileOrMeta,meta={}){

const db=await this.open();

const now=new Date().toISOString();

const isFile=fileOrMeta instanceof File;

const doc=isFile
?{

id:meta.id||this.id(),

name:fileOrMeta.name,

size:fileOrMeta.size,

type:(fileOrMeta.name.split(".").pop()||"").toLowerCase(),

blob:fileOrMeta,

uploadedAt:now,
updatedAt:now,

status:meta.status||"pending-sync",

version:meta.revision||"1.0",

originalFile:{
name:fileOrMeta.name,
size:fileOrMeta.size,
type:fileOrMeta.type||"application/octet-stream",
lastModified:fileOrMeta.lastModified||null
},

digitalVersion:{
status:"pending-sync",
generatedAt:now,
source:"HDOS AI Hybrid"
},

...meta

}
:{

id:fileOrMeta.id||this.id(),

uploadedAt:now,
updatedAt:now,

status:fileOrMeta.status||"pending-sync",

...fileOrMeta

};

const tx=db.transaction(STORE,"readwrite");

tx.objectStore(STORE).put(doc);

return new Promise((resolve,reject)=>{

tx.oncomplete=()=>resolve(doc);

tx.onerror=()=>reject(tx.error);

});

},

/* ==========================
   Update
========================== */

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

/* ==========================
   Get One
========================== */

async get(id){

const db=await this.open();

const tx=db.transaction(STORE,"readonly");

return new Promise((resolve,reject)=>{

const req=tx.objectStore(STORE).get(id);

req.onsuccess=()=>resolve(req.result||null);

req.onerror=()=>reject(req.error);

});

},

/* ==========================
   List (All / By Module)
========================== */

async list(module){

const db=await this.open();

const tx=db.transaction(STORE,"readonly");

const store=tx.objectStore(STORE);

return new Promise((resolve,reject)=>{

const req=module
?store.index("module").getAll(module)
:store.getAll();

req.onsuccess=()=>resolve(req.result||[]);

req.onerror=()=>reject(req.error);

});

},

/* ==========================
   Delete
========================== */

async remove(id){

const db=await this.open();

const tx=db.transaction(STORE,"readwrite");

tx.objectStore(STORE).delete(id);

return new Promise((resolve,reject)=>{

tx.oncomplete=()=>resolve(true);

tx.onerror=()=>reject(tx.error);

});

},

/* ==========================
   Audit Trail
========================== */

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

const tx=db.transaction("audit","readonly");

const index=tx.objectStore("audit").index("entityId");

return new Promise((resolve,reject)=>{

const req=index.getAll(entityId);

req.onsuccess=()=>resolve(req.result||[]);

req.onerror=()=>reject(req.error);

});

}

};

/* Export Global */

window.DocumentStore=Store;

})();
