/* ==========================================
   CGG HDOS Template Engine
   Master Blueprint v1.0
   Repository-Driven Checklist Templates
   ========================================== */

(() => {
  "use strict";

  const TemplateEngine = {

    build(documentData = {}) {
      const meta = documentData.parsed || documentData.meta || {};
      const title = meta.documentName || documentData.name || "Untitled";

      const category =
        meta.category ||
        (window.HDOSControlEngine
          ? window.HDOSControlEngine.detectCategory(title)
          : "Form");

      const level = window.HDOSControlEngine
        ? window.HDOSControlEngine.detectLevel(title, category)
        : { level: 4, name: "Record/Form" };

      const schema = this.buildSchema(title, meta);

      return {
        id: documentData.id || `TPL-${Date.now()}`,
        documentId: documentData.id || null,
        noForm: meta.documentNumber || "-",
        title,
        category,
        level: level?.level || 4,
        levelName: level?.name || "Record/Form",
        revision: meta.revision || "0.0",
        effectiveDate: meta.effectiveDate || "-",
        module: this.detectModule(category, title),
        inspectionType: this.detectInspectionType(title),
        schema,
        createdAt: new Date().toISOString()
      };
    },

    detectModule(category, title) {
      const text = `${category} ${title}`.toUpperCase();

      if (text.includes("P3K")) return "Inspection";
      if (text.includes("APAR")) return "Inspection";
      if (text.includes("HOUSEKEEPING")) return "Inspection";
      if (text.includes("WORKSHOP")) return "Inspection";
      if (text.includes("FUEL")) return "Inspection";
      if (text.includes("JETTY")) return "Inspection";
      if (text.includes("PTW")) return "Permit To Work";
      if (text.includes("COMMISSIONING")) return "Commissioning";
      if (text.includes("AUDIT")) return "Audit";
      if (text.includes("HAZARD")) return "Hazard";
      if (text.includes("INCIDENT")) return "Incident";

      return "Repository";
    },

    detectInspectionType(title = "") {
      const t = String(title).toUpperCase();

      if (t.includes("P3K")) return "P3K";
      if (t.includes("APAR")) return "APAR";
      if (t.includes("HOUSEKEEPING")) return "Housekeeping";
      if (t.includes("WORKSHOP")) return "Workshop";
      if (t.includes("FUEL")) return "Fuel Station";
      if (t.includes("JETTY")) return "Jetty";
      if (t.includes("SHIPPING")) return "Shipping";

      return "General";
    },

    buildSchema(title = "", meta = {}) {
      const t = String(title).toUpperCase();

      if (t.includes("P3K")) {
        return [
          { key: "p3k_1", label: "Periksa Kasa Steril", required: true },
          { key: "p3k_2", label: "Periksa Perban", required: true },
          { key: "p3k_3", label: "Periksa Gunting", required: true },
          { key: "p3k_4", label: "Periksa Pinset", required: true },
          { key: "p3k_5", label: "Periksa Masker", required: true },
          { key: "p3k_6", label: "Periksa Lampu Senter", required: true }
        ];
      }

      if (t.includes("APAR")) {
        return [
          { key: "apar_1", label: "Tekanan APAR", required: true },
          { key: "apar_2", label: "Segel Utuh", required: true },
          { key: "apar_3", label: "Pin Aman", required: true },
          { key: "apar_4", label: "Label Terbaca", required: true },
          { key: "apar_5", label: "Tabung Tidak Rusak", required: true }
        ];
      }

      if (t.includes("HOUSEKEEPING")) {
        return [
          { key: "hk_1", label: "Area Bersih & Teratur", required: true },
          { key: "hk_2", label: "Saluran Air Tidak Tersumbat", required: true },
          { key: "hk_3", label: "Tempat Sampah Ada", required: true },
          { key: "hk_4", label: "Peralatan Aman Digunakan", required: true }
        ];
      }

      if (t.includes("JETTY")) {
        return [
          { key: "jetty_1", label: "Periksa Kondisi Dermaga", required: true },
          { key: "jetty_2", label: "Periksa Papan Peringatan", required: true },
          { key: "jetty_3", label: "Periksa Akses Jalan", required: true },
          { key: "jetty_4", label: "Periksa Keselamatan Peralatan", required: true }
        ];
      }

      const fallback = Array.isArray(meta?.fields)
        ? meta.fields
        : Array.isArray(meta?.schema)
          ? meta.schema
          : null;

      if (fallback && fallback.length) {
        return fallback.map((field, index) => {
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
              required: field.required !== false
            };
          }

          return {
            key: `item_${index + 1}`,
            label: `Item ${index + 1}`,
            required: true
          };
        });
      }

      return [
        { key: "item_1", label: "Checklist Item", required: true }
      ];
    }
  };

  window.HDOSTemplateEngine = TemplateEngine;

})();
