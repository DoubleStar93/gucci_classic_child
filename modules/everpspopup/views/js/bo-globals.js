'use strict';

/**
 * BO globals — everpspopup only. Idempotent; never uses var/let for favicon global.
 */
(function (w) {
  if (w.__baEverBoGlobals) {
    return;
  }
  w.__baEverBoGlobals = 1;

  if (typeof w.str2url !== 'function') {
    w.str2url = function (str) {
      if (!str) {
        return '';
      }
      str = String(str).toLowerCase();
      str = str.replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i');
      str = str.replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/ç/g, 'c').replace(/ñ/g, 'n');
      return str.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    };
  }
  if (typeof w.ps_faviconnotificationbo === 'undefined') {
    w.ps_faviconnotificationbo = { initialize: function () {} };
  }
})(window);
