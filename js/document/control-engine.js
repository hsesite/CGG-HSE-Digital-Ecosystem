/* ==========================================
   CGG HDOS Document Control Engine
   Build 27.1 Enterprise
   Master Blueprint Locked
   ========================================== */

(() => {

"use strict";

/* ==========================================
   LEVEL DOKUMEN (SMKP)
   ========================================== */

const LEVEL_RULES = [

{ level:1,name:"Manual Mutu",keywords:["MANUAL MUTU","MANUAL SMKP","QUALITY MANUAL"] },

{ level:1,name:"Kebijakan",keywords:["KEBIJAKAN","POLICY"] },

{ level:2,name:"Prosedur",keywords:["SOP","STANDARD OPERATING PROCEDURE","PROSEDUR","PERMIT TO WORK","PTW"] },

{ level:3,name:"Instruksi Kerja",keywords:["INSTRUKSI KERJA","WORK INSTRUCTION","JSA","IBPR","JOB DESCRIPTION","IK"] },

{ level:4,name:"Record/Form",keywords:["FORM","FORMULIR","CHECKLIST","RECORD","LOGBOOK","MOM"] }

];

/* ==========================================
   KATEGORI DOKUMEN
   ========================================== */

const CATEGORY_RULES = [

["SOP",["SOP","STANDARD OPERATING PROCEDURE"]],
["JSA",["JSA","JOB SAFETY ANALYSIS"]],
["IBPR",["IBPR","IDENTIFIKASI BAHAYA"]],
["IK",["INSTRUKSI KERJA","WORK INSTRUCTION"]],
["Kebijakan",["KEBIJAKAN","POLICY"]],
["PTW",["PERMIT TO WORK","PTW"]],
["PICA",["PICA"]],
["Hazard",["HAZARD"]],
["Incident",["INCIDENT"]],
["MOM",["MOM","NOTULEN","MINUTE OF MEETING"]],
["Commissioning",["COMMISSIONING"]],
["Audit",["AUDIT"]],
["Form",["FORM","FORMULIR","CHECKLIST","LOGBOOK"]]

];

/* ==========================================
   HELPER
   ========================================== */

function upper(text=""){
return String(text).toUpperCase();
}

function cleanTitle(text=""){
return String(text)
.replace(/\.[^/.]+$/,"")
.replace(/^\d+(\.\d+)?\s*/,"")
.trim();
}

function generateDocumentID(){

const now=new Date();

return`DOC-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}-${String(now.getTime()).slice(-5)}`;

}

/* ==========================================
   EKSTRAK NOMOR DOKUMEN
   ========================================== */

function extractDocumentNumber(job={}){

const meta=job.meta||job.parsed||{};

if(meta.documentNumber)return meta.documentNumber;
if(job.noForm)return job.noForm;

const sources=[
meta.documentName,
job.name,
job.fileName
].filter(Boolean);

const patterns=[

/(?:NO\.?\s*FORMULIR|NO\.?\s*FORM|NOMOR|NO\.?)\s*[:\-]?\s*([A-Z0-9\/\-]+)/i,

/([0-9]{2,3}\/FORM-[A-Z0-9\-]+\/20[0-9]{2})/i,

/([A-Z]{2,}-[A-Z0-9\-]+\/20[0-9]{2})/i

];

for(const text of sources){

for(const regex of patterns){

const match=String(text).match(regex);

if(match)return match[1].trim();

}

}

const filename=String(job.name||job.fileName||"");
const prefix=filename.match(/^(\d+(?:\.\d+)?)/);

return prefix?prefix[1]:"-";

}

/* ==========================================
   DETEKSI LEVEL
   ========================================== */

function detectLevel(title="",category=""){

const text=`${title} ${category}`.toUpperCase();

for(const rule of LEVEL_RULES){

if(rule.keywords.some(k=>text.includes(k))){

return{
level:rule.level,
name:rule.name
};

}

}

return{
level:4,
name:"Record/Form"
};

}

/* ==========================================
   DETEKSI KATEGORI
   ========================================== */

function detectCategory(title=""){

const text=upper(title);

for(const[cat,keys]of CATEGORY_RULES){

if(keys.some(k=>text.includes(k))){

return cat;

}

}

return"Form";

}

function detectType(level){

return level===4?"Form":"Document";

}

/* ==========================================
   MAIN ENGINE
   ========================================== */

const ControlEngine={

build(job={}){

const meta=job.meta||job.parsed||{};

const originalName=
meta.documentName||
job.name||
job.fileName||
"Untitled Document";

const title=cleanTitle(originalName);

const category=
meta.category&&meta.category!=="Perlu Verifikasi"
?meta.category
:detectCategory(title);

const levelInfo=detectLevel(title,category);

const noForm=extractDocumentNumber(job);

return{

id:generateDocumentID(),

assetCode:generateDocumentID(),

noForm,

title,

fileName:job.name||job.fileName||title,

level:levelInfo.level,

levelName:levelInfo.name,

category,

type:detectType(levelInfo.level),

revision:meta.revision||"0.0",

effectiveDate:meta.effectiveDate||"-",

department:job.department||"HSE",

area:job.area||"-",

owner:job.owner||"-",

status:"Draft",

softcopy:"Ya",

hardcopy:"Belum Ditentukan",

distribution:"-",

distributionPlan:"-",

distributionActual:"-",

weight:job.size||0,

confidence:meta.confidence||job.confidence||100,

uploadDate:new Date().toISOString(),

uploadedBy:job.uploadedBy||"HDOS User",

storage:"IndexedDB",

sync:"Queued",

source:"Upload Center"

};

},

detectLevel,
detectCategory,
extractDocumentNumber,
generateDocumentID

};

window.HDOSControlEngine=ControlEngine;

})();
