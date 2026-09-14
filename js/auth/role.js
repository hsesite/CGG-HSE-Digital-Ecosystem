
/* ==========================================
   CGG HDOS Role Engine
   Build 15.7 Phase 1
   Session Passport
   ========================================== */

(() => {
"use strict";

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
   Create Passport
   ========================================== */

function create(user){

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

  localStorage.setItem(
    "CGG_SESSION",
    JSON.stringify(passport)
  );

  return passport;

}

/* ==========================================
   Read Passport
   ========================================== */

function current(){

  const raw=localStorage.getItem("CGG_SESSION");

  if(!raw) return null;

  const passport=JSON.parse(raw);

  if(new Date(passport.expires)<new Date()){

    logout();

    return null;

  }

  return passport;

}

/* ==========================================
   Permission Checker
   ========================================== */

function canView(company){

  const passport=current();

  if(!passport) return false;

  return passport.scope.includes(company)
      || passport.scope.includes("SUBCON");

}

function isAdmin(){

  return current()?.role==="Admin";

}

/* ==========================================
   Logout
   ========================================== */

function logout(){

  localStorage.removeItem("CGG_SESSION");

}

/* ==========================================
   Public API
   ========================================== */

window.CGGRole={

  create,
  current,
  canView,
  isAdmin,
  logout

};

})();
