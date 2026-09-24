/* ==========================================
   CGG HDOS Repository
   Master Blueprint v1.0
   Document Gateway
   ========================================== */

(() => {
  "use strict";

  const Repository = {

    async save(job) {
      if (!window.DocumentStore) {
        throw new Error("DocumentStore belum dimuat.");
      }

      if (!job || typeof job !== "object") {
        throw new Error("Job dokumen tidak valid.");
      }

      const document = window.HDOSControlEngine?.build
        ? window.HDOSControlEngine.build(job)
        : {
            id: job.id || `DOC-${Date.now()}`,
            title: job.name || "Dokumen",
            noForm: job.noForm || "-",
            category: job.category || "general",
            module: job.module || "repository",
            payload: job.payload || job
          };

      if (window.HDOSTemplateEngine) {
        const template = window.HDOSTemplateEngine.build({
          name: job.name || document.title,
          parsed: job.parsed || job.meta || {},
          id: document.id,
          meta: job.meta || {}
        });

        document.template = template;
        document.module = template.module || document.module || "repository";
        document.inspectionType = template.inspectionType || document.inspectionType || "General";
      }

      await window.DocumentStore.save(document);

      await window.DocumentStore.audit(
        "document.saved",
        document.id,
        {
          title: document.title,
          noForm: document.noForm,
          category: document.category,
          module: document.module
        }
      );

      window.dispatchEvent(
        new CustomEvent("hdos:repository-updated", {
          detail: document
        })
      );

      return document;
    },

    async list(category = null) {
      if (!window.DocumentStore) {
        throw new Error("DocumentStore belum dimuat.");
      }

      const docs = await window.DocumentStore.list();

      if (!category) {
        return docs;
      }

      return docs.filter(doc => doc.category === category);
    },

    async listTemplates(module) {
      const docs = await this.list();

      return docs.filter(doc =>
        doc.template &&
        (
          doc.template.module === module ||
          doc.module === module ||
          doc.template.module === "Inspection" ||
          doc.module === "inspection"
        )
      );
    },

    async get(id) {
      if (!window.DocumentStore) {
        throw new Error("DocumentStore belum dimuat.");
      }

      return window.DocumentStore.get(id);
    },

    async update(id, patch) {
      if (!window.DocumentStore) {
        throw new Error("DocumentStore belum dimuat.");
      }

      const doc = await window.DocumentStore.update(id, patch);

      await window.DocumentStore.audit(
        "document.updated",
        id,
        patch
      );

      window.dispatchEvent(
        new CustomEvent("hdos:repository-updated", {
          detail: doc
        })
      );

      return doc;
    },

    async remove(id) {
      if (!window.DocumentStore) {
        throw new Error("DocumentStore belum dimuat.");
      }

      await window.DocumentStore.remove(id);

      await window.DocumentStore.audit(
        "document.deleted",
        id,
        {}
      );

      window.dispatchEvent(
        new CustomEvent("hdos:repository-updated", {
          detail: { id }
        })
      );
    }
  };

  window.HDOSRepository = Repository;

})();
