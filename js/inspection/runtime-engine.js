/* ==========================================
   CGG HDOS Inspection Runtime
   Build 27.4 Enterprise
   Dynamic Inspection Engine
   ========================================== */

(() => {

"use strict";

const Runtime={

templates:[],
active:null,

/* ==========================================
   Load Template
   ========================================== */

async load(){

this.templates=
await HDOSRepository.listTemplates("Inspection");

return this.templates;

},

/* ==========================================
   Render Dropdown
   ========================================== */

async renderSelector(container){

await this.load();

container.innerHTML=`

<label>Jenis Pemeriksaan</label>

<select id="hdos-inspection-type">

<option value="">Pilih Pemeriksaan</option>

${this.templates.map(t=>`

<option value="${t.id}">
${t.inspectionType} - ${t.title}
</option>

`).join("")}

</select>

<div id="hdos-template-area"></div>

`;

const select=
container.querySelector("#hdos-inspection-type");

select.onchange=()=>{

const tpl=this.templates.find(x=>x.id===select.value);

if(tpl){

this.active=tpl;

this.renderTemplate(
container.querySelector("#hdos-template-area"),
tpl
);

}

};

},

/* ==========================================
   Render Checklist
   ========================================== */

renderTemplate(area,tpl){

const schema=tpl.template.schema;

area.innerHTML=`

<div class="glass-card" style="margin-top:24px;padding:20px;">

<h3>${tpl.title}</h3>

<div style="color:#8aa2bf;margin-bottom:18px;">
No Form: ${tpl.noForm}
</div>

<div id="hdos-items"></div>

<button id="hdos-save-inspection"
class="btn-primary"
style="margin-top:22px;width:100%;">
Simpan Hasil Pemeriksaan
</button>

</div>

`;

const items=area.querySelector("#hdos-items");

items.innerHTML=schema.fields.map((f,i)=>`

<div style="
margin-bottom:18px;
padding:16px;
background:#0b1627;
border-radius:12px;">

<div style="font-weight:600;">
${i+1}. ${f}
</div>

<div style="display:flex;gap:14px;margin-top:12px;">

<label>
<input type="radio"
name="item${i}"
value="Ya">
Ya
</label>

<label>
<input type="radio"
name="item${i}"
value="Tidak">
Tidak
</label>

</div>

<textarea
placeholder="Catatan..."
style="
width:100%;
margin-top:12px;
height:70px;"></textarea>

<input
type="file"
accept="image/*"
capture="environment"
style="margin-top:10px;">

</div>

`).join("");

area.querySelector("#hdos-save-inspection").onclick=
()=>this.save(area,tpl);

},

/* ==========================================
   Save Inspection
   ========================================== */

async save(area,tpl){

const result={

id:`INS-${Date.now()}`,

template:tpl.id,

title:tpl.title,

time:new Date().toISOString(),

items:[]

};

const cards=
area.querySelectorAll("#hdos-items>div");

cards.forEach((card,i)=>{

const status=
card.querySelector(`input[name="item${i}"]:checked`)?.value||"Belum";

const note=
card.querySelector("textarea").value;

const photo=
card.querySelector('input[type="file"]').files[0];

result.items.push({

item:tpl.template.schema.fields[i],

status,

note,

photoName:photo?.name||null

});

});

localStorage.setItem(

result.id,

JSON.stringify(result)

);

alert("Hasil inspeksi berhasil disimpan.");

}

};

window.HDOSInspectionRuntime=Runtime;

})();
