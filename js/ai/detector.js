/* ==========================================
   CGG HDOS AI Engine
   Detector
   Build 26.1
   ========================================== */

(() => {

"use strict";

const Detector={

detect(file){

const name=file.name.toLowerCase();

const ext=name.split(".").pop();

const map={

pdf:"pdf",
doc:"word",
docx:"word",
xls:"excel",
xlsx:"excel",
jpg:"image",
jpeg:"image",
png:"image",
webp:"image"

};

const type=map[ext]||"unknown";

return{

type,
extension:ext,
filename:file.name,
size:file.size,
confidence:type==="unknown"?0.5:1

};

}

};

window.HDOSDetector=Detector;

})();
