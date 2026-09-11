/* ==========================================
   Inspection Module v1.0
   CGG HSE Digital Ecosystem
   ========================================== */

const InspectionModule = (() => {

  let findings = [];

  /* ---------- Render ---------- */

  function render() {

    const view = document.getElementById("router-view");
    if (!view) return;

    findings = [];
    addFinding();

    view.innerHTML = `
      <div class="slide-up">

        <div class="section-header">
          <h2 class="section-title">Inspection</h2>
          <span class="badge badge-info">Live Form</span>
        </div>

        <div class="glass" style="padding:24px;">

          <div class="form-grid">

            <div class="field">
              <label>Perusahaan</label>
              <select id="company">
                <option value="CGG">CGG</option>
                <option value="VIP">VIP</option>
                <option value="SLS">SLS</option>
                <option value="SUBKON">SUBKON</option>
              </select>
            </div>

            <div class="field">
              <label>Site</label>
              <input id="site" placeholder="Contoh: Siumbatu">
            </div>

            <div class="field">
              <label>Area</label>
              <input id="area" placeholder="Contoh: Pit Jaja KM10">
            </div>

            <div class="field">
              <label>Shift</label>
              <select id="shift">
                <option>Pagi</option>
                <option>Malam</option>
              </select>
            </div>

            <div class="field">
              <label>Inspector</label>
              <input id="inspector" placeholder="Nama Inspector">
            </div>

            <div class="field">
              <label>Tanggal</label>
              <input id="date" type="date">
            </div>

          </div>

          <hr style="margin:24px 0;border-color:rgba(255,255,255,.08);">

          <row justify=between align=center>
            <title size=sm>Daftar Temuan</title>
            <button id="btn-add-finding" variant=outline>+ Tambah Temuan</button>
          </row>

          <box id="finding-list" gap=3 padding={{ top: 3, bottom: 3 }} />

          <button id="btn-save-inspection" block>Simpan Inspection</button>

        </div>

      </div>
    `;

    document.getElementById("date").value = today();

    document.getElementById("btn-add-finding").addEventListener("click", addFinding);

    document.getElementById("btn-save-inspection").addEventListener("click", submitInspection);

    drawFindings();
  }

  /* ---------- Finding ---------- */

  function addFinding() {

    findings.push({
      category: "Housekeeping",
      description: "",
      risk: "LOW"
    });

    drawFindings();
  }

  function removeFinding(index) {

    findings.splice(index,1);

    if(findings.length===0){
      addFinding();
      return;
    }

    drawFindings();
  }

  function drawFindings() {

    const list=document.getElementById("finding-list");
    if(!list) return;

    list.innerHTML="";

    findings.forEach((f,index)=>{

      const card=document.createElement("div");

      card.className="glass";

      card.style.padding="18px";

      card.innerHTML=`

        <row justify=between align=center>
          <title size=sm>Temuan ${index+1}</title>
          <button class="remove-btn" data-index="${index}" color=danger variant=outline size=sm>Hapus</button>
        </row>

        <box gap=2 padding={{ top: 2 }}>

          <box gap=1>
            <label size=sm>Kategori</label>
            <select class="category" data-index="${index}">
              <option ${f.category==="Housekeeping"?"selected":""}>Housekeeping</option>
              <option ${f.category==="APD"?"selected":""}>APD</option>
              <option ${f.category==="LV"?"selected":""}>LV</option>
              <option ${f.category==="Heavy Equipment"?"selected":""}>Heavy Equipment</option>
              <option ${f.category==="Environment"?"selected":""}>Environment</option>
              <option ${f.category==="Electrical"?"selected":""}>Electrical</option>
            </select>
          </box>

          <box gap=1>
            <label size=sm>Deskripsi</label>
            <textarea class="description" data-index="${index}" rows=3 placeholder="Jelaskan kondisi yang ditemukan...">${f.description}</textarea>
          </box>

          <box gap=1>
            <label size=sm>Tingkat Risiko</label>
            <select class="risk" data-index="${index}">
              <option ${f.risk==="LOW"?"selected":""}>LOW</option>
              <option ${f.risk==="MEDIUM"?"selected":""}>MEDIUM</option>
              <option ${f.risk==="HIGH"?"selected":""}>HIGH</option>
              <option ${f.risk==="CRITICAL"?"selected":""}>CRITICAL</option>
            </select>
          </box>

        </box>

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

        findings[e.target.dataset.index].category=e.target.value;

      };

    });

    document.querySelectorAll(".description").forEach(el=>{

      el.oninput=e=>{

        findings[e.target.dataset.index].description=e.target.value;

      };

    });

    document.querySelectorAll(".risk").forEach(el=>{

      el.onchange=e=>{

        findings[e.target.dataset.index].risk=e.target.value;

      };

    });

  }

  /* ---------- Submit ---------- */

  async function submitInspection(){

    const payload={

      company:document.getElementById("company").value,
      site:document.getElementById("site").value.trim(),
      area:document.getElementById("area").value.trim(),
      shift:document.getElementById("shift").value,
      inspector:document.getElementById("inspector").value.trim(),
      date:document.getElementById("date").value,
      findings

    };

    if(!payload.site)
      return alert("Site wajib diisi.");

    if(!payload.area)
      return alert("Area wajib diisi.");

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

      render();

    }catch(err){

      console.error(err);

      alert("Gagal mengirim data.");

    }

  }

  /* ---------- Helper ---------- */

  function today(){

    const d=new Date();

    return d.toISOString().split("T")[0];

  }

  return{

    render

  };

})();
