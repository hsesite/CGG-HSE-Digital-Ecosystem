/* ==========================================
   Inspection Module v3.1
   CGG HSE Digital Ecosystem
   Enterprise Inspection Engine
   Foundation Freeze FF-00B-8
   ========================================== */

const InspectionModule = (() => {

  let findings = [];

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
            <div class="form-group"><label>Perusahaan</label><select id="company"></select></div>
            <div class="form-group"><label>Site</label><input id="site" readonly></div>
            <div class="form-group"><label>Area</label><select id="area"></select></div>
            <div class="form-group"><label>Shift</label><select id="shift"><option>Pagi</option><option>Malam</option></select></div>
            <div class="form-group"><label>Unit ID</label><select id="unit"></select></div>
            <div class="form-group"><label>Nomor Unit</label><input id="unit-number" readonly></div>
            <div class="form-group"><label>Jenis Unit</label><input id="unit-type" readonly></div>
            <div class="form-group"><label>Inspector</label><input id="inspector" placeholder="Nama Inspector"></div>
            <div class="form-group"><label>Tanggal</label><input id="date" type="date"></div>
          </div>
          <div id="hdos-runtime-wrapper" class="glass-card" style="margin:24px 0;padding:20px;border:1px solid rgba(0,230,118,.15);">
            <h3>Jenis Pemeriksaan</h3>
            <div id="hdos-runtime" style="margin-top:18px;"></div>
          </div>
          <hr class="section-divider">
          <div class="finding-header"><h3>Daftar Temuan</h3><button id="btn-add-finding" class="btn-outline" type="button">+ Tambah Temuan</button></div>
          <div id="finding-list" class="finding-list"></div>
          <button id="btn-save-inspection" class="btn-primary" type="button">Simpan Inspection</button>
        </div>
      </div>`;

    document.getElementById("date").value = today();
    populateMasterData();

    const runtimeContainer = document.getElementById("hdos-runtime");
    if(runtimeContainer && window.HDOSInspectionRuntime){
      try {
        await HDOSInspectionRuntime.renderSelector(runtimeContainer);
      } catch(error) {
        console.error("Runtime gagal:", error);
        runtimeContainer.innerHTML = `<div class="muted">Template gagal dimuat.</div>`;
      }
    }

    document.getElementById("btn-add-finding")?.addEventListener("click", addFinding);
    document.getElementById("btn-save-inspection")?.addEventListener("click", submitInspection);
    document.getElementById("area")?.addEventListener("change", autoFillArea);
    document.getElementById("unit")?.addEventListener("change", autoFillUnit);

    addFinding();
  }

  function populateMasterData(){
    const company = document.getElementById("company");
    const area = document.getElementById("area");
    const unit = document.getElementById("unit");
    if(!company || !area || !unit) return;

    company.innerHTML = InspectionMaster.contractors.map(c => `<option value="${c.induk}">${c.nama}</option>`).join("");
    area.innerHTML = InspectionMaster.areas.map(a => `<option value="${a.area_id}">${a.area}</option>`).join("");
    unit.innerHTML = InspectionMaster.units.map(u => `<option value="${u.unit_id}">${u.unit_id}</option>`).join("");
    autoFillArea();
    autoFillUnit();
  }

  function autoFillArea(){
    const id = document.getElementById("area")?.value;
    const data = InspectionMaster.areas.find(a => String(a.area_id) === String(id));
    const site = document.getElementById("site");
    if(site) site.value = data?.site || "";
  }

  function autoFillUnit(){
    const id = document.getElementById("unit")?.value;
    const data = InspectionMaster.units.find(u => String(u.unit_id) === String(id));
    const number = document.getElementById("unit-number");
    const type = document.getElementById("unit-type");
    if(number) number.value = data?.nomor || "";
    if(type) type.value = data?.jenis || "";
  }

  function addFinding(){
    findings.push({category:"",subcategory:"",description:"",consequence:"",control:"",risk:"LOW"});
    drawFindings();
  }

  function removeFinding(index){
    findings.splice(index, 1);
    if(!findings.length) addFinding(); else drawFindings();
  }

  function drawFindings(){
    const list = document.getElementById("finding-list");
    if(!list) return;
    const hazards = Array.isArray(InspectionMaster.hazards) ? InspectionMaster.hazards : [];
    const categories = [...new Set(hazards.map(h => h.category).filter(Boolean))];
    list.innerHTML = findings.map((f, index) => {
      const subs = hazards.filter(h => h.category === f.category).map(h => h.subcategory).filter(Boolean);
      return `<div class="finding-card">
        <div class="finding-card-header"><h4>Temuan ${index + 1}</h4><button class="remove-btn" data-index="${index}" type="button">Hapus</button></div>
        <div class="finding-grid">
          <div class="form-group"><label>Kategori</label><select class="category" data-index="${index}"><option value="">Pilih</option>${categories.map(c => `<option value="${c}" ${f.category === c ? "selected" : ""}>${c}</option>`).join("")}</select></div>
          <div class="form-group"><label>Subkategori</label><select class="subcategory" data-index="${index}"><option value="">Pilih</option>${subs.map(s => `<option value="${s}" ${f.subcategory === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
          <div class="form-group full"><label>Deskripsi</label><textarea class="description" data-index="${index}" rows="4" placeholder="Jelaskan kondisi yang ditemukan...">${f.description}</textarea></div>
          <div class="form-group"><label>Potensi Konsekuensi</label><input class="consequence" value="${f.consequence}" readonly></div>
          <div class="form-group"><label>Kontrol Awal</label><input class="control" value="${f.control}" readonly></div>
          <div class="form-group"><label>Tingkat Risiko</label><input class="risk" value="${f.risk}" readonly></div>
        </div></div>`;
    }).join("");

    list.querySelectorAll(".remove-btn").forEach(btn => btn.onclick = () => removeFinding(Number(btn.dataset.index)));
    list.querySelectorAll(".category").forEach(el => el.onchange = event => {
      const i = Number(event.target.dataset.index);
      const finding = findings[i];
      if(!finding) return;
      finding.category = event.target.value;
      finding.subcategory = "";
      const match = hazards.find(h => h.category === finding.category);
      finding.consequence = match?.consequence || "";
      finding.control = match?.control || "";
      finding.risk = match?.risk || "LOW";
      drawFindings();
    });
    list.querySelectorAll(".subcategory").forEach(el => el.onchange = event => {
      const i = Number(event.target.dataset.index);
      const finding = findings[i];
      if(!finding) return;
      finding.subcategory = event.target.value;
      const match = hazards.find(h => h.category === finding.category && h.subcategory === finding.subcategory);
      if(match){ finding.consequence = match.consequence || ""; finding.control = match.control || ""; finding.risk = match.risk || "LOW"; }
      drawFindings();
    });
    list.querySelectorAll(".description").forEach(el => el.oninput = event => {
      const finding = findings[Number(event.target.dataset.index)];
      if(finding) finding.description = event.target.value;
    });
  }

  async function submitInspection(){
    const runtimeData = window.HDOSInspectionRuntime?.collect?.() || {template:null, checklist:[], photos:[]};
    const inspector = document.getElementById("inspector")?.value.trim() || "";
    const payload = {
      company: document.getElementById("company")?.value || "",
      site: document.getElementById("site")?.value || "",
      area: document.getElementById("area")?.value || "",
      shift: document.getElementById("shift")?.value || "",
      unit: document.getElementById("unit")?.value || "",
      unit_number: document.getElementById("unit-number")?.value || "",
      unit_type: document.getElementById("unit-type")?.value || "",
      inspector,
      date: document.getElementById("date")?.value || "",
      findings: findings.map(f => ({...f})),
      inspectionTemplate: runtimeData.template,
      inspectionChecklist: runtimeData.checklist,
      // File objects are retained in IndexedDB by the queue path and are not
      // uploaded directly from the UI, preserving Offline First.
      inspectionPhotos: runtimeData.photos
    };

    if(!payload.area) return alert("Area wajib dipilih.");
    if(!payload.unit) return alert("Unit wajib dipilih.");
    if(!payload.inspector) return alert("Nama Inspector wajib diisi.");
    if(findings.some(f => !String(f.description || "").trim())) return alert("Semua deskripsi temuan wajib diisi.");
    if(payload.inspectionChecklist.some(item => !item.answer)) return alert("Semua item checklist wajib dijawab.");
    if(payload.inspectionChecklist.some(item => !item.photo)) return alert("Foto wajib dilampirkan pada setiap item checklist.");

    try {
      const result = await HDOSModule.save({module:"inspection", payload, company:payload.company, createdBy:payload.inspector});
      alert(result.sync?.processed > 0
        ? `Inspection tersimpan dan tersinkron (${result.item.id}).`
        : `Inspection tersimpan offline (${result.item.id}). Akan disinkronkan otomatis.`);
      window.DashboardLive?.refresh?.();
      window.EnterpriseModal?.close?.();
      await render(false);
    } catch(error) {
      console.error("Inspection save:", error);
      alert("Gagal menyimpan inspection secara lokal.");
    }
  }

  function today(){ return new Date().toISOString().split("T")[0]; }

  window.addEventListener("hdos:repository-updated", () => {
    const runtime = document.getElementById("hdos-runtime");
    if(runtime && window.HDOSInspectionRuntime) HDOSInspectionRuntime.renderSelector(runtime).catch(console.error);
  });

  return {render};
})();

window.Inspection = InspectionModule;
window.InspectionMaster = window.InspectionMaster || {
  units:[], areas:[], contractors:[], hazards:[],
  async load(){
    try {
      const [u,a,c,h] = await Promise.all([apiGet("units"), apiGet("areas"), apiGet("contractors"), apiGet("hazards")]);
      this.units = u?.items || []; this.areas = a?.items || []; this.contractors = c?.items || []; this.hazards = h?.items || [];
    } catch(error) { console.warn("Master Loader Error", error); }
  }
};
InspectionModule.openModal = async function(){
  const body = window.EnterpriseModal?.open?.("Inspection");
  if(body) await InspectionModule.render(body);
};
