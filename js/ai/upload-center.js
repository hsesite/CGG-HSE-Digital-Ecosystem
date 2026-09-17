/* ==========================================
   CGG HDOS Upload Center
   Build 26.2 Stable
   Enterprise Inbox
   ========================================== */

(() => {

"use strict";

const UploadCenter={

jobs:[],

mount(){

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

bind(){

const zone=document.getElementById("hdos-dropzone");
if(!zone) return;

const input=document.createElement("input");

input.type="file";
input.multiple=true;
input.accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
input.hidden=true;

document.body.appendChild(input);

zone.onclick=()=>input.click();

zone.ondragover=e=>{

e.preventDefault();
zone.classList.add("drag");

};

zone.ondragleave=()=>zone.classList.remove("drag");

zone.ondrop=e=>{

e.preventDefault();
zone.classList.remove("drag");

this.handleFiles(e.dataTransfer.files);

};

input.onchange=()=>this.handleFiles(input.files);

},

async handleFiles(files){

for(const file of files){

const job=await HDOSEngine.process(file);

this.jobs.unshift(job);

}

this.render();

},

render(){

const list=document.getElementById("hdos-upload-list");

if(!list) return;

list.innerHTML=this.jobs.map(job=>`

<div class="hdos-job">

<div>

<strong>${job.file}</strong>

<div>${job.result.meta.type.toUpperCase()}</div>

</div>

<div class="badge">${job.status}</div>

</div>

`).join("");

}

};

window.HDOSUploadCenter=UploadCenter;

document.addEventListener("DOMContentLoaded",()=>{

    requestAnimationFrame(()=>{

        HDOSUploadCenter.mount();

    });

});

})();
