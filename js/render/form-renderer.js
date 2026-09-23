/* ==========================================
   CGG Dynamic Form Renderer
   Build 23.0
   Renderer Foundation
   ========================================== */

(() => {

"use strict";

window.CGGRenderer = window.CGGRenderer || {};

CGGRenderer.renderField = function(field = {}){

  const safeField = field || {};
  const id = String(safeField.key || `field-${Math.random().toString(36).slice(2)}`);
  const label = `<label for="${id}">${safeField.label || id}${safeField.required ? " *" : ""}</label>`;

  switch(safeField.type){

    case "textarea":
      return `<div class="form-group">${label}<textarea id="${id}" data-key="${id}"></textarea></div>`;

    case "date":
      return `<div class="form-group">${label}<input type="date" id="${id}" data-key="${id}"></div>`;

    case "time":
      return `<div class="form-group">${label}<input type="time" id="${id}" data-key="${id}"></div>`;

    case "checkbox":
      return `<div class="form-group checkbox"><label><input type="checkbox" id="${id}" data-key="${id}">${safeField.label || id}</label></div>`;

    case "image":
      return `<div class="form-group">${label}<input type="file" accept="image/*" id="${id}" data-key="${id}"></div>`;

    case "select":
      return `<div class="form-group">${label}<select id="${id}" data-key="${id}"><option value="">Memuat...</option></select></div>`;

    default:
      return `<div class="form-group">${label}<input type="text" id="${id}" data-key="${id}"></div>`;

  }

};

CGGRenderer.render = function(schema = {}){

  const fields = Array.isArray(schema)
    ? schema
    : Array.isArray(schema.fields)
      ? schema.fields
      : [];

  return fields.map(field => CGGRenderer.renderField(field)).join("");

};

CGGRenderer.mount = function(container, schema = {}){

  if(typeof container === "string"){
    container = document.querySelector(container);
  }

  if(!container){
    throw new Error("Container tidak ditemukan.");
  }

  container.innerHTML = CGGRenderer.render(schema);
  return true;

};

})();
