/* ==========================================
   CGG Dynamic Form Renderer
   Build 23.0
   Renderer Foundation
   ========================================== */

(() => {

"use strict";

window.CGGRenderer={};

CGGRenderer.renderField=function(field){

  const id=field.key;

  const label=`<label for="${id}">${field.label}${field.required?" *":""}</label>`;

  switch(field.type){

    case "textarea":

      return `
      <div class="form-group">
        ${label}
        <textarea id="${id}" data-key="${id}"></textarea>
      </div>`;

    case "date":

      return `
      <div class="form-group">
        ${label}
        <input type="date" id="${id}" data-key="${id}">
      </div>`;

    case "time":

      return `
      <div class="form-group">
        ${label}
        <input type="time" id="${id}" data-key="${id}">
      </div>`;

    case "checkbox":

      return `
      <div class="form-group checkbox">
        <label>
          <input type="checkbox" id="${id}" data-key="${id}">
          ${field.label}
        </label>
      </div>`;

    case "image":

      return `
      <div class="form-group">
        ${label}
        <input type="file" accept="image/*" id="${id}" data-key="${id}">
      </div>`;

    case "select":

      return `
      <div class="form-group">
        ${label}
        <select id="${id}" data-key="${id}">
          <option value="">Memuat...</option>
        </select>
      </div>`;

    default:

      return `
      <div class="form-group">
        ${label}
        <input type="text" id="${id}" data-key="${id}">
      </div>`;

  }

};

CGGRenderer.render=function(schema){

  return schema.fields
    .map(CGGRenderer.renderField)
    .join("");

};

})();
