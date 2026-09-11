/* ==========================================
   CGG HDOS Window Manager Lite
   Build #005
   ========================================== */

window.WindowManager=(function(){

const history=[];

let stage;

function ensure(){

if(stage) return;

stage=document.createElement("div");

stage.className="stage-manager";

stage.id="stage-manager";

document.body.appendChild(stage);

}

function refresh(){

ensure();

stage.innerHTML="";

history.slice(-5).forEach((item,index)=>{

const card=document.createElement("div");

card.className="stage-card";

if(index===history.length-1){

card.classList.add("active");

}

card.textContent=item.title;

card.onclick=()=>{

WorkspaceEngine.open(item.title,item.content);

};

stage.appendChild(card);

});

}

function open(title,content){

history.push({

title,
content

});

refresh();

WorkspaceEngine.open(title,content);

const view=document.getElementById("router-view");

if(view){

view.classList.add("dashboard-blur");

}

}

function close(){

WorkspaceEngine.close();

const view=document.getElementById("router-view");

if(view){

view.classList.remove("dashboard-blur");

}

}

return{

open,
close,
history

};

})();
