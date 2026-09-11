/* ==========================================
   CGG HDOS Widget Engine
   Build #003
   ========================================== */

window.WidgetEngine=(function(){

const registry={};

function register(name,builder){

registry[name]=builder;

}

function render(name,data={}){

if(!registry[name]){

return `
<div class="widget span-12">

<div class="widget-title">
Widget belum tersedia
</div>

</div>`;

}

return registry[name](data);

}

function list(){

return Object.keys(registry);

}

return{

register,
render,
list

};

})();

/* ---------- Default Widgets ---------- */

WidgetEngine.register("kpi",data=>`

<div class="widget span-3">

<div class="widget-header">

<div>

<div class="widget-subtitle">${data.label||"KPI"}</div>

<div class="widget-number">${data.value??0}</div>

</div>

<div class="widget-icon">

📊

</div>

</div>

<div class="widget-chip">

${data.status||"Realtime"}

</div>

</div>

`);

WidgetEngine.register("placeholder",data=>`

<div class="widget span-${data.span||6}">

<div class="widget-title">

${data.title||"Widget"}

</div>

<div class="widget-subtitle">

${data.text||"Segera hadir."}

</div>

</div>

`);
