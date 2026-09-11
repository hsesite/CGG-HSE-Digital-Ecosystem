/* ==========================================
   CGG HDOS Command Center
   Build #006
   ========================================== */

window.CommandCenter=(function(){

const shortcuts={

inspection:"inspection",
incident:"incident",
ptw:"ptw",
audit:"audit"

};

function render(){

return `
<div class="command-center">

<div class="command-bar">

<span class="command-icon">⌘</span>

<input
id="command-input"
class="command-input"
placeholder="Cari Unit, Area, PICA atau buka Modul...">

<span class="command-hint">Ctrl + K</span>

</div>

</div>
`;

}

function bind(){

const input=document.getElementById("command-input");

if(!input) return;

input.addEventListener("keydown",e=>{

if(e.key!=="Enter") return;

const value=input.value.trim().toLowerCase();

if(shortcuts[value]){

alert("Workspace: "+shortcuts[value]);

input.value="";

return;

}

alert("Pencarian: "+value);

});

document.addEventListener("keydown",e=>{

if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){

e.preventDefault();

input.focus();

}

});

}

return{

render,
bind

};

})();
