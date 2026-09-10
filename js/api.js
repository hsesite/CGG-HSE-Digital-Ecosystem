
/* ==========================================
   CGG HSE API Client v1.0
   ========================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbxI1I0jxW14JY_H4gwqoVYkxdpCY635lm-LAPZVdh0-zwN9vK_yalQSLjAFkiho6Tkp9g/exec";

async function apiGet(action) {
  const res = await fetch(`${API_URL}?action=${action}`);
  return await res.json();
}

async function apiPost(action, payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action,
      ...payload
    })
  });

  return await res.json();
}
