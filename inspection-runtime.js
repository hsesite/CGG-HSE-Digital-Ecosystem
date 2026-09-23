/* ==========================================
   CGG HDOS Inspection Runtime
   Master Blueprint v1.0
   Repository-Driven Dynamic Checklist
   Offline First • Human Approval • Audit Ready
   ========================================== */

(() => {

  "use strict";

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeSchema(template) {
    const rawSchema = template?.template?.schema;

    const fields = Array.isArray(rawSchema)
      ? rawSchema
      : Array.isArray(rawSchema?.fields)
        ? rawSchema.fields
        : [];

    return fields
      .map((field, index) => {
        if (typeof field === "string") {
          return {
            key: `item_${index + 1}`,
            label: field,
            required: true
          };
        }

        if (field && typeof field === "object") {
          return {
            key: field.key || `item_${index + 1}`,
            label: field.label || field.name || `Item ${index + 1}`,
            required: field.required !== false,
            type: field.type || "checklist"
          };
        }

        return {
          key: `item_${index + 1}`,
          label: `Item ${index + 1}`,
          required: true,
          type: "checklist"
        };
      })
      .filter(field => field.label);
  }

  function getChecklistRoot(runtime) {
    return runtime.container?.querySelector(
      ".hdos-runtime-checklist"
    ) || document.querySelector(
      ".hdos-runtime-checklist"
    );
  }

  const Runtime = {

    container: null,
    currentTemplate: null,
    templates: [],
    photos: [],

    /* ==========================================
       Render Selector
       ========================================== */

    async renderSelector(container) {

      if (!container) {
        throw new Error(
          "Container form inspeksi tidak ditemukan."
        );
      }

      if (!window.HDOSRepository?.listTemplates) {
        throw new Error(
          "HDOSRepository belum dimuat."
        );
      }

      this.container = container;
      this.currentTemplate = null;
      this.photos = [];

      const result =
        await window.HDOSRepository.listTemplates("Inspection");

      this.templates = Array.isArray(result)
        ? result
        : [];

      container.innerHTML = `
        <div class="form-group">
          <label for="hdos-template-select">
            Jenis Pemeriksaan
          </label>

          <select id="hdos-template-select">
            <option value="">
              -- Pilih Pemeriksaan --
            </option>

            ${this.templates.map(template => `
              <option value="${escapeHtml(template?.id)}">
                ${escapeHtml(
                  template?.inspectionType ||
                  template?.title ||
                  "Template Inspeksi"
                )}
                -
                ${escapeHtml(template?.title || "Tanpa Judul")}
              </option>
            `).join("")}
          </select>
        </div>

        <div
          id="hdos-template-render"
          aria-live="polite">
        </div>
      `;

      const select = container.querySelector(
        "#hdos-template-select"
      );

      if (select) {
        select.addEventListener("change", () => {
          this.load(select.value, this.templates);
        });
      }

      if (!this.templates.length) {
        const target = container.querySelector(
          "#hdos-template-render"
        );

        if (target) {
          target.innerHTML = `
            <p class="muted">
              Belum ada template inspeksi yang dikonfirmasi
              di Repository.
            </p>
          `;
        }
      }

    },

    /* ==========================================
       Load Selected Template
       ========================================== */

    load(id, templates = []) {

      const list = Array.isArray(templates)
        ? templates
        : [];

      const selected = list.find(template =>
        String(template?.id || "") === String(id)
      );

      this.currentTemplate = selected || null;
      this.photos = [];

      const box = this.container?.querySelector(
        "#hdos-template-render"
      ) || document.querySelector(
        "#hdos-template-render"
      );

      if (!box) {
        return;
      }

      if (!selected) {
        box.innerHTML = "";
        return;
      }

      box.innerHTML = `
        <div
          class="glass-card"
          style="margin-top:18px;padding:18px;">

          <div
            style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:12px;
              flex-wrap:wrap;">

            <div>
              <h3 style="margin:0;">
                ${escapeHtml(selected.title || "Inspeksi")}
              </h3>

              <div
                style="
                  font-size:13px;
                  color:#8aa2bf;
                  margin-top:5px;">

                No Form:
                ${escapeHtml(selected.noForm || "-")}
              </div>
            </div>

            <span class="badge badge-info">
              ${escapeHtml(
                selected.inspectionType || "Inspection"
              )}
            </span>
          </div>

          <hr class="section-divider">

          <div class="runtime-photo-notice">
            <strong>Ketentuan inspeksi</strong>
            <p class="muted">
              Setiap item checklist wajib dijawab dan
              dilengkapi foto sebagai evidence.
            </p>
          </div>

          <div class="hdos-runtime-checklist"></div>
        </div>
      `;

      this.renderChecklist(
        selected,
        box.querySelector(".hdos-runtime-checklist")
      );

    },

    /* ==========================================
       Render Dynamic Checklist
       ========================================== */

    renderChecklist(template, target = null) {

      const list = target || getChecklistRoot(this);

      if (!list) {
        return;
      }

      const schema = normalizeSchema(template);

      if (!schema.length) {
        list.innerHTML = `
          <p class="muted">
            Checklist belum tersedia pada template Repository ini.
          </p>
        `;
        return;
      }

      list.innerHTML = schema.map((item, index) => `
        <div
          class="glass-card runtime-checklist-item"
          data-index="${index}"
          data-key="${escapeHtml(item.key)}"
          style="margin-bottom:14px;padding:16px;">

          <div style="font-weight:600;">
            ${index + 1}.
            ${escapeHtml(item.label)}
            ${item.required ? '<span aria-hidden="true"> *</span>' : ""}
          </div>

          <div
            style="
              display:flex;
              gap:18px;
              margin-top:12px;
              flex-wrap:wrap;">

            <label>
              <input
                type="radio"
                name="runtime-answer-${index}"
                value="Ya"
                data-role="answer">
              Ya
            </label>

            <label>
              <input
                type="radio"
                name="runtime-answer-${index}"
                value="Tidak"
                data-role="answer">
              Tidak
            </label>
          </div>

          <textarea
            class="runtime-note"
            data-index="${index}"
            placeholder="Catatan..."
            style="
              width:100%;
              min-height:70px;
              margin-top:12px;"></textarea>

          <label
            style="
              display:block;
              margin-top:12px;
              font-size:13px;">

            Foto Evidence
            <span aria-hidden="true"> *</span>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              class="runtime-photo"
              data-index="${index}"
              data-required="true"
              style="
                display:block;
                width:100%;
                margin-top:8px;">
          </label>

          <div
            class="runtime-photo-status"
            data-index="${index}"
            style="
              margin-top:6px;
              font-size:12px;
              color:#8aa2bf;">
            Foto belum dipilih.
          </div>
        </div>
      `).join("");

      list.querySelectorAll(".runtime-photo").forEach(input => {
        input.addEventListener("change", event => {
          const file = event.target.files?.[0] || null;
          const index = event.target.dataset.index;

          const status = list.querySelector(
            `.runtime-photo-status[data-index="${index}"]`
          );

          if (status) {
            status.textContent = file
              ? `Foto dipilih: ${file.name}`
              : "Foto belum dipilih.";
          }
        });
      });

    },

    /* ==========================================
       Collect Inspection Checklist
       ========================================== */

    collect(context = {}) {

      const checklist = [];
      const root = getChecklistRoot(this);

      if (root) {
        root.querySelectorAll(
          ".runtime-checklist-item"
        ).forEach((card, index) => {

          const answer = card.querySelector(
            `input[name="runtime-answer-${index}"]:checked`
          )?.value || "";

          const note = card.querySelector(
            ".runtime-note"
          )?.value || "";

          const photoInput = card.querySelector(
            ".runtime-photo"
          );

          const photo = photoInput?.files?.[0] || null;

          checklist.push({
            no: index + 1,
            key: card.dataset.key || `item_${index + 1}`,
            answer,
            note,
            photo,
            photoName: photo?.name || null,
            capturedAt: photo
              ? new Date().toISOString()
              : null
          });
        });
      }

      this.photos = checklist
        .filter(item => item.photo)
        .map(item => item.photo);

      return {
        template: this.currentTemplate?.id || null,

        templateTitle:
          this.currentTemplate?.title || null,

        checklist,

        photos: this.photos,

        evidence: checklist
          .filter(item => item.photo)
          .map(item => ({
            itemNo: item.no,
            fileName: item.photoName,
            capturedAt: item.capturedAt,

            // Metadata tambahan dapat diisi oleh modul inspeksi
            // ketika GPS dan identitas user sudah tersedia.
            inspector:
              context.inspector ||
              document.querySelector("#inspector")?.value ||
              null,

            unit:
              context.unit ||
              document.querySelector("#unit")?.value ||
              null,

            area:
              context.area ||
              document.querySelector("#area")?.value ||
              null,

            latitude: context.latitude ?? null,
            longitude: context.longitude ?? null
          }))
      };
    },

    /* ==========================================
       Validate Before Submit
       ========================================== */

    validate(data = null) {

      const collected = data || this.collect();
      const errors = [];

      if (!collected.template) {
        errors.push(
          "Jenis pemeriksaan wajib dipilih."
        );
      }

      collected.checklist.forEach(item => {

        if (!item.answer) {
          errors.push(
            `Item ${item.no} belum dijawab.`
          );
        }

        if (!item.photo) {
          errors.push(
            `Foto item ${item.no} wajib dilampirkan.`
          );
        }
      });

      return {
        valid: errors.length === 0,
        errors,
        data: collected
      };
    }

  };

  window.HDOSInspectionRuntime = Runtime;

})();