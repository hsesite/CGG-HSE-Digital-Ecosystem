/* ==========================================
   CGG HDOS Inspection Runtime
   Build 27.4 Enterprise
   Dynamic Checklist Runtime
   ========================================== */

(() => {

"use strict";

const Runtime = {

  container: null,
  currentTemplate: null,
  photos: [],

  async renderSelector(container){

    if(!container){
      throw new Error("Container form inspeksi tidak ditemukan.");
    }

    this.container = container;

    const templates = Array.isArray(
      await window.HDOSRepository?.listTemplates?.("Inspection")
    )
      ? await window.HDOSRepository.listTemplates("Inspection")
      : [];

    container.innerHTML = `
      <div class="form-group">
        <label>Jenis Pemeriksaan</label>
        <select id="hdos-template-select">
          <option value="">-- Pilih Pemeriksaan --</option>
          ${templates.map(t => `<option value="${t.id}">${t.title}</option>`).join("")}
        </select>
      </div>
      <div id="hdos-template-render"></div>
    `;

    const select = document.getElementById("hdos-template-select");

    if(select){
      select.onchange = () => this.load(select.value, templates);
    }

  },

  load(id, templates = []){

    const safeTemplates = Array.isArray(templates) ? templates : [];
    const tpl = safeTemplates.find(t => String(t?.id || "") === String(id));

    this.currentTemplate = tpl || null;

    const box = document.getElementById("hdos-template-render");

    if(!box){
      return;
    }

    if(!tpl){
      box.innerHTML = "";
      return;
    }

    box.innerHTML = `
      <div class="glass-card" style="margin-top:18px;padding:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h3 style="margin:0;">${tpl.title || "Judul tidak tersedia"}</h3>
            <div style="font-size:13px;color:#8aa2bf;">
              No Form: ${tpl.noForm || "-"}
            </div>
          </div>
          <span class="badge badge-info">${tpl.inspectionType || "Inspection"}</span>
        </div>
        <hr class="section-divider">
        <div id="hdos-runtime-checklist"></div>
      </div>
    `;

    this.renderChecklist(tpl);

  },

  renderChecklist(tpl){

    const list = document.getElementById("hdos-runtime-checklist");

    if(!list){
      return;
    }

    const schema = Array.isArray(tpl?.template?.schema)
      ? tpl.template.schema
      : [
          {label:"Item 1"},
          {label:"Item 2"},
          {label:"Item 3"}
        ];

    list.innerHTML = schema.map((item, i) => `
      <div class="glass-card" style="margin-bottom:14px;padding:16px;">
        <div style="font-weight:600;">${i + 1}. ${item.label || `Item ${i + 1}`}</div>
        <div style="display:flex;gap:18px;margin-top:12px;">
          <label><input type="radio" name="ck-${i}" value="Ya"> Ya</label>
          <label><input type="radio" name="ck-${i}" value="Tidak"> Tidak</label>
        </div>
        <textarea class="runtime-note" data-index="${i}" placeholder="Catatan..." style="margin-top:12px;"></textarea>
        <input type="file" accept="image/*" capture="environment" class="runtime-photo" data-index="${i}" style="margin-top:12px;">
      </div>
    `).join("");

  },

  collect(){

    const checklist = [];

    document.querySelectorAll("#hdos-runtime-checklist .glass-card").forEach((card, i) => {
      const answer = card.querySelector(`input[name="ck-${i}"]:checked`)?.value || "";
      const note = card.querySelector(".runtime-note")?.value || "";
      const photoInput = card.querySelector(".runtime-photo");

      checklist.push({
        no: i + 1,
        answer,
        note,
        photo: photoInput?.files?.[0] || null
      });
    });

    return {
      template: this.currentTemplate?.id || null,
      checklist,
      photos: checklist.filter(c => c.photo).map(c => c.photo)
    };

  }

};

window.HDOSInspectionRuntime = Runtime;

})();
