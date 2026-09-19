/* ==========================================
   CGG HDOS Repository Upload Center
   Build 26 • AI Hybrid • Offline First
   ========================================== */

(() => {
"use strict";

const ACCEPTED = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"];
const MODULES = [
  ["inspection", "Inspection"],
  ["finding", "Finding"],
  ["hazard", "Hazard Report"],
  ["incident", "Incident"],
  ["waste", "Waste B3"],
  ["sop", "SOP"],
  ["policy", "Kebijakan"],
  ["contractor", "Contractor"]
];

function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}

function titleFromName(name) {

  return name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();

}

function suggestedModule(name) {

  const value = name.toLowerCase();

  if (/(incident|near.?miss|kecelakaan)/.test(value)) return "incident";
  if (/(hazard|bahaya|unsafe)/.test(value)) return "hazard";
  if (/(pica|corrective|tindakan)/.test(value)) return "finding";
  if (/(sop|standard operating)/.test(value)) return "sop";
  if (/(policy|kebijakan)/.test(value)) return "policy";

  return "inspection";

}

const RepositoryUpload = {

  input: null,
  jobs: [],

  render() {

    const view = document.getElementById("router-view");
    if (!view) return;

    this.init();

    view.innerHTML = `
      <div class="glass-card section-card fade-in">
        <div class="section-header">
          <div>
            <h1>Upload Center</h1>
            <p class="muted">Upload sekali, AI memberi rekomendasi, user mengonfirmasi sebelum menjadi aset Repository HDOS.</p>
          </div>
          <span class="badge badge-info">AI Hybrid</span>
        </div>

        <div id="hdos-repository-dropzone" class="hdos-dropzone" role="button" tabindex="0">
          📄 Klik atau Drop PDF, Word, Excel, atau gambar
        </div>

        <p class="muted" style="margin-top:12px;">
          AI tidak menyimpan otomatis. Setiap file harus direview dan dikonfirmasi.
        </p>

        <div id="hdos-repository-jobs" class="hdos-upload-list"></div>
      </div>
    `;

    const zone = view.querySelector("#hdos-repository-dropzone");

    zone.onclick = () => this.input.click();
    zone.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") this.input.click();
    };
    zone.ondragover = event => {
      event.preventDefault();
      zone.classList.add("drag");
    };
    zone.ondragleave = () => zone.classList.remove("drag");
    zone.ondrop = event => {
      event.preventDefault();
      zone.classList.remove("drag");
      this.handleFiles(event.dataTransfer.files);
    };

    this.renderJobs();

  },

  init() {

    if (this.input) return;

    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.multiple = true;
    this.input.accept = ACCEPTED.join(",");
    this.input.hidden = true;
    this.input.addEventListener("change", () => {
      this.handleFiles(this.input.files);
      this.input.value = "";
    });

    document.body.appendChild(this.input);

  },

  async handleFiles(files) {

    for (const file of Array.from(files || [])) {
      await this.process(file);
    }

  },

  async process(file) {

    const extension = `.${file.name.split(".").pop().toLowerCase()}`;

    if (!ACCEPTED.includes(extension)) {
      console.warn("Unsupported upload:", file.name);
      return;
    }

    const detection = HDOSDetector.detect(file);
    const analysis = await HDOSEngine.process(file);
    const job = {
      id: `JOB-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      name: file.name,
      title: titleFromName(file.name),
      size: file.size,
      type: detection.type,
      confidence: Math.round(detection.confidence * 100),
      module: suggestedModule(file.name),
      assetType: detection.type === "excel" ? "Form Template" : "Document",
      revision: "1.0",
      owner: "",
      analysis,
      status: "Needs Confirmation"
    };

    this.jobs.unshift(job);
    this.renderJobs();

  },

  renderJobs() {

    const list = document.getElementById("hdos-repository-jobs");
    if (!list) return;

    list.innerHTML = this.jobs.map(job => `
      <article class="glass-card" style="margin-top:18px;padding:18px;">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
          <div>
            <strong>${escapeHtml(job.name)}</strong>
            <div class="muted">${escapeHtml(job.type.toUpperCase())} • ${Math.ceil(job.size / 1024)} KB</div>
          </div>
          <span class="badge badge-warning">${escapeHtml(job.status)}</span>
        </div>

        <div class="form-grid" style="margin-top:16px;">
          <div class="form-group">
            <label>Judul Aset</label>
            <input data-field="title" data-id="${job.id}" value="${escapeHtml(job.title)}">
          </div>

          <div class="form-group">
            <label>Rekomendasi Modul</label>
            <select data-field="module" data-id="${job.id}">
              ${MODULES.map(([value, label]) => `
                <option value="${value}" ${job.module === value ? "selected" : ""}>${label}</option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>Jenis Aset</label>
            <select data-field="assetType" data-id="${job.id}">
              ${["Document", "Form Digital", "Form Template", "SOP", "Policy"]
                .map(value => `<option ${job.assetType === value ? "selected" : ""}>${value}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>Revisi</label>
            <input data-field="revision" data-id="${job.id}" value="${escapeHtml(job.revision)}">
          </div>

          <div class="form-group">
            <label>Owner</label>
            <input data-field="owner" data-id="${job.id}" value="${escapeHtml(job.owner)}">
          </div>

          <div class="form-group">
            <label>AI Confidence</label>
            <input value="${job.confidence}%" disabled>
          </div>
        </div>

        <div style="margin-top:16px;display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
          <button class="btn-secondary hdos-preview-btn" data-id="${job.id}" type="button">Preview Recommendation</button>
          <button class="btn-primary hdos-confirm-btn" data-id="${job.id}" type="button">
            Konfirmasi &amp; Simpan ke Repository
          </button>
        </div>
      </article>
    `).join("");

    list.querySelectorAll("[data-field]").forEach(field => {
      field.addEventListener("input", () => {
        const job = this.jobs.find(item => item.id === field.dataset.id);
        if (job) job[field.dataset.field] = field.value;
      });
      field.addEventListener("change", () => {
        const job = this.jobs.find(item => item.id === field.dataset.id);
        if (job) job[field.dataset.field] = field.value;
      });
    });

    list.querySelectorAll(".hdos-preview-btn").forEach(button => {
      button.onclick = () => this.preview(button.dataset.id);
    });

    list.querySelectorAll(".hdos-confirm-btn").forEach(button => {
      button.onclick = () => this.confirm(button.dataset.id);
    });

  },

  preview(id) {

    const job = this.jobs.find(item => item.id === id);
    if (!job) return;

    alert([
      "AI Recommendation",
      `File: ${job.name}`,
      `Modul: ${job.module}`,
      `Jenis aset: ${job.assetType}`,
      `Confidence: ${job.confidence}%`,
      "",
      "AI hanya memberi rekomendasi. Simpan membutuhkan konfirmasi user."
    ].join("\n"));

  },

  async confirm(id) {

    const job = this.jobs.find(item => item.id === id);
    if (!job || job.status === "Saving" || job.status === "Saved Locally") return;

    job.status = "Saving";
    this.renderJobs();

    try {

      const now = new Date().toISOString();
      const document = await DocumentStore.save(job.file, {
        company: "CGG",
        title: job.title,
        module: job.module,
        assetType: job.assetType,
        owner: job.owner || "Unassigned",
        revision: job.revision || "1.0",
        status: "pending-sync",
        aiRecommendation: {
          type: job.type,
          confidence: job.confidence,
          suggestedModule: suggestedModule(job.name),
          confirmedByUser: true,
          confirmedAt: now
        },
        digitalVersion: {
          status: "pending-sync",
          generatedAt: now,
          source: "HDOS AI Hybrid",
          parserStatus: job.analysis?.confidenceReview?.status || "Needs Review"
        }
      });

      await DocumentStore.audit("repository_asset_created", document.id, {
        name: job.name,
        module: job.module,
        assetType: job.assetType,
        revision: job.revision || "1.0",
        confirmation: "user"
      });

      let queueStatus = "local-only";

      try {
        await HDOSModule.save({
          module: "repository",
          company: "CGG",
          createdBy: job.owner || "anonymous",
          payload: {
            document_id: document.id,
            original_file: document.originalFile,
            digital_version: document.digitalVersion,
            metadata: {
              title: job.title,
              module: job.module,
              asset_type: job.assetType,
              owner: job.owner || "Unassigned",
              revision: job.revision || "1.0"
            },
            ai_recommendation: document.aiRecommendation,
            repository_status: "pending-sync",
            confirmed_at: now
          }
        });
        queueStatus = "queued";
      } catch (error) {
        await DocumentStore.audit("repository_sync_deferred", document.id, {
          error: error.message
        });
      }

      job.documentId = document.id;
      job.status = queueStatus === "queued" ? "Saved Locally • Queued" : "Saved Locally";
      this.renderJobs();

    } catch (error) {

      console.error("Repository save:", error);
      job.status = "Save Failed";
      this.renderJobs();

    }

  }

};

window.HDOSRepositoryUpload = RepositoryUpload;

})();