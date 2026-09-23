/* ==========================================
   CGG HDOS Inspection Runtime
   Build 27.4 Enterprise
   Dynamic Checklist Runtime
   ========================================== */

(() => {

"use strict";

function escapeHtml(value){
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeSchema(template){
  const raw = template?.template?.schema;
  const fields = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.fields)
      ? raw.fields
      : [];

  return fields
    .map((item, index) => {
      if(typeof item === "string") return {label:item};
      if(item && typeof item === "object") return item;
      return {label:`Item ${index + 1}`};
    })
    .filter(item => item.label || item.key);
}

const Runtime = {

  container: null,
  currentTemplate: null,
  photos: [],

  async renderSelector(container){

    if(!container){
      throw new Error("Container form inspeksi tidak ditemukan.");
    }

    if(!window.HDOSRepository?.listTemplates){
      throw new Error("Repository belum dimuat.");
    }

    this.container = container;
    const result = await window.HDOSRepository.listTemplates("Inspection");
    const templates = Array.isArray(result) ? result : [];

    container.innerHTML = `
      <div class="form-group">
        <label>Jenis Pemeriksaan</label>
        <select id="hdos-template-select">
          <option value="">-- Pilih Pemeriksaan --</option>
          ${templates.map(t => `<option value="${escapeHtml(t?.id)}">${escapeHtml(t?.title || "Tanpa Judul")}</option>`).join("")}
        </select>
      </div>
      <div id="hdos-template-render"></div>
    `;

    const select = container.querySelector("#hdos-template-select");
    if(select){
      select.onchange = () => this.load(select.value, templates);
    }

  },

  load(id, templates = []){

    const safeTemplates = Array.isArray(templates) ? templates : [];
    const tpl = safeTemplates.find(t => String(t?.id || "") === String(id));
    this.currentTemplate = tpl || null;

    const box = this.container?.querySelector("#hdos-template-render")
      || document.getElementById("hdos-template-render");

    if(!box) return;

    if(!tpl){
      box.innerHTML = "";
      return;
    }

    box.innerHTML = `
      <div class="glass-card" style="margin-top:18px;padding:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h3 style="margin:0;">${escapeHtml(tpl.title || "Judul tidak tersedia")}</h3>
            <div style="font-size:13px;color:#8aa2bf;">No Form: ${escapeHtml(tpl.noForm || "-")}</div>
          </div>
          <span class="badge badge-info">${escapeHtml(tpl.inspectionType || "Inspection")}</span>
        </div>
        <hr class="section-divider">
        <div class="hdos-runtime-checklist"></div>
      </div>
    `;

    this.renderChecklist(tpl, box.querySelector(".hdos-runtime-checklist"));

  },

  renderChecklist(tpl, target = null){

    const list = target || this.container?.querySelector(".hdos-runtime-checklist");
    if(!list) return;

    const schema = normalizeSchema(tpl);
    if(!schema.length){
      list.innerHTML = `<p class="muted">Checklist belum tersedia pada template ini.</p>`;
      return;
    }

    list.innerHTML = schema.map((item, i) => `
      <div class="glass-card runtime-checklist-item" data-index="${i}" style="margin-bottom:14px;padding:16px;">
        <div style="font-weight:600;">${i + 1}. ${escapeHtml(item.label || item.key || `Item ${i + 1}`)}</div>
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
    const root = this.container?.querySelector(".hdos-runtime-checklist") || document;

    root.querySelectorAll(".runtime-checklist-item").forEach((card, i) => {
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
