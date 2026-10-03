/* ==========================================
   CGG HDOS Universal Queue Engine
   Master Blueprint v1.0
   Offline First • Transactional Queue
   ========================================== */

(() => {
  "use strict";

  const PRIORITY = {
    incident: 1,
    hazard: 2,
    ptw: 3,
    inspection: 4,
    finding: 5,
    pica: 6,
    audit: 7,
    repository: 8,
    default: 9
  };

  const PROCESSING_TIMEOUT = 5 * 60 * 1000;

  function generateId() {
    return [
      "Q",
      Date.now(),
      Math.random().toString(36).slice(2, 8)
    ].join("-");
  }

  function getPriority(module) {
    return PRIORITY[module] || PRIORITY.default;
  }

  function normalizeRetry(value) {
    const retry = Number(value);
    return Number.isFinite(retry) && retry >= 0
      ? retry
      : 0;
  }

  function isStaleProcessing(item) {
    if (item?.status !== "processing") {
      return false;
    }

    const startedAt = Date.parse(item.processingAt || "");
    if (!Number.isFinite(startedAt)) {
      return true;
    }

    return Date.now() - startedAt >= PROCESSING_TIMEOUT;
  }

  async function getDatabase() {
    if (!window.CGGCache?.openDB) {
      throw new Error("CGGCache belum tersedia.");
    }

    return window.CGGCache.openDB();
  }

  async function add({
    module,
    tenant = "CGG",
    company = "CGG",
    createdBy = "anonymous",
    payload = {},
    id = null
  } = {}) {
    if (!module) {
      throw new Error("Module queue wajib diisi.");
    }

    if (!payload || typeof payload !== "object") {
      throw new Error("Payload queue tidak valid.");
    }

    const database = await getDatabase();
    const now = new Date().toISOString();

    const item = {
      id: id || generateId(),
      module,
      tenant,
      company,
      createdBy,
      createdAt: now,
      updatedAt: now,
      status: "pending",
      retry: 0,
      priority: getPriority(module),
      payload
    };

    return new Promise((resolve, reject) => {
      let transaction;

      try {
        transaction = database.transaction("queue", "readwrite");

        transaction.objectStore("queue").add(item);

        transaction.oncomplete = () => resolve(item);
        transaction.onerror = () => reject(
          transaction.error || new Error("Queue gagal disimpan.")
        );
        transaction.onabort = () => reject(
          transaction.error || new Error("Transaksi queue dibatalkan.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function pending() {
    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      let request;

      try {
        const transaction = database.transaction(
          "queue",
          "readonly"
        );

        const store = transaction.objectStore("queue");
        request = store.getAll();

        request.onsuccess = () => {
          const now = new Date().toISOString();

          const items = (request.result || [])
            .filter(item => {
              if (item.status === "pending") {
                return true;
              }

              // Item processing yang tertinggal karena browser crash
              // dikembalikan ke antrean setelah timeout.
              if (isStaleProcessing(item)) {
                item.status = "pending";
                item.processingAt = null;
                item.updatedAt = now;
                return true;
              }

              return false;
            })
            .sort((a, b) => {
              const priorityA = Number.isFinite(Number(a.priority))
                ? Number(a.priority)
                : PRIORITY.default;

              const priorityB = Number.isFinite(Number(b.priority))
                ? Number(b.priority)
                : PRIORITY.default;

              if (priorityA !== priorityB) {
                return priorityA - priorityB;
              }

              return String(a.createdAt || "")
                .localeCompare(String(b.createdAt || ""));
            });

          resolve(items);
        };

        request.onerror = () => reject(
          request.error || new Error("Queue pending gagal dibaca.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function update(item) {
    if (!item?.id) {
      throw new Error("Queue item tidak memiliki ID.");
    }

    const database = await getDatabase();

    const updated = {
      ...item,
      retry: normalizeRetry(item.retry),
      updatedAt: new Date().toISOString()
    };

    if (updated.status === "processing" && !updated.processingAt) {
      updated.processingAt = updated.updatedAt;
    }

    if (updated.status !== "processing") {
      updated.processingAt = null;
    }

    return new Promise((resolve, reject) => {
      let transaction;

      try {
        transaction = database.transaction("queue", "readwrite");
        transaction.objectStore("queue").put(updated);

        transaction.oncomplete = () => resolve(updated);
        transaction.onerror = () => reject(
          transaction.error || new Error("Queue gagal diperbarui.")
        );
        transaction.onabort = () => reject(
          transaction.error || new Error("Update queue dibatalkan.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function get(id) {
    if (!id) return null;

    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = database.transaction(
          "queue",
          "readonly"
        );

        const request = transaction
          .objectStore("queue")
          .get(id);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => reject(
          request.error || new Error("Queue item gagal dibaca.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function count() {
    const items = await pending();
    return items.length;
  }

  async function countByStatus(status) {
    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = database.transaction(
          "queue",
          "readonly"
        );

        const store = transaction.objectStore("queue");
        const index = store.index("status");
        const request = index.count(status);

        request.onsuccess = () => resolve(request.result || 0);
        request.onerror = () => reject(
          request.error || new Error("Jumlah queue gagal dibaca.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function remove(id) {
    if (!id) {
      throw new Error("Queue ID wajib diisi.");
    }

    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      try {
        const transaction = database.transaction(
          "queue",
          "readwrite"
        );

        transaction.objectStore("queue").delete(id);

        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(
          transaction.error || new Error("Queue gagal dihapus.")
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  window.CGGQueue = {
    add,
    pending,
    update,
    get,
    count,
    countByStatus,
    remove
  };

})();
