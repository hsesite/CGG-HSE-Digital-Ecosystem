/* ==========================================
   CGG HDOS Layout Engine
   Build #004
   ========================================== */

window.LayoutEngine=(function(){

const layouts={};

function register(name,config){

layouts[name]=config;

}

function current(){

const w=window.innerWidth;

if(w<=768) return "mobile";

if(w<=1024) return "tablet";

return "desktop";

}

function render(role="foreman"){

const mode=current();

const key=`${role}-${mode}`;

return layouts[key]||layouts[`default-${mode}`]||[];

}

window.addEventListener("resize",()=>{

document.dispatchEvent(
new Event("layout-change")
);

});

return{

register,
render,
current

};

})();

/* ---------- Default Layout ---------- */

LayoutEngine.register("default-desktop",[

["header"],

["kpi","kpi","kpi","kpi"],

["workspace","timeline"],

["contractor","notification"],

["system"]

]);

LayoutEngine.register("default-tablet",[

["header"],

["kpi","kpi"],

["kpi","kpi"],

["workspace"],

["timeline"],

["contractor"],

["notification"],

["system"]

]);

LayoutEngine.register("default-mobile",[

["header"],

["kpi"],

["kpi"],

["kpi"],

["kpi"],

["workspace"],

["timeline"],

["contractor"],

["notification"],

["system"]

]);
