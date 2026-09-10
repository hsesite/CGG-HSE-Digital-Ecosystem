
/* ==========================================
   CGG HSE API Client v1.0
   ========================================== */

const API_URL = "PASTE_WEB_APP_URL_DISINI";

async function apiGet(action){

  const res = await fetch(`${API_URL}?action=${action}`);

  return await res.json();

}

async function apiPost(action,payload){

  const res = await fetch(API_URL,{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({

      action,

      ...payload

    })

  });

  return await res.json();

}
