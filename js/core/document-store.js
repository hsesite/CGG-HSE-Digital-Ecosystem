/* ==========================================
   CGG HDOS Document Store
   Master Blueprint v1.0
   IndexedDB Document Repository
   ========================================== */

(() => {
  "use strict";

  const STORE_NAME = "documents";
  const AUDIT_STORE = "audit_log";

  function fallbackDB() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("Browser tidak mendukung IndexedDB."));
        return;
      }

      const request = indexedDB.open("CGG_HDOS_DOCUMENTS", 1);

      request.onupgradeneeded = event => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains(AUDIT_STORE)) {
          const auditStore = db.createObjectStore(AUDIT_STORE, {
            keyPath: "id",
            autoIncrement: true
          });

          auditStore.createIndex("entityId", "entityId", { unique: false });
          auditStore.createIndex("action", "action", { unique: false });
        }
      };

      request.onsuccess = event => resolve(event.target.result);
      request.onerror = () => reject(new Error("Document store gagal dibuka."));
    });
  }

  async function getDatabase() {
    if (window.CGGCache?.openDB) {
      const db = await window.CGGCache.openDB();

      return new Promise((resolve, reject) => {
        try {
          const tx = db.transaction("documents", "readonly");
          const store = tx.objectStore("documents");

          const request = store.getAll();

          request.onsuccess = () => {
            // trigger fallback check by resolving current DB
            resolve(db);
          };

          request.onerror = () => reject(
            request.error || new Error("Document DB tidak dapat diakses.")
          );
        } catch (error) {
          reject(error);
        }
      });
    }

    return fallbackDB();
  }

  async function ensureStores(database) {
    if (!database || !database.objectStoreNames) {
      return;
    }

    if (!database.objectStoreNames.contains(STORE_NAME)) {
      const tx = database.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME);
    }

    if (!database.objectStoreNames.contains(AUDIT_STORE)) {
      const tx = database.transaction(AUDIT_STORE, "readwrite");
      tx.objectStore(AUDIT_STORE);
    }
  }

  async function save(document) {
    if (!document || !document.id) {
      throw new Error("Dokumen tidak valid.");
    }

    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const payload = {
          ...document,
          updatedAt: new Date().toISOString(),
          createdAt: document.createdAt || new Date().toISOString()
        };

        const request = store.put(payload);

        request.onsuccess = () => resolve(payload);
        request.onerror = () => reject(
          request.error || new Error("Dokumen gagal disimpan.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function list() {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = () => {
          const result = (request.result || [])
            .slice()
            .sort((a, b) => {
              const aTime = Date.parse(a.updatedAt || a.createdAt || 0);
              const bTime = Date.parse(b.updatedAt || b.createdAt || 0);
              return bTime - aTime;
            });

          resolve(result);
        };

        request.onerror = () => reject(
          request.error || new Error("Daftar dokumen gagal dibaca.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function get(id) {
    if (!id) return null;

    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);

        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => reject(
          request.error || new Error("Dokumen gagal dibaca.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function update(id, patch = {}) {
    if (!id) {
      throw new Error("ID dokumen wajib diisi.");
    }

    const existing = await get(id);

    if (!existing) {
      throw new Error("Dokumen tidak ditemukan.");
    }

    const db = await getDatabase();

    const payload = {
      ...existing,
      ...patch,
      id,
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const request = store.put(payload);

        request.onsuccess = () => resolve(payload);
        request.onerror = () => reject(
          request.error || new Error("Dokumen gagal diperbarui.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function remove(id) {
    if (!id) {
      throw new Error("ID dokumen wajib diisi.");
    }

    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(
          request.error || new Error("Dokumen gagal dihapus.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function audit(action, entityId, payload = {}) {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(AUDIT_STORE, "readwrite");
        const store = transaction.objectStore(AUDIT_STORE);

        const entry = {
          id: crypto.randomUUID ? crypto.randomUUID() : `audit-${Date.now()}`,
          action,
          entityId,
          payload,
          createdAt: new Date().toISOString()
        };

        const request = store.add(entry);

        request.onsuccess = () => resolve(entry);
        request.onerror = () => reject(
          request.error || new Error("Audit trail gagal dibuat.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function auditList(entityId = null) {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(AUDIT_STORE, "readonly");
        const store = transaction.objectStore(AUDIT_STORE);

        const request = store.getAll();

        request.onsuccess = () => {
          const entries = request.result || [];

          const filtered = entityId
            ? entries.filter(item => String(item.entityId) === String(entityId))
            : entries;

          resolve(filtered
            .slice()
            .sort((a, b) => {
              const aTime = Date.parse(a.createdAt || 0);
              const bTime = Date.parse(b.createdAt || 0);
              return bTime - aTime;
            })
          );
        };

        request.onerror = () => reject(
          request.error || new Error("Audit list gagal dibaca.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  window.DocumentStore = {
    save,
    list,
    get,
    update,
    remove,
    audit,
    auditList
  };

})();
