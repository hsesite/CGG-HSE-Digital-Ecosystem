/* ==========================================
   Inspection Module v3.1
   CGG HSE Digital Ecosystem
   Enterprise Inspection Engine
   Foundation Freeze FF-00B-8
   ========================================== */

const InspectionModule = (() => {

  let findings = [];

  /* ==========================================
     Render
     ========================================== */

  async function render(target = null) {

    const view = target || document.getElementById("router-view");
    if (!view) return;

    await InspectionMaster.load();

    findings = [];

    view.innerHTML = `
      <div class="slide-up">

        <div class="section-header">
          <h2 class="section-title">Inspection</h2>
          <span class="badge badge-info">Live Form</span>
        </div>

        <div class="glass inspection-form">

          <div class="form-grid">

            <div class="form-group">
              <label>Perusahaan</label>
              <select id="company"></select>
            </div>

            <div class="form-group">
              <label>Site</label>
              <input id="site" readonly>
            </div>

            <div class="form-group">
              <label>Area</label>
              <select id="area"></select>
            </div>

            <div class="form-group">
              <label>Shift</label>
              <select id="shift">
                <option>Pagi</option>
                <option>Malam</option>
              </select>
            </div>

            <div class="form-group">
              <label>Unit ID</label>
              <select id="unit"></select>
            </div>

            <div class="form-group">
              <label>Nomor Unit</label>
              <input id="unit-number" readonly>
            </div>

            <div class="form-group">
              <label>Jenis Unit</label>
              <input id="unit-type" readonly>
            </div>

            <div class="form-group">
              <label>Inspector</label>
              <input id="inspector" placeholder="Nama Inspector">
            </div>

            <div class="form-group">
              <label>Tanggal</label>
              <input id="date" type="date">
            </div>

          </div>

          <hr class="section-divider">

          <div class="finding-header">

            <h3>Daftar Temuan</h3>

            <button id="btn-add-finding"
                    class="btn-outline"
                    type="button">

              + Tambah Temuan

            </button>

          </div>

          <div id="finding-list"
               class="finding-list"></div>

          <button id="btn-save-inspection"
                  class="btn-primary"
                  type="button">

            Simpan Inspection

          </button>

        </div>
       
        <!-- ==========================================
             Quick Action Bar
             FF-00B-8
             ========================================== -->

        <div id="quick-action-bar"
             class="quick-action-bar">

          <button id="fab-photo"
                  class="quick-action-btn"
                  type="button"
                  title="Foto">

            📷

          </button>

          <button id="fab-add"
                  class="quick-action-btn"
                  type="button"
                  title="Tambah Temuan">

            ➕

          </button>

          <button id="fab-save"
                  class="quick-action-btn primary"
                  type="button"
                  title="Simpan Inspection">

            Simpan

          </button>

        </div>

      </div>
    `;

    document.getElementById("date").value = today();

    populateMasterData();

    document
      .getElementById("btn-add-finding")
      .addEventListener("click", addFinding);

    document
      .getElementById("btn-save-inspection")
      .addEventListener("click", submitInspection);

    document
      .getElementById("area")
      .addEventListener("change", autoFillArea);

    document
      .getElementById("unit")
      .addEventListener("change", autoFillUnit);

    addFinding();

    /* FF-00B-8 */

    initQuickActionBar();

  }

  /* ==========================================
     Master Data
     ========================================== */

  function populateMasterData(){

    const company=document.getElementById("company");
    const area=document.getElementById("area");
    const unit=document.getElementById("unit");

    company.innerHTML=InspectionMaster.contractors
      .map(c=>`<option value="${c.induk}">${c.nama}</option>`)
      .join("");

    area.innerHTML=InspectionMaster.areas
      .map(a=>`<option value="${a.area_id}">${a.area}</option>`)
      .join("");

    unit.innerHTML=InspectionMaster.units
      .map(u=>`<option value="${u.unit_id}">${u.unit_id}</option>`)
      .join("");

    autoFillArea();
    autoFillUnit();

  }

  function autoFillArea(){

    const id=document.getElementById("area").value;

    const data=InspectionMaster.areas.find(
      a=>a.area_id===id
    );

    if(!data) return;

    document.getElementById("site").value=data.site;

  }

  function autoFillUnit(){

    const id=document.getElementById("unit").value;

    const data=InspectionMaster.units.find(
      u=>u.unit_id===id
    );

    if(!data) return;

    document.getElementById("unit-number").value=data.nomor;
    document.getElementById("unit-type").value=data.jenis;

  }

  /* ==========================================
     Finding
     ========================================== */

  function addFinding(){

    findings.push({

      category:"",
      subcategory:"",
      description:"",
      consequence:"",
      control:"",
      risk:"LOW"

    });

    drawFindings();

  }

  function removeFinding(index){

    findings.splice(index,1);

    if(findings.length===0){

      addFinding();
      return;

    }

    drawFindings();

  }

  function drawFindings(){

    const list=document.getElementById("finding-list");

    if(!list) return;

    list.innerHTML="";

    const categories=[
      ...new Set(
        InspectionMaster.hazards.map(h=>h.category)
      )
    ];

    findings.forEach((f,index)=>{

      const subs=InspectionMaster.hazards
        .filter(h=>h.category===f.category)
        .map(h=>h.subcategory);

      const card=document.createElement("div");

      card.className="finding-card";

      card.innerHTML=`

        <div class="finding-card-header">

          <h4>Temuan ${index+1}</h4>

          <button class="remove-btn"
                  data-index="${index}"
                  type="button">

            Hapus

          </button>

        </div>

        <div class="finding-grid">

          <div class="form-group">

            <label>Kategori</label>

            <select class="category"
                    data-index="${index}">

              <option value="">Pilih</option>

              ${categories.map(c=>`
                <option ${f.category===c?"selected":""}>
                  ${c}
                </option>
              `).join("")}

            </select>

          </div>

          <div class="form-group">

            <label>Subkategori</label>

            <select class="subcategory"
                    data-index="${index}">

              <option value="">Pilih</option>

              ${subs.map(s=>`
                <option ${f.subcategory===s?"selected":""}>
                  ${s}
                </option>
              `).join("")}

            </select>

          </div>

          <div class="form-group full">

            <label>Deskripsi</label>

            <textarea class="description"
                      data-index="${index}"
                      rows="4"
                      placeholder="Jelaskan kondisi yang ditemukan...">${f.description}</textarea>

          </div>

          <div class="form-group">

            <label>Potensi Konsekuensi</label>

            <input class="consequence"
                   value="${f.consequence}"
                   readonly>

          </div>

          <div class="form-group">

            <label>Kontrol Awal</label>

            <input class="control"
                   value="${f.control}"
                   readonly>

          </div>

          <div class="form-group">

            <label>Tingkat Risiko</label>

            <input class="risk"
                   value="${f.risk}"
                   readonly>

          </div>

        </div>

      `;

      list.appendChild(card);

    });

    bindFindingEvents();

  }
     function bindFindingEvents(){

    document.querySelectorAll(".remove-btn").forEach(btn=>{

      btn.onclick=()=>removeFinding(Number(btn.dataset.index));

    });

    document.querySelectorAll(".category").forEach(el=>{

      el.onchange=e=>{

        const i=Number(e.target.dataset.index);

        findings[i].category=e.target.value;
        findings[i].subcategory="";

        const match=InspectionMaster.hazards.find(
          h=>h.category===findings[i].category
        );

        if(match){

          findings[i].consequence=match.consequence;
          findings[i].control=match.control;
          findings[i].risk=match.risk;

        }else{

          findings[i].consequence="";
          findings[i].control="";
          findings[i].risk="LOW";

        }

        drawFindings();

      };

    });

    document.querySelectorAll(".subcategory").forEach(el=>{

      el.onchange=e=>{

        const i=Number(e.target.dataset.index);

        findings[i].subcategory=e.target.value;

        const match=InspectionMaster.hazards.find(
          h=>
            h.category===findings[i].category &&
            h.subcategory===findings[i].subcategory
        );

        if(match){

          findings[i].consequence=match.consequence;
          findings[i].control=match.control;
          findings[i].risk=match.risk;

        }

        drawFindings();

      };

    });

    document.querySelectorAll(".description").forEach(el=>{

      el.oninput=e=>{

        findings[e.target.dataset.index].description=e.target.value;

      };

    });

  }

  /* ==========================================
     Submit
     ========================================== */

  async function submitInspection(){

    const payload={

      company:document.getElementById("company").value,
      site:document.getElementById("site").value,
      area:document.getElementById("area").value,
      shift:document.getElementById("shift").value,
      unit:document.getElementById("unit").value,
      unit_number:document.getElementById("unit-number").value,
      unit_type:document.getElementById("unit-type").value,
      inspector:document.getElementById("inspector").value.trim(),
      date:document.getElementById("date").value,
      findings

    };

    if(!payload.area)
      return alert("Area wajib dipilih.");

    if(!payload.unit)
      return alert("Unit wajib dipilih.");

    if(!payload.inspector)
      return alert("Nama Inspector wajib diisi.");

    const kosong=findings.some(f=>!f.description.trim());

    if(kosong)
      return alert("Semua deskripsi temuan wajib diisi.");

    try{

      const result=await apiPost("inspection",payload);

      if(!result.success){

        alert(result.message||"Gagal menyimpan.");

        return;

      }

      alert(`Inspection ${result.inspection_id} berhasil disimpan.`);

      if(window.DashboardLive){

        DashboardLive.refresh();

      }
      EnterpriseModal.close();
      render(false);

    }catch(err){

      console.error(err);

      alert("Gagal mengirim data.");

    }

  }

  /* ==========================================
     Quick Action Bar
     FF-00B-8
     ========================================== */

  function initQuickActionBar(){

    const bar=document.getElementById("quick-action-bar");

    if(!bar) return;

    const btnAdd=document.getElementById("fab-add");
    const btnSave=document.getElementById("fab-save");
    const btnPhoto=document.getElementById("fab-photo");

    const handleScroll=()=>{

      if(window.scrollY>280){

        bar.classList.add("show");

      }else{

        bar.classList.remove("show");

      }

    };

    window.addEventListener("scroll",handleScroll,{passive:true});

    handleScroll();

    if(btnAdd){

      btnAdd.onclick=()=>{

        document.getElementById("btn-add-finding")?.click();

      };

    }

    if(btnSave){

      btnSave.onclick=()=>{

        document.getElementById("btn-save-inspection")?.click();

      };

    }

    if(btnPhoto){

      btnPhoto.onclick=()=>{

        alert("Fitur kamera akan diaktifkan pada Sprint 4.");

      };

    }

  }

  /* ==========================================
     Helper
     ========================================== */

  function today(){

    return new Date().toISOString().split("T")[0];

  }

  return{

    render

  };

})();

/* ==========================================
   Enterprise Master Loader
   v3.1
   ========================================== */

window.InspectionMaster={

  units:[],
  areas:[],
  contractors:[],
  hazards:[],

  async load(){

    try{

      const [u,a,c,h]=await Promise.all([

        apiGet("units"),
        apiGet("areas"),
        apiGet("contractors"),
        apiGet("hazards")

      ]);

      this.units=u.items||[];
      this.areas=a.items||[];
      this.contractors=c.items||[];
      this.hazards=h.items||[];

      console.log("Master Data Loaded",{

        unit:this.units.length,
        area:this.areas.length,
        contractor:this.contractors.length,
        hazard:this.hazards.length

      });

    }catch(err){

      console.error("Master Loader Error",err);

    }

  }

};
/* ==========================================
   Open Inspection Modal
   ========================================== */

InspectionModule.openModal = async function(){

    const body = EnterpriseModal.open("Inspection");

    await InspectionModule.render(body);

};
