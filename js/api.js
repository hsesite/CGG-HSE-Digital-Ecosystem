/* ==========================================
   CGG HSE API Client v2.0
   GitHub ↔ Google Apps Script
   ========================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbxI1I0jxW14JY_H4gwqoVYkxdpCY635lm-LAPZVdh0-zwN9vK_yalQSLjAFkiho6Tkp9g/exec";

const API_TIMEOUT = 15000;

/* ---------- GET ---------- */

async function apiGet(action){

    const controller=new AbortController();

    const timer=setTimeout(()=>controller.abort(),API_TIMEOUT);

    try{

        const res=await fetch(`${API_URL}?action=${encodeURIComponent(action)}`,{

            method:"GET",
            mode:"cors",
            redirect:"follow",
            cache:"no-store",
            signal:controller.signal

        });

        clearTimeout(timer);

        if(!res.ok){
            throw new Error(`HTTP ${res.status}`);
        }

        const data=await res.json();

        try{
            localStorage.setItem(
                `api_cache_${action}`,
                JSON.stringify(data)
            );
        }catch(e){}

        return data;

    }catch(err){

        clearTimeout(timer);

        try{

            const cache=localStorage.getItem(`api_cache_${action}`);

            if(cache){
                return JSON.parse(cache);
            }

        }catch(e){}

        throw err;

    }

}

/* ---------- POST ---------- */

async function apiPost(action,payload={}){

    const controller=new AbortController();

    const timer=setTimeout(()=>controller.abort(),API_TIMEOUT);

    try{

        const res=await fetch(API_URL,{

            method:"POST",
            mode:"cors",
            redirect:"follow",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                action,
                ...payload

            }),

            signal:controller.signal

        });

        clearTimeout(timer);

        if(!res.ok){
            throw new Error(`HTTP ${res.status}`);
        }

        return await res.json();

    }catch(err){

        clearTimeout(timer);

        throw err;

    }

}
