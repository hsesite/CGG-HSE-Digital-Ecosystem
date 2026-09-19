/* ==========================================
   CGG HDOS AI Engine
   Intelligent Header Parser
   Build 26.3.1 Enterprise
   ========================================== */

(() => {

"use strict";

/* ==========================================
   Header Pattern Engine
   ========================================== */

const HEADER_PATTERNS={

documentNumber:[
/No\.?\s*Formulir\s*[:\-]?\s*(.+)/i,
/No\s*Formulir\s*[:\-]?\s*(.+)/i,
/No\.?\s*Form\s*[:\-]?\s*(.+)/i,
/No\s*Form\s*[:\-]?\s*(.+)/i,
/No\.?\s*Dokumen\s*[:\-]?\s*(.+)/i,
/Nomor\s*Dokumen\s*[:\-]?\s*(.+)/i,
/No\.\s*([A-Z0-9\/.-]+)/i
],

revision:[
/Rev(?:isi)?\s*[:\-]?\s*([0-9.]+)/i
],

effectiveDate:[
/Tanggal\s*Efektif\s*[:\-]?\s*(.+)/i
]

};

/* ==========================================
   AI Category Engine (Locked)
   ========================================== */

const CATEGORY_PATTERNS={

SOP:["SOP","STANDARD OPERATING PROCEDURE"],

JSA:["JOB SAFETY ANALYSIS","JSA"],

IBPR:["IBPR","IDENTIFIKASI BAHAYA PENILAIAN RISIKO"],

IK:["INSTRUKSI KERJA","WORK INSTRUCTION"],

KEBIJAKAN:["KEBIJAKAN","POLICY"],

PTW:["PERMIT TO WORK","PERMIT"],

PICA:["PICA"],

HAZARD:["HAZARD"],

INCIDENT:["INCIDENT"],

MOM:["MINUTE OF MEETING","NOTULEN"],

COMMISSIONING:["COMMISSIONING"]

};

/* ==========================================
   Helper
   ========================================== */

function cleanFilename(filename){

return filename.replace(/\.[^.]+$/,"").trim();

}

function extractFromFilename(filename){

const clean=cleanFilename(filename);

const number=clean.match(/^([A-Za-z0-9./-]+)/);

return{

documentNumber:number?number[1]:"",
title:clean.replace(/^([A-Za-z0-9./-]+)\s*/,"").trim()

};

}

/* ==========================================
   Intelligent Header Extraction
   ========================================== */

function extractHeaderMeta(text,filename=""){

const fallback=extractFromFilename(filename);

const meta={

documentNumber:fallback.documentNumber,

documentName:fallback.title,

revision:"-",

effectiveDate:"-",

category:"Perlu Verifikasi"

};

if(!text||!text.trim()){

const upper=fallback.title.toUpperCase();

for(const [cat,words] of Object.entries(CATEGORY_PATTERNS)){

if(words.some(w=>upper.includes(w))){

meta.category=cat;
break;

}

}

return meta;

}

/* Nomor Dokumen */

for(const pattern of HEADER_PATTERNS.documentNumber){

const match=text.match(pattern);

if(match){

meta.documentNumber=match[1].trim();
break;

}

}

/* Revisi */

for(const pattern of HEADER_PATTERNS.revision){

const match=text.match(pattern);

if(match){

meta.revision=match[1].trim();
break;

}

}

/* Tanggal Efektif */

for(const pattern of HEADER_PATTERNS.effectiveDate){

const match=text.match(pattern);

if(match){

meta.effectiveDate=match[1].trim();
break;

}

}

/* Kategori */

const upper=text.toUpperCase();

for(const [cat,words] of Object.entries(CATEGORY_PATTERNS)){

if(words.some(w=>upper.includes(w))){

meta.category=cat;
break;

}

}

return meta;

}

/* ==========================================
   Parser Engine
   ========================================== */

const Parser={

extractHeaderMeta,

extractFromFilename,

async analyze(file){

const detector=HDOSDetector.detect(file);

/*
   Placeholder OCR.
   Nanti Build 26.3.2 akan diganti OCR
   Word/PDF/Excel.
*/

const text="";

const header=extractHeaderMeta(text,file.name);

return{

success:true,

meta:{

...detector,

documentNumber:header.documentNumber,

documentName:header.documentName,

category:header.category,

revision:header.revision,

effectiveDate:header.effectiveDate

},

structure:[

"header",
"body",
"table",
"signature"

],

confidenceReview:{

overall:detector.confidence,

status:

detector.confidence>=0.9
?"Verified"
:"Needs Review"

}

};

}

};

window.HDOSParser=Parser;

})();
