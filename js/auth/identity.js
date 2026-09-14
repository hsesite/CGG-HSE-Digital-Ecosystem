/* ==========================================
   CGG HDOS Identity Engine
   Build 15.8 Phase 1
   ========================================== */

(() => {
"use strict";

const CONFIG_KEY="IDENTITY_CONFIG";

const DEFAULT_CONFIG={

  provider:"google",

  clientId:null,

  verifyEndpoint:null,

  sessionHours:24

};

/* ==========================
   Save Config
   ========================== */

async function save(config){

  await CGGCache.save(
    CONFIG_KEY,
    {...DEFAULT_CONFIG,...config},
    1
  );

}

/* ==========================
   Load Config
   ========================== */

async function load(){

  const data=await CGGCache.load(CONFIG_KEY);

  return data?.data||DEFAULT_CONFIG;

}

/* ==========================
   Health
   ========================== */

async function health(){

  const cfg=await load();

  return{

    provider:cfg.provider,

    clientIdReady:!!cfg.clientId,

    endpointReady:!!cfg.verifyEndpoint,

    sessionHours:cfg.sessionHours

  };

}

window.CGGIdentity={

  save,
  load,
  health

};

})();
