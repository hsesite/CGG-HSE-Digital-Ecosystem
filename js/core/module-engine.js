/* ==========================================
   CGG HDOS Module Engine
   Milestone 1 • Shared Module Contract
   ======================================== */

(() => {
"use strict";

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;

function toBase64(buffer) {

  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);

}

async function serializeAttachment(file) {

  if (!file || !file.name) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("Lampiran harus berupa gambar.");
  }

  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error("Ukuran foto maksimal 2 MB.");
  }

  const buffer = await file.arrayBuffer();

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    data: `data:${file.type};base64,${toBase64(buffer)}`
  };

}

async function save({
  module,
  payload,
  tenant = "CGG",
  company = payload?.company || "CGG",
  createdBy = payload?.reporter || payload?.inspector || "anonymous"
}) {

  if (!module) throw new Error("Module wajib diisi.");
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload module tidak valid.");
  }

  if (!window.CGGQueue?.add) {
    throw new Error("Queue engine belum siap.");
  }

  const item = await CGGQueue.add({
    module,
    tenant,
    company,
    createdBy,
    payload
  });

  let sync = {
    online: navigator.onLine,
    processed: 0
  };

  if (navigator.onLine && window.CGGSync?.processQueue) {

    try {

      sync = await CGGSync.processQueue();

    } catch (error) {

      sync = {
        online: true,
        processed: 0,
        error: error.message || "Sync tertunda."
      };

    }

  }

  window.dispatchEvent(new CustomEvent("hdos:queue-updated", {
    detail: { module, item, sync }
  }));

  return { item, sync };

}

window.HDOSModule = {
  save,
  serializeAttachment
};

})();
