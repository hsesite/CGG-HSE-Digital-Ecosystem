/* ==========================================
   CGG HDOS Document Control Engine
   Build 27.0 Enterprise
   Master Blueprint Locked
   ========================================== */

(() => {

"use strict";

/* ==========================================
   Level Mapping
   ========================================== */

const LEVEL_RULES=[

{ level:1, name:"Manual Mutu", keywords:["MANUAL MUTU","MANUAL SMKP","QUALITY MANUAL"] },

{ level:1, name:"Kebijakan", keywords:["KEBIJAKAN","POLICY"] },

{ level:2, name:"Prosedur", keywords:["SOP","STANDARD OPERATING PROCEDURE","PROSEDUR","PERMIT TO WORK","PTW"] },

{ level:3, name:"Instruksi Kerja", keywords:["INSTRUKSI KERJA","IK","WORK INSTRUCTION","JSA","IBPR","JOB DESCRIPTION"] },

{ level:4, name:"Record/Form", keywords:["FORM","FORMULIR","CHECKLIST","RECORD","MOM","LOGBOOK"] }

];

/* ==========================================
   Category Mapping
   ========================================== */

const CATEGORY_RULES=[

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
["Form",["FORM","FORMULIR","CHECKLIST"]]

];

/* ==========================================
   Helper
   ========================================== */

function upper(text=""){

return String(text).toUpperCase();

}

function generateDocumentID(){

const now=new Date();

const y=now.getFullYear();

const m=String(now.getMonth()+1).padStart(2,"0");

const d=String(now.getDate()).padStart(2,"0");

const t=String(now.getTime()).slice(-5);

return `DOC-${y}${m}${d}-${t}`;

}

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

function detectCategory(title=""){

const text=upper(title);

for(const [cat,keys] of CATEGORY_RULES){

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
   Main Engine
   ========================================== */

const ControlEngine={

build(job={}){

const meta=job.meta||job.parsed||{};

const title=

meta.documentName||
job.name||
"Untitled Document";

const category=

meta.category&&meta.category!=="Perlu Verifikasi"

?meta.category
:detectCategory(title);

const levelInfo=detectLevel(title,category);

const document={

id:generateDocumentID(),

noForm:

meta.documentNumber||
job.noForm||
"-",

title,

level:levelInfo.level,

levelName:levelInfo.name,

category,

type:detectType(levelInfo.level),

revision:

meta.revision||
"0.0",

effectiveDate:

meta.effectiveDate||
"-",

department:

job.department||
"HSE",

area:

job.area||
"-",

owner:

job.owner||
"-",

status:"Draft",

softcopy:"Ya",

hardcopy:"Belum Ditentukan",

distribution:"-",

confidence:

meta.confidence||
job.confidence||
100,

uploadDate:new Date().toISOString(),

uploadedBy:

job.uploadedBy||
"HDOS User",

storage:"IndexedDB",

sync:"Queued"

};

return document;

},

detectLevel,

detectCategory,

generateDocumentID

};

window.HDOSControlEngine=ControlEngine;

})();
