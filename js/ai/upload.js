/* ==========================================
   CGG HDOS AI Upload Center
   Build 26.1.3 Stable
   Permanent Upload Launcher
   ========================================== */

(() => {

"use strict";

const Upload={

input:null,
jobs:[],
   
/* ==========================================
   Upload Center Page
   ========================================== */

render(){

  const view=document.getElementById("router-view");
  if(!view) return;

  /* pastikan hidden input sudah ada */
  if(!this.input){
    this.init();
  }

 view.innerHTML=`
<div class="glass-card section-card fade-in">

    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">

        <div>
            <h1>Upload Center</h1>
            <p>Drag & Drop PDF, Word, Excel, atau gambar.</p>
        </div>

        <button id="hdos-upload-launch"
        class="btn-primary"
        style="padding:12px 22px;border-radius:12px;">
            📄 Upload File
        </button>

    </div>

    <div id="hdos-dropzone" class="hdos-dropzone">
        📄 Klik atau Drop File di sini
    </div>

    <div id="hdos-upload-list" class="hdos-upload-list"></div>

</div>
`;
  const drop=view.querySelector("#hdos-dropzone");
  launch.onclick=()=>this.input.click();

  drop.onclick=()=>this.input.click();

  drop.ondragover=e=>{
    e.preventDefault();
    drop.classList.add("drag");
  };

  drop.ondragleave=()=>{
    drop.classList.remove("drag");
  };

  drop.ondrop=e=>{
    e.preventDefault();
    drop.classList.remove("drag");

    if(e.dataTransfer.files.length){
      this.process(e.dataTransfer.files[0]);
    }
  };

},

/* ==========================================
   Initialize Upload Engine
   ========================================== */

init(){

if(this.input) return;

/* Hidden Input */

this.input=document.createElement("input");

this.input.type="file";
this.input.accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
this.input.style.display="none";

this.input.addEventListener("change",async()=>{

const file=this.input.files[0];
if(!file) return;

await this.process(file);

/* reset agar file sama bisa dipilih lagi */

this.input.value="";

});

document.body.appendChild(this.input);

/* Floating Upload Button */

if(!document.getElementById("hdos-upload-btn")){

const btn=document.createElement("button");

btn.id="hdos-upload-btn";
btn.innerHTML="📄 Upload";

btn.style.cssText=`
position:fixed;
right:24px;
bottom:24px;
width:140px;
height:50px;
border:none;
border-radius:14px;
background:#00E676;
color:#00130A;
font-weight:700;
font-size:15px;
cursor:pointer;
z-index:99998;
box-shadow:0 10px 25px rgba(0,230,118,.35);
`;

btn.onclick=()=>Router.navigate("upload");

document.body.appendChild(btn);

}

},

/* ==========================================
   Unified Upload Process
   ========================================== */

async process(file){

const detect=HDOSDetector.detect(file);

const result=await HDOSEngine.process(file);

this.showResult(file,detect,result);

},

/* ==========================================
   Preview Result
   ========================================== */

showResult(file,detect,result){

const job={

id:Date.now(),

name:file.name,

size:(file.size/1024).toFixed(1),

type:detect.type.toUpperCase(),

confidence:Math.round(detect.confidence*100),

module:detect.module||"manual",

status:"Siap Disimpan"

};

this.jobs.unshift(job);

this.renderQueue();

},

renderQueue(){

const list=document.getElementById("hdos-upload-list");

if(!list) return;

list.innerHTML=this.jobs.map(job=>`

<div class="glass-card" style="margin-top:18px;padding:18px;">

<div style="display:flex;justify-content:space-between;align-items:center;">

<div>

<div style="font-weight:700;font-size:18px;">${job.name}</div>

<div style="color:#9fb3c8;font-size:13px;">
${job.type} • ${job.size} KB
</div>

</div>

<div style="background:#00E67622;color:#00E676;padding:6px 12px;border-radius:999px;font-size:12px;">
${job.status}
</div>

</div>

<div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">

<div>
<div style="font-size:12px;color:#9fb3c8;">AI Confidence</div>
<div style="font-weight:700;">${job.confidence}%</div>
</div>

<div>

<div style="font-size:12px;color:#9fb3c8;">Simpan ke Modul</div>

<select
class="hdos-module-select"
data-id="${job.id}"
style="
width:100%;
margin-top:6px;
padding:10px;
border:none;
border-radius:10px;
background:#112033;
color:white;">

<option value="inspection" ${job.module==="inspection"?"selected":""}>Inspection</option>

<option value="finding" ${job.module==="finding"?"selected":""}>Finding</option>

<option value="hazard" ${job.module==="hazard"?"selected":""}>Hazard Report</option>

<option value="incident" ${job.module==="incident"?"selected":""}>Incident</option>

<option value="waste" ${job.module==="waste"?"selected":""}>Waste B3</option>

<option value="sop" ${job.module==="sop"?"selected":""}>SOP</option>

</select>

</div>

</div>

<div style="margin-top:18px;display:flex;gap:10px;justify-content:flex-end;">

<button class="btn-secondary">Preview</button>

<button class="btn-primary hdos-save-btn" data-id="${job.id}"> Konfirmasi Simpan</button>

</div>

</div>

`).join("");

}

};

    list.innerHTML=this.jobs.map(job=>`

<div class="glass-card" style="margin-top:18px;padding:18px;">

<div style="display:flex;justify-content:space-between;align-items:center;">

<div>

<div style="font-weight:700;font-size:18px;">${job.name}</div>

<div style="color:#9fb3c8;font-size:13px;">
${job.type} • ${job.size} KB
</div>

</div>

<div style="background:#00E67622;color:#00E676;padding:6px 12px;border-radius:999px;font-size:12px;">
${job.status}
</div>

</div>

<div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">

<div>
<div style="font-size:12px;color:#9fb3c8;">AI Confidence</div>
<div style="font-weight:700;">${job.confidence}%</div>
</div>

<div>

<div style="font-size:12px;color:#9fb3c8;">Simpan ke Modul</div>

<select
class="hdos-module-select"
data-id="${job.id}"
style="
width:100%;
margin-top:6px;
padding:10px;
border:none;
border-radius:10px;
background:#112033;
color:white;">

<option value="inspection" ${job.module==="inspection"?"selected":""}>Inspection</option>
<option value="finding" ${job.module==="finding"?"selected":""}>Finding</option>
<option value="hazard" ${job.module==="hazard"?"selected":""}>Hazard Report</option>
<option value="incident" ${job.module==="incident"?"selected":""}>Incident</option>
<option value="waste" ${job.module==="waste"?"selected":""}>Waste B3</option>
<option value="sop" ${job.module==="sop"?"selected":""}>SOP</option>

</select>

</div>

</div>

<div style="margin-top:18px;display:flex;gap:10px;justify-content:flex-end;">

<button class="btn-secondary">Preview</button>

<button class="btn-primary hdos-save-btn" data-id="${job.id}">
Konfirmasi Simpan
</button>

</div>

</div>

`).join("");

    /* Event Simpan */
    list.querySelectorAll(".hdos-save-btn").forEach(btn=>{

      btn.onclick=async()=>{

        const job=this.jobs.find(j=>j.id==btn.dataset.id);

        if(!job) return;

        job.status="Menyimpan...";
        this.renderQueue();

        await new Promise(r=>setTimeout(r,500));

        job.status="Tersimpan";
        this.renderQueue();

      };

    });

window.HDOSUpload=Upload;

/* Event pilih modul */

list.querySelectorAll(".hdos-module-select").forEach(select=>{

select.onchange=()=>{

const job=this.jobs.find(j=>j.id==select.dataset.id);

if(job){

job.module=select.value;

}

};

/* ==========================================
   Auto Start
   ========================================== */

window.addEventListener("load",()=>Upload.init());

})();
