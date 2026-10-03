/* ==========================================
   CGG HDOS IndexedDB Cache
   Master Blueprint v1.0
   Shared Offline Storage
   ========================================== */

(() => {
  "use strict";

  const DB_NAME = "CGG_HDOS_CACHE";
  const DB_VERSION = 1;

  const STORES = [
    "queue",
    "settings",
    "documents",
    "attachments",
    "sync_meta"
  ];

  let dbPromise = null;

  function openDB() {
    if (!("indexedDB" in window)) {
      throw new Error("Browser tidak mendukung IndexedDB.");
    }

    if (dbPromise) {
      return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = event => {
        const database = event.target.result;

        STORES.forEach(storeName => {
          if (!database.objectStoreNames.contains(storeName)) {
            const store = database.createObjectStore(storeName, {
              keyPath: "id"
            });

            if (storeName === "queue") {
              try {
                store.createIndex("status", "status", {
                  unique: false
                });
              } catch (error) {}
              try {
                store.createIndex("module", "module", {
                  unique: false
                });
              } catch (error) {}
            }

            if (storeName === "documents") {
              try {
                store.createIndex("module", "module", {
                  unique: false
                });
              } catch (error) {}
            }

            if (storeName === "settings") {
              try {
                store.createIndex("key", "key", {
                  unique: true
                });
              } catch (error) {}
            }
          }
        });
      };

      request.onsuccess = event => {
        resolve(event.target.result);
      };

      request.onerror = () => {
        reject(new Error("IndexedDB gagal dibuka."));
      };
    });

    return dbPromise;
  }

  function toSerializableValue(value) {
    if (value === undefined) {
      return null;
    }

    if (value instanceof Blob) {
      return {
        __type: "blob",
        data: value
      };
    }

    return value;
  }

  async function setItem(storeName, id, value) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const payload = {
          id,
          value: toSerializableValue(value),
          updatedAt: new Date().toISOString()
        };

        const request = store.put(payload);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(
          request.error || new Error(`Gagal simpan ${storeName}`)
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function getItem(storeName, id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const request = store.get(id);

        request.onsuccess = () => {
          const result = request.result || null;
          resolve(result ? result.value : null);
        };

        request.onerror = () => reject(
          request.error || new Error(`Gagal baca ${storeName}`)
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function removeItem(storeName, id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(
          request.error || new Error(`Gagal hapus ${storeName}`)
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function list(storeName) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const request = store.getAll();

        request.onsuccess = () => {
          const result = request.result || [];
          resolve(result.map(item => item.value ?? item));
        };

        request.onerror = () => reject(
          request.error || new Error(`Gagal list ${storeName}`)
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function clear(storeName) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(
          request.error || new Error(`Gagal clear ${storeName}`)
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function setSettings(key, value) {
    return setItem("settings", key, value);
  }

  async function getSettings(key, fallback = null) {
    const value = await getItem("settings", key);
    return value === null ? fallback : value;
  }

  async function getQueue() {
    return list("queue");
  }

  async function saveQueueItem(item) {
    if (!item || !item.id) {
      throw new Error("Queue item tidak valid.");
    }

    return setItem("queue", item.id, item);
  }

  async function getQueueItem(id) {
    if (!id) return null;
    return getItem("queue", id);
  }

  window.CGGCache = {
    openDB,
    setItem,
    getItem,
    removeItem,
    list,
    clear,
    setSettings,
    getSettings,
    getQueue,
    saveQueueItem,
    getQueueItem
  };

})();
