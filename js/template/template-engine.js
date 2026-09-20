/* ==========================================
   CGG HDOS Template Engine
   Build 27.1 Enterprise Runtime
   Word/Excel → Dynamic Form JSON
   ========================================== */

(() => {

"use strict";

const TemplateEngine={

/* ==========================================
   Build Template dari hasil Parser
   ========================================== */

build(documentData){

const meta=documentData.parsed||documentData.meta||{};
const title=meta.documentName||documentData.name||"Untitled";

const category=
meta.category||
(window.HDOSControlEngine
?HDOSControlEngine.detectCategory(title)
:"Form");

const level=
window.HDOSControlEngine
?HDOSControlEngine.detectLevel(title,category)
:{level:4,name:"Record/Form"};

return{

id:`TPL-${Date.now()}`,

documentId:documentData.id||null,

noForm:
meta.documentNumber||
"-",

title,

category,

level:level.level,

levelName:level.name,

revision:
meta.revision||"0.0",

effectiveDate:
meta.effectiveDate||"-",

module:this.detectModule(category,title),

inspectionType:this.detectInspectionType(title),

schema:this.buildSchema(title),

createdAt:new Date().toISOString()

};

},

/* ==========================================
   Tentukan Modul
   ========================================== */

detectModule(category,title){

const text=`${category} ${title}`.toUpperCase();

if(text.includes("P3K")) return "Inspection";
if(text.includes("APAR")) return "Inspection";
if(text.includes("HOUSEKEEPING")) return "Inspection";
if(text.includes("WORKSHOP")) return "Inspection";
if(text.includes("FUEL")) return "Inspection";
if(text.includes("JETTY")) return "Inspection";
if(text.includes("PTW")) return "Permit To Work";
if(text.includes("COMMISSIONING")) return "Commissioning";
if(text.includes("AUDIT")) return "Audit";
if(text.includes("HAZARD")) return "Hazard";

return "Repository";

},

/* ==========================================
   Jenis Pemeriksaan
   ========================================== */

detectInspectionType(title){

const t=title.toUpperCase();

if(t.includes("P3K")) return "P3K";
if(t.includes("APAR")) return "APAR";
if(t.includes("HOUSEKEEPING")) return "Housekeeping";
if(t.includes("WORKSHOP")) return "Workshop";
if(t.includes("FUEL")) return "Fuel Station";
if(t.includes("JETTY")) return "Jetty";
if(t.includes("SHIPPING")) return "Shipping";

return "General";

},

/* ==========================================
   Schema Generator
   ========================================== */

buildSchema(title){

const t=title.toUpperCase();

/* P3K */

if(t.includes("P3K")){

return{

type:"checklist",

fields:[

"Periksa Kasa Steril",
"Periksa Perban",
"Periksa Gunting",
"Periksa Pinset",
"Periksa Masker",
"Periksa Lampu Senter"

]

};

}

/* APAR */

if(t.includes("APAR")){

return{

type:"checklist",

fields:[

"Tekanan APAR",
"Segel Utuh",
"Pin Aman",
"Label Terbaca",
"Tabung Tidak Rusak"

]

};

}

/* Default */

return{

type:"checklist",

fields:["Checklist Item"]

};

}

};

window.HDOSTemplateEngine=TemplateEngine;

})();
