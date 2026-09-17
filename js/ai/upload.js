/* ==========================================
   CGG HDOS AI Upload Center
   Build 26.1.1
   ========================================== */

(() => {

"use strict";

const Upload={

open(){

const input=document.createElement("input");

input.type="file";
input.accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
input.style.display="none";

input.onchange=async()=>{

const file=input.files[0];
if(!file) return;

const detect=HDOSDetector.detect(file);
const result=await HDOSEngine.process(file);

console.log("HDOS Upload:",detect);
console.log("HDOS Result:",result);

this.preview(file,detect,result);

};

document.body.appendChild(input);
input.click();

},

preview(file,detect,result){

const old=document.getElementById("hdos-upload-preview");
if(old) old.remove();

const panel=document.createElement("div");
panel.id="hdos-upload-preview";

panel.style.cssText=`
position:fixed;
right:20px;
bottom:20px;
width:360px;
background:#071423;
border:1px solid rgba(0,255,170,.25);
border-radius:18px;
padding:18px;
color:white;
font-family:inherit;
z-index:99999;
box-shadow:0 20px 50px rgba(0,0,0,.45);
`;

panel.innerHTML=`

<div style="font-size:18px;font-weight:700;margin-bottom:12px">
HDOS AI Engine
</div>

<div style="font-size:13px;color:#8fa3bf;margin-bottom:16px">
File berhasil dianalisis.
</div>

<div style="display:grid;gap:8px">

<div><b>Nama</b><br>${file.name}</div>

<div><b>Jenis</b><br>${detect.type.toUpperCase()}</div>

<div><b>Ukuran</b><br>${(file.size/1024).toFixed(1)} KB</div>

<div><b>Confidence</b><br>${Math.round(detect.confidence*100)}%</div>

<div><b>Status</b><br>${result.status}</div>

</div>

<button id="hdos-close-preview"
style="
margin-top:18px;
width:100%;
padding:10px;
border:none;
border-radius:12px;
background:#00E676;
color:#00130A;
font-weight:700;
cursor:pointer;">
Tutup
</button>

`;

document.body.appendChild(panel);

document.getElementById("hdos-close-preview")
.onclick=()=>panel.remove();

}

};

window.HDOSUpload=Upload;

})();
