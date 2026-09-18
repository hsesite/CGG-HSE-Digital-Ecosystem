/* ==========================================
   CGG HDOS Hazard Module
   Milestone 1 • Offline First
   ========================================== */

(() => {
"use strict";

const Hazard = {

  render() {

    const view = document.getElementById("router-view");
    if (!view) return;

    const today = new Date().toISOString().slice(0, 10);

    view.innerHTML = `
      <div class="glass-card section-card fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">Hazard Report</h2>
            <p class="muted">Data disimpan di perangkat dan disinkronkan otomatis saat online.</p>
          </div>
          <span class="badge badge-info">Offline First</span>
        </div>

        <form id="hdos-hazard-form" class="inspection-form" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label for="hazard-date">Tanggal *</label>
              <input id="hazard-date" name="date" type="date" value="${today}" required>
            </div>

            <div class="form-group">
              <label for="hazard-company">Company *</label>
              <input id="hazard-company" name="company" type="text" value="CGG" required>
            </div>

            <div class="form-group">
              <label for="hazard-site">Site *</label>
              <input id="hazard-site" name="site" type="text" required>
            </div>

            <div class="form-group">
              <label for="hazard-area">Area *</label>
              <input id="hazard-area" name="area" type="text" required>
            </div>

            <div class="form-group">
              <label for="hazard-reporter">Reporter</label>
              <input id="hazard-reporter" name="reporter" type="text" autocomplete="name">
            </div>

            <div class="form-group">
              <label for="hazard-category">Kategori Bahaya</label>
              <input id="hazard-category" name="category" type="text">
            </div>

            <div class="form-group">
              <label for="hazard-risk">Risk Level</label>
              <select id="hazard-risk" name="risk_level">
                <option value="">Pilih risk level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div class="form-group">
              <label for="hazard-photo">Foto</label>
              <input id="hazard-photo" name="photo" type="file" accept="image/*" capture="environment">
            </div>

            <div class="form-group full">
              <label for="hazard-description">Deskripsi *</label>
              <textarea id="hazard-description" name="description" rows="5" required></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button id="hazard-save" class="btn btn-primary" type="submit">
              Simpan Hazard
            </button>
            <span id="hazard-status" class="form-status" role="status" aria-live="polite"></span>
          </div>
        </form>
      </div>
    `;

    const form = view.querySelector("#hdos-hazard-form");
    const status = view.querySelector("#hazard-status");
    const saveButton = view.querySelector("#hazard-save");

    form.addEventListener("submit", async event => {

      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      saveButton.disabled = true;
      status.textContent = "Menyimpan ke perangkat...";

      try {

        const data = new FormData(form);
        const photoFile = data.get("photo");
        const photo = await HDOSModule.serializeAttachment(photoFile);

        const payload = {
          hazard_id: `HZ-${Date.now()}`,
          date: data.get("date"),
          company: data.get("company").trim(),
          site: data.get("site").trim(),
          area: data.get("area").trim(),
          reporter: data.get("reporter").trim(),
          category: data.get("category").trim(),
          description: data.get("description").trim(),
          risk_level: data.get("risk_level"),
          photo,
          status: "Open",
          created_at: new Date().toISOString()
        };

        const result = await HDOSModule.save({
          module: "hazard",
          payload,
          company: payload.company,
          createdBy: payload.reporter || "anonymous"
        });

        if (result.sync.processed > 0) {
          status.textContent = "Hazard tersimpan dan tersinkron.";
        } else {
          status.textContent = `Hazard tersimpan offline (${result.item.id}).`;
        }

        form.reset();
        view.querySelector("#hazard-date").value = today;
        view.querySelector("#hazard-company").value = payload.company;

      } catch (error) {

        console.error("Hazard save:", error);
        status.textContent = error.message || "Hazard gagal disimpan.";

      } finally {

        saveButton.disabled = false;

      }

    });

  }

};

window.Hazard = Hazard;

})();