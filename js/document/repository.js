/* ==========================================
   CGG HDOS Repository
   Build 27.2 Enterprise
   Repository Gateway
   ========================================== */

(() => {

"use strict";

const Repository={

/* ==========================
   Save Document
========================== */

async save(job){

if(!window.DocumentStore){

throw new Error("DocumentStore belum dimuat.");

}

const document=HDOSControlEngine.build(job);

/* Simpan ke IndexedDB */

await DocumentStore.save(document);

/* Audit Trail */

await DocumentStore.audit(
"document.saved",
document.id,
{
title:document.title,
noForm:document.noForm,
category:document.category

const template=HDOSTemplateEngine.build({
 name:job.name,
 parsed:job.parsed,
 id:document.id
});

document.template=template;
document.module=template.module;
document.inspectionType=template.inspectionType;
}
);

/* Refresh Dashboard bila ada */

window.dispatchEvent(new CustomEvent("hdos:repository-updated",{
detail:document
}));

return document;

},

/* ==========================
   List Documents
========================== */

async list(category=null){

const docs=await DocumentStore.list();

if(!category) return docs;

return docs.filter(d=>d.category===category);

},

/* ==========================
   Get One
========================== */

async get(id){

return DocumentStore.get(id);

},

/* ==========================
   Update
========================== */

async update(id,patch){

const doc=await DocumentStore.update(id,patch);

await DocumentStore.audit(
"document.updated",
id,
patch
);

window.dispatchEvent(new CustomEvent("hdos:repository-updated",{
detail:doc
}));

return doc;

},

/* ==========================
   Delete
========================== */

async remove(id){

await DocumentStore.remove(id);

await DocumentStore.audit(
"document.deleted",
id
);

window.dispatchEvent(new Event("hdos:repository-updated"));

}

};

window.HDOSRepository=Repository;
async listTemplates(module){

const docs=await this.list();

return docs.filter(doc=>
doc.template &&
doc.template.module===module
);

})();
