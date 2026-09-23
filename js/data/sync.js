/* ==========================================
   CGG HDOS Sync Engine
   Master Blueprint v1.0
   Offline Queue → Apps Script → Sheets
   ========================================== */

(() => {
  "use strict";

  const MAX_RETRY = 5;
  const RETRY_DELAY = 3000;
  const REQUEST_TIMEOUT = 15000;

  let processing = false;
  let started = false;
  let timer = null;
  let onlineHandler = null;

  function errorMessage(error) {
    return error?.message || String(error);
  }

  function createTimeoutSignal() {
    const controller = new AbortController();

    const timeout = window.setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);

    return {
      signal: controller.signal,
      clear: () => window.clearTimeout(timeout)
    };
  }

  async function send(item) {
    if (!item?.id || !item.module) {
      throw new Error("Queue item tidak valid.");
    }

    const endpoint = window.CGGConfig?.endpoint;

    if (!endpoint) {
      throw new Error("Endpoint HDOS belum dikonfigurasi.");
    }

    const payload = {
      action: item.module,
      module: item.module,
      queue_id: item.id,
      tenant: item.tenant || "CGG",
      company: item.company || "CGG",
      createdBy: item.createdBy || "anonymous",
      createdAt: item.createdAt || new Date().toISOString(),
      payload: item.payload || {}
    };

    const request = createTimeoutSignal();

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        mode: "cors",
        redirect: "follow",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: request.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (!result || result.success !== true) {
        throw new Error(
          result?.message || "Server menolak sinkronisasi."
        );
      }

      return result;

    } finally {
      request.clear();
    }
  }

  async function markProcessing(item) {
    return window.CGGQueue.update({
      ...item,
      status: "processing",
      processingAt: new Date().toISOString(),
      lastError: null
    });
  }

  async function markSent(item, result) {
    return window.CGGQueue.update({
      ...item,
      status: "sent",
      serverId: result?.id || result?.serverId || null,
      syncedAt: new Date().toISOString(),
      processingAt: null,
      lastError: null
    });
  }

  async function markFailed(item, error) {
    const retry = Number.isFinite(Number(item.retry))
      ? Number(item.retry) + 1
      : 1;

    const status = retry >= MAX_RETRY
      ? "failed"
      : "pending";

    return window.CGGQueue.update({
      ...item,
      retry,
      status,
      processingAt: null,
      lastError: errorMessage(error),
      lastAttemptAt: new Date().toISOString()
    });
  }

  async function processQueue() {
    if (processing) {
      return {
        online: navigator.onLine,
        processed: 0,
        busy: true
      };
    }

    if (!navigator.onLine) {
      return {
        online: false,
        processed: 0
      };
    }

    if (!window.CGGQueue?.pending || !window.CGGQueue?.update) {
      return {
        online: true,
        processed: 0,
        error: "Queue engine belum siap."
      };
    }

    processing = true;

    try {
      const items = await window.CGGQueue.pending();
      let processed = 0;
      let failed = 0;

      for (const item of items) {
        if (!navigator.onLine) {
          break;
        }

        try {
          await markProcessing(item);

          const result = await send(item);

          await markSent(item, result);

          processed++;

          window.dispatchEvent(
            new CustomEvent("hdos:queue-item-synced", {
              detail: {
                item,
                result
              }
            })
          );

          console.log("✓ Synced:", item.module, item.id);

        } catch (error) {
          failed++;

          try {
            await markFailed(item, error);
          } catch (updateError) {
            console.error(
              "Queue status update failed:",
              updateError
            );
          }

          window.dispatchEvent(
            new CustomEvent("hdos:queue-item-failed", {
              detail: {
                item,
                error
              }
            })
          );

          console.warn(
            "Sync retry:",
            item.id,
            errorMessage(error)
          );
        }
      }

      window.dispatchEvent(
        new CustomEvent("hdos:queue-processed", {
          detail: {
            processed,
            failed,
            online: navigator.onLine
          }
        })
      );

      return {
        online: navigator.onLine,
        processed,
        failed
      };

    } finally {
      processing = false;
    }
  }

  function start() {
    if (started) {
      return timer;
    }

    started = true;

    onlineHandler = () => {
      processQueue().catch(error => {
        console.warn("Online sync failed:", errorMessage(error));
      });
    };

    window.addEventListener("online", onlineHandler);

    timer = window.setInterval(() => {
      processQueue().catch(error => {
        console.warn("Periodic sync failed:", errorMessage(error));
      });
    }, RETRY_DELAY);

    processQueue().catch(error => {
      console.warn("Initial sync failed:", errorMessage(error));
    });

    return timer;
  }

  function stop() {
    if (!started) {
      return;
    }

    started = false;

    if (onlineHandler) {
      window.removeEventListener("online", onlineHandler);
      onlineHandler = null;
    }

    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  window.CGGSync = {
    send,
    processQueue,
    start,
    stop
  };

})();
