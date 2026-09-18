/* ==========================================
   HDOS Document Store
   Build 26.2 Foundation
   Offline First
========================================== */

(() => {

"use strict";

const DB_NAME="HDOS_DOCUMENTS";
const STORE="documents";
const VERSION=1;

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

const tx=db.transaction(STORE,"readwrite");

const store=tx.objectStore(STORE);

const doc={

id:this.id(),

name:file.name,

size:file.size,

type:file.name.split(".").pop().toLowerCase(),

blob:file,

uploadedAt:new Date().toISOString(),

status:"pending-sync",

version:"1.0",

...meta

};

store.put(doc);

return new Promise(resolve=>{

tx.oncomplete=()=>resolve(doc);

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

window.DocumentStore=Store;

})();
