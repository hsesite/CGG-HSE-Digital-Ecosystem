/* ==========================================
   CGG HDOS Upload Center
   Build 26.4 LTS
   Enterprise Inbox
   ========================================== */

(() => {

"use strict";

const UploadCenter={

jobs:[],
input:null,

/* ==========================================
   Mount Upload Center
   ========================================== */

mount(){

    this.ensureLauncher();

    const view=document.getElementById("router-view");
    if(!view) return;

    const old=document.getElementById("hdos-upload-center");
    if(old) old.remove();

    const card=document.createElement("div");

    card.id="hdos-upload-center";

    card.className="glass-card section-card fade-in";

    card.innerHTML=`

        <h2>Upload Center</h2>

        <p>Drag & Drop PDF, Word, Excel, atau gambar.</p>

        <div id="hdos-dropzone" class="hdos-dropzone">

            📄 Klik atau Drop File di sini

        </div>

        <div id="hdos-upload-list"></div>

    `;

    view.prepend(card);

    this.bind();

},

/* ==========================================
   Floating Upload Launcher
   ========================================== */

ensureLauncher(){

    let btn=document.getElementById("hdos-upload-btn");

    if(btn) return;

    btn=document.createElement("button");

    btn.id="hdos-upload-btn";

    btn.innerHTML="📄 Upload";

    btn.style.cssText=`
position:fixed;
right:24px;
bottom:24px;
width:150px;
height:54px;
border:none;
border-radius:16px;
background:#00E676;
color:#00130A;
font-weight:700;
font-size:15px;
cursor:pointer;
z-index:99999;
box-shadow:0 10px 25px rgba(0,230,118,.35);
`;

    btn.onclick=()=>{

        if(window.Router){
            Router.navigate("upload");
        }

    };

    document.body.appendChild(btn);

},

/* ==========================================
   Bind Upload Events
   ========================================== */

bind(){

    const zone=document.getElementById("hdos-dropzone");
    if(!zone) return;

    /* Hidden Input dibuat sekali */

    if(!this.input){

        this.input=document.createElement("input");

        this.input.type="file";
        this.input.multiple=true;
        this.input.accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
        this.input.hidden=true;

        document.body.appendChild(this.input);

        this.input.onchange=()=>{

            this.handleFiles(this.input.files);

            this.input.value="";

        };

    }

    zone.onclick=()=>this.input.click();

    zone.ondragover=e=>{

        e.preventDefault();

        zone.classList.add("drag");

    };

    zone.ondragleave=()=>{

        zone.classList.remove("drag");

    };

    zone.ondrop=e=>{

        e.preventDefault();

        zone.classList.remove("drag");

        this.handleFiles(e.dataTransfer.files);

    };

},

/* ==========================================
   Process Files
   ========================================== */

async handleFiles(files){

    for(const file of files){

        const result=await HDOSEngine.process(file);

        this.jobs.unshift({

            id:Date.now()+Math.random(),

            file:file.name,

            size:(file.size/1024).toFixed(1),

            module:result.result?.meta?.module||"inspection",

            result,

            status:"Siap Disimpan"

        });

    }

    this.render();

},

/* ==========================================
   Render Queue
   ========================================== */

render(){

    const list=document.getElementById("hdos-upload-list");

    if(!list) return;

    list.innerHTML=this.jobs.map(job=>`

<div class="glass-card" style="margin-top:18px;padding:18px;">

<div style="display:flex;justify-content:space-between;align-items:center;">

<div>

<div style="font-weight:700;font-size:18px;">
${job.file}
</div>

<div style="color:#9fb3c8;font-size:13px;">
${job.result.result.meta.type.toUpperCase()} • ${job.size} KB
</div>

</div>

<div style="
background:#00E67622;
color:#00E676;
padding:6px 12px;
border-radius:999px;
font-size:12px;">
${job.status}
</div>

</div>

<div style="
margin-top:16px;
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;">

<div>

<div style="font-size:12px;color:#9fb3c8;">
AI Confidence
</div>

<div style="font-weight:700;">
100%
</div>

</div>

<div>

<div style="font-size:12px;color:#9fb3c8;">
Simpan ke Modul
</div>

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

<option value="inspection">Inspection</option>
<option value="finding">Finding</option>
<option value="hazard">Hazard Report</option>
<option value="incident">Incident</option>
<option value="waste">Waste B3</option>
<option value="sop">SOP</option>

</select>

</div>

</div>

<div style="
margin-top:18px;
display:flex;
gap:10px;
justify-content:flex-end;">

<button class="btn-secondary">
Preview
</button>

<button
class="btn-primary hdos-save-btn"
data-id="${job.id}">
Konfirmasi Simpan
</button>

</div>

</div>

`).join("");

    /* Event pilih modul */

    list.querySelectorAll(".hdos-module-select").forEach(select=>{

        select.onchange=()=>{

            const job=this.jobs.find(j=>j.id==select.dataset.id);

            if(job){

                job.module=select.value;

            }

        };

    });

    /* Event Simpan */

    list.querySelectorAll(".hdos-save-btn").forEach(btn=>{

        btn.onclick=async()=>{

            const job=this.jobs.find(j=>j.id==btn.dataset.id);

            if(!job) return;

            job.status="Menyimpan...";

            this.render();

            await new Promise(r=>setTimeout(r,500));

            job.status="Tersimpan";

            this.render();

        };

    });

}

};

window.HDOSUploadCenter=UploadCenter;

/* ==========================================
   Auto Start Launcher
   ========================================== */

window.addEventListener("load",()=>{

    UploadCenter.ensureLauncher();

});

})();
