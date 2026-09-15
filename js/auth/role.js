
/* ==========================================
   CGG HDOS Role Engine
   Build 15.7 Production
   C-009 Session Passport
   C-010 Dual Session
   ========================================== */

(() => {
"use strict";

const SESSION_KEY="CGG_SESSION";

/* ==========================================
   Scope Resolver
   ========================================== */

function resolveScope(role,company,parent){

  switch(role){

    case "Admin":
      return ["CGG","SLS","VIP","SUBCON"];

    case "CGG":
      return ["CGG","SLS","VIP","SUBCON"];

    case "Contractor":
      return [company,"SUBCON_"+company];

    case "Subcon":
      return [company];

    default:
      return [];

  }

}

/* ==========================================
   Save Session
   ========================================== */

async function saveSession(passport){

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(passport)
  );

  await CGGCache.save(
    SESSION_KEY,
    passport,
    1
  );

}

/* ==========================================
   Create Passport
   ========================================== */

async function create(user){

  const passport={

    email:user.email,

    role:user.role,

    company:user.company,

    parent:user.parent,

    scope:resolveScope(
      user.role,
      user.company,
      user.parent
    ),

    issuedAt:new Date().toISOString(),

    expires:new Date(
      Date.now()+24*60*60*1000
    ).toISOString()

  };

  await saveSession(passport);

  return passport;

}

/* ==========================================
   Restore Session
   ========================================== */

async function restore(){

  const local=localStorage.getItem(SESSION_KEY);

  if(local){

    const passport=JSON.parse(local);

    if(new Date(passport.expires)>new Date()){

      return passport;

    }

  }

  const cache=await CGGCache.load(SESSION_KEY);

  if(cache?.data){

    const passport=cache.data;

    if(new Date(passport.expires)>new Date()){

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(passport)
      );

      return passport;

    }

  }

  return null;

}

/* ==========================================
   Current Session
   ========================================== */

async function current(){

  return await restore();

}

/* ==========================================
   Permission Checker
   ========================================== */

async function canView(company){

  const passport=await current();

  if(!passport) return true; // belum login = jangan blok sidebar

  return passport.scope.includes(company)
      || passport.scope.includes("SUBCON");

}

async function isAdmin(){

  const passport=await current();

  return passport?.role==="Admin";

}

/* ==========================================
   Logout
   ========================================== */

async function logout(){

  localStorage.removeItem(SESSION_KEY);

  await CGGCache.remove(SESSION_KEY);

}

/* ==========================================
   Health
   ========================================== */

async function health(){

  const passport=await current();

  return{

    loggedIn:!!passport,

    email:passport?.email||null,

    role:passport?.role||null,

    company:passport?.company||null,

    scope:passport?.scope||[]

  };

}

/* ==========================================
   Public API
   ========================================== */

window.CGGRole={

  create,
  current,
  restore,
  canView,
  isAdmin,
  logout,
  health

};

})();
