/* ==========================================
   CGG HDOS Inspection Module
   Blueprint v1.0
   Dynamic Inspection Workflow
   Offline First • Queue Ready • Audit Ready
   ========================================== */

(() => {
  "use strict";

  const Inspection = {

    currentTemplate: null,
    currentRuntime: null,

    async render() {
      const view = document.getElementById("router-view");
      if (!view) return;

      view.innerHTML = `
        <div class="glass-card section-card fade-in">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
            <div>
              <h2 style="margin:0;">Inspection</h2>
              <p class="muted" style="margin:6px 0 0;">
                Checklist dinamis berdasarkan template Repository
              </p>
            </div>

            <button id="inspection-submit-btn" class="btn btn-primary">
              Simpan Inspection
            </button>
          </div>

          <div id="inspection-runtime-root" style="margin-top:20px;"></div>
        </div>
      `;

      const root = document.getElementById("inspection-runtime-root");
      if (!root) return;

      if (window.HDOSInspectionRuntime?.renderSelector) {
        await window.HDOSInspectionRuntime.renderSelector(root);
        this.currentRuntime = window.HDOSInspectionRuntime;
      } else {
        root.innerHTML = `
          <div class="glass-card">
            <p class="muted">
              Runtime inspeksi belum tersedia.
            </p>
          </div>
        `;
      }

      this.bindSubmit();
    },

    bindSubmit() {
      const btn = document.getElementById("inspection-submit-btn");
      if (!btn) return;

      btn.onclick = async () => {
        await this.submit();
      };
    },

    async submit() {
      const runtime = window.HDOSInspectionRuntime;
      if (!runtime) {
        throw new Error("HDOSInspectionRuntime belum dimuat.");
      }

      const collected = runtime.collect({
        inspector:
          document.querySelector("#inspector")?.value ||
          "anonymous",
        unit:
          document.querySelector("#unit")?.value ||
          null,
        area:
          document.querySelector("#area")?.value ||
          null
      });

      const validation = runtime.validate(collected);

      if (!validation.valid) {
        this.showErrors(validation.errors);
        return;
      }

      this.currentTemplate = runtime.currentTemplate;

      const payload = {
        module: "inspection",
        title:
          this.currentTemplate?.title ||
          "Inspection",
        inspectionType:
          this.currentTemplate?.inspectionType ||
          "Inspection",
        noForm:
          this.currentTemplate?.noForm ||
          null,
        templateId:
          this.currentTemplate?.id ||
          null,
        checklist: collected.checklist,
        evidence: collected.evidence,
        createdAt: new Date().toISOString(),
        createdBy:
          document.querySelector("#inspector")?.value ||
          "anonymous"
      };

      try {
        const result = await HDOSModule.save({
          module: "inspection",
          payload
        });

        this.showSuccess(
          `Inspection berhasil disimpan: ${payload.title}`
        );

        window.dispatchEvent(
          new CustomEvent("hdos:inspection-saved", {
            detail: result
          })
        );

        return result;

      } catch (error) {
        console.error("Inspection save failed:", error);

        this.showErrors([
          error.message || "Gagal menyimpan inspection."
        ]);

        throw error;
      }
    },

    showErrors(errors = []) {
      const list = Array.isArray(errors) ? errors : [errors];

      const target = document.getElementById("inspection-error-box");
      if (!target) {
        const box = document.createElement("div");
        box.id = "inspection-error-box";
        box.className = "glass-card";
        box.style.marginTop = "12px";
        box.style.border = "1px solid rgba(255,110,110,0.7)";
        box.style.padding = "12px 16px";
        box.style.color = "#ffd6d6";
        box.style.background = "rgba(120,20,20,0.18)";

        const host = document.getElementById("inspection-runtime-root");
        if (host) host.appendChild(box);

        const wrapper = box;
        wrapper.innerHTML = `
          <strong>Validasi gagal:</strong>
          <ul style="margin:8px 0 0 16px;">
            ${list.map(item => `<li>${String(item)}</li>`).join("")}
          </ul>
        `;
        return;
      }

      target.innerHTML = `
        <strong>Validasi gagal:</strong>
        <ul style="margin:8px 0 0 16px;">
          ${list.map(item => `<li>${String(item)}</li>`).join("")}
        </ul>
      `;
    },

    clearErrors() {
      const target = document.getElementById("inspection-error-box");
      if (!target) return;
      target.remove();
    },

    showSuccess(message) {
      this.clearErrors();

      const target = document.getElementById("inspection-success-box");
      if (!target) {
        const box = document.createElement("div");
        box.id = "inspection-success-box";
        box.className = "glass-card";
        box.style.marginTop = "12px";
        box.style.padding = "12px 16px";
        box.style.border = "1px solid rgba(75,205,125,0.7)";
        box.style.background = "rgba(24,110,75,0.15)";
        box.style.color = "#dfffe8";

        const host = document.getElementById("inspection-runtime-root");
        if (host) host.appendChild(box);

        const wrapper = box;
        wrapper.innerHTML = `<strong>Berhasil:</strong> ${String(message)}`;
        return;
      }

      target.innerHTML = `<strong>Berhasil:</strong> ${String(message)}`;
    }
  };

  window.Inspection = Inspection;

})();