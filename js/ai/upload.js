/* ==========================================
   CGG HDOS AI Upload Center
   Build 26.1.2 Stable
   Permanent Upload Launcher
   ========================================== */

(() => {

"use strict";

const Upload={

input:null,

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

const detect=HDOSDetector.detect(file);
const result=await HDOSEngine.process(file);

this.showResult(file,detect,result);

/* reset agar file sama bisa dipilih lagi */

this.input.value="";

});

document.body.appendChild(this.input);

/* Floating Upload Button */

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

buploadButton.onclick = ()=>Router.navigate("upload");

document.body.appendChild(btn);

},

showResult(file,detect,result){

const old=document.getElementById("hdos-upload-preview");
if(old) old.remove();

const panel=document.createElement("div");

panel.id="hdos-upload-preview";

panel.style.cssText=`
position:fixed;
right:24px;
bottom:84px;
width:360px;
background:#071423;
border:1px solid rgba(0,255,170,.25);
border-radius:18px;
padding:18px;
color:white;
z-index:99999;
box-shadow:0 20px 50px rgba(0,0,0,.45);
`;

panel.innerHTML=`

<div style="font-size:18px;font-weight:700;margin-bottom:12px">
HDOS AI Engine
</div>

<div style="font-size:13px;color:#9fb3c8;margin-bottom:16px">
Dokumen berhasil dianalisis.
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

document.getElementById("hdos-close-preview").onclick=()=>panel.remove();

}

};

window.HDOSUpload=Upload;

/* Auto Start */

window.addEventListener("load",()=>Upload.init());

})();
