/*! barbaraalvisi BO RTE rescue v3 — TinyMCE 4.9 minimal init */
(function () {
  var BASE = "https://barbaraalvisi.it";
  var TINY_BASE = BASE + "/js/tiny_mce";
  var tries = 0;
  var maxTries = 30;
  var booting = false;
  var succeeded = false;

  function log() {
    if (window.console && console.info) {
      console.info.apply(console, ["[bo-rte-rescue]"].concat([].slice.call(arguments)));
    }
  }

  function ensureGlobals() {
    if (typeof window.PS_ALLOW_ACCENTED_CHARS_URL === "undefined") {
      window.PS_ALLOW_ACCENTED_CHARS_URL = false;
    }
    if (typeof window.str2url !== "function") {
      window.str2url = function (str) {
        if (!str) return "";
        return String(str)
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/[\s]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
      };
    }
    window.tinyMCEPreInit = { base: TINY_BASE, suffix: ".min" };

    // Override native PS TinyMCE config (no local filemanager plugin — 403)
    var adminDir = window.baseAdminDir || "/l1ka80lkkixgfknd/";
    window.defaultTinyMceConfig = {
      plugins: "align colorpicker link image table media placeholder lists advlist code autoresize hr",
      external_plugins: {
        filemanager: adminDir + "filemanager/plugin.min.js",
      },
      skin: "prestashop",
      menubar: false,
      statusbar: false,
      relative_urls: false,
      convert_urls: false,
      entity_encoding: "raw",
      language: window.iso_user || "it",
    };
  }

  function areas() {
    return Array.prototype.slice.call(
      document.querySelectorAll("textarea.autoload_rte, textarea.rte")
    );
  }

  function healthyCount() {
    var n = 0;
    document.querySelectorAll(".mce-tinymce").forEach(function (shell) {
      if (shell.querySelector("iframe")) n++;
    });
    return n;
  }

  function showRawFallback() {
    areas().forEach(function (el) {
      el.classList.add("bo-rte-fallback");
      el.style.display = "block";
      el.style.minHeight = "180px";
      el.style.width = "100%";
      el.removeAttribute("aria-hidden");
      el.removeAttribute("disabled");
      el.readOnly = false;
    });
  }

  function hideRawWhenHealthy() {
    if (!healthyCount()) return;
    areas().forEach(function (el) {
      el.classList.remove("bo-rte-fallback");
    });
  }

  function destroyAllEditors() {
    try {
      if (typeof window.tinyMCE === "undefined") return;
      if (tinyMCE.remove) {
        // TinyMCE 4: remove all
        try {
          tinyMCE.remove();
        } catch (e) {}
      }
      if (tinyMCE.editors) {
        var eds = [];
        for (var i = 0; i < tinyMCE.editors.length; i++) eds.push(tinyMCE.editors[i]);
        eds.forEach(function (ed) {
          try {
            ed.remove();
          } catch (e) {}
        });
      }
    } catch (e) {}
    document.querySelectorAll(".mce-tinymce, .mce-widget, .mce-tooltip").forEach(function (n) {
      try {
        n.parentNode && n.parentNode.removeChild(n);
      } catch (e) {}
    });
  }

  function loadTiny(cb) {
    if (typeof window.tinyMCE !== "undefined") {
      cb();
      return;
    }
    ensureGlobals();
    var s = document.createElement("script");
    s.src = TINY_BASE + "/tinymce.min.js?v=3";
    s.onload = function () {
      log("tinymce loaded");
      cb();
    };
    s.onerror = function () {
      log("tinymce LOAD FAILED");
      booting = false;
      showRawFallback();
    };
    document.head.appendChild(s);
  }

  function initEditors() {
    ensureGlobals();
    var list = areas();
    if (!list.length) {
      log("no textareas");
      return;
    }

    destroyAllEditors();
    showRawFallback();

    // Prefer id-based init — more reliable than selector after PS mangling
    var ids = list
      .map(function (el, idx) {
        if (!el.id) el.id = "bo_rte_auto_" + idx;
        return el.id;
      })
      .join(",");

    log("init ids", ids);

    var adminDir = window.baseAdminDir || "/l1ka80lkkixgfknd/";
    try {
      window.tinyMCE.init({
        mode: "exact",
        elements: ids,
        theme: "modern",
        skin: "prestashop",
        plugins: "lists link code table autoresize",
        toolbar: "bold italic underline | bullist numlist | link | code | undo redo",
        menubar: false,
        statusbar: false,
        branding: false,
        relative_urls: false,
        convert_urls: false,
        entity_encoding: "raw",
        height: 280,
        resize: true,
        external_plugins: {
          filemanager: adminDir + "filemanager/plugin.min.js",
        },
        setup: function (ed) {
          ed.on("init", function () {
            succeeded = true;
            log("editor OK", ed.id);
            hideRawWhenHealthy();
          });
        },
      });
    } catch (err) {
      log("init threw", err);
      showRawFallback();
    }
  }

  function tick() {
    if (succeeded && healthyCount() > 0) {
      hideRawWhenHealthy();
      return;
    }
    ensureGlobals();
    tries++;

    if (healthyCount() > 0) {
      succeeded = true;
      hideRawWhenHealthy();
      log("already healthy", healthyCount());
      return;
    }

    if (!areas().length) {
      if (tries < maxTries) setTimeout(tick, 400);
      return;
    }

    // Give native PS TinyMCEEditor a moment on first tries
    if (tries < 4) {
      showRawFallback();
      setTimeout(tick, 500);
      return;
    }

    if (booting) {
      if (tries < maxTries) setTimeout(tick, 400);
      return;
    }

    booting = true;
    loadTiny(function () {
      initEditors();
      booting = false;
      setTimeout(function () {
        if (healthyCount() === 0) {
          log("still no iframe — keeping HTML textarea editable");
          showRawFallback();
          if (tries < maxTries) setTimeout(tick, 1000);
        } else {
          succeeded = true;
          hideRawWhenHealthy();
        }
      }, 1200);
    });
  }

  ensureGlobals();
  function start() {
    setTimeout(tick, 300);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  window.addEventListener("load", function () {
    setTimeout(tick, 800);
  });
})();
