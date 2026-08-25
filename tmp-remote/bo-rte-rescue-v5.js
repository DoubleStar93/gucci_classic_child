/*! barbaraalvisi BO RTE rescue v5 — load TinyMCE theme via fetch+eval (script-src race/cache) */
(function () {
  var BASE = "https://barbaraalvisi.it";
  var TINY = BASE + "/js/tiny_mce";
  var stamp = "v5";
  var tries = 0;
  var maxTries = 25;
  var busy = false;
  var ok = false;

  function log() {
    if (window.console && console.info) {
      console.info.apply(console, ["[bo-rte-rescue]"].concat([].slice.call(arguments)));
    }
  }

  function ensureGlobals() {
    window.PS_ALLOW_ACCENTED_CHARS_URL = window.PS_ALLOW_ACCENTED_CHARS_URL || false;
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
    window.tinyMCEPreInit = { base: TINY, suffix: ".min" };
    var adminDir = window.baseAdminDir || "/l1ka80lkkixgfknd/";
    window.defaultTinyMceConfig = Object.assign({}, window.defaultTinyMceConfig || {}, {
      plugins:
        "align colorpicker link image table media placeholder lists advlist code autoresize hr",
      external_plugins: { filemanager: adminDir + "filemanager/plugin.min.js" },
      skin: "prestashop",
      theme: "modern",
      language: false,
      menubar: false,
      statusbar: false,
      relative_urls: false,
      convert_urls: false,
      entity_encoding: "raw",
    });
  }

  function loadCss(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  function fetchEval(url) {
    return fetch(url, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
      return r.text();
    }).then(function (t) {
      var trimmed = (t || "").trim();
      if (!trimmed || trimmed.charAt(0) === "<") {
        throw new Error("Not JS: " + url);
      }
      // eslint-disable-next-line no-eval
      (0, eval)(t);
    });
  }

  function loadScriptTag(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("script " + src)); };
      document.head.appendChild(s);
    });
  }

  function hasTheme() {
    try {
      return !!(window.tinyMCE && tinyMCE.ThemeManager && tinyMCE.ThemeManager.get("modern"));
    } catch (e) {
      return false;
    }
  }

  function ensureStack() {
    ensureGlobals();
    loadCss(TINY + "/skins/prestashop/skin.min.css");
    loadCss(TINY + "/skins/prestashop/content.min.css");

    var p = Promise.resolve();
    if (typeof window.tinyMCE === "undefined") {
      // Prefer script tag for core, fallback fetch+eval
      p = loadScriptTag(TINY + "/tinymce.min.js?" + stamp).catch(function () {
        return fetchEval(TINY + "/tinymce.min.js?" + stamp);
      });
    }

    return p.then(function () {
      if (hasTheme()) return;
      // CRITICAL FIX: on this host <script src=theme> often does not register ThemeManager.
      // fetch+eval reliably registers theme "modern".
      return fetchEval(TINY + "/themes/modern/theme.min.js?" + stamp).then(function () {
        if (!hasTheme()) throw new Error("theme still missing after eval");
        log("theme modern registered via fetch+eval");
      });
    });
  }

  function areas() {
    return Array.prototype.slice.call(
      document.querySelectorAll("textarea.autoload_rte, textarea.rte")
    );
  }

  function healthy() {
    return document.querySelectorAll(".mce-tinymce iframe").length > 0;
  }

  function showFallback() {
    areas().forEach(function (el) {
      el.classList.add("bo-rte-fallback");
      el.style.display = "block";
      el.style.minHeight = "180px";
      el.readOnly = false;
      el.removeAttribute("disabled");
    });
  }

  function hideFallback() {
    areas().forEach(function (el) {
      el.classList.remove("bo-rte-fallback");
    });
  }

  function initNow() {
    var list = areas();
    if (!list.length) return;
    if (healthy()) {
      ok = true;
      hideFallback();
      return;
    }

    try {
      if (window.tinyMCE) tinyMCE.remove();
    } catch (e) {}
    document.querySelectorAll(".mce-tinymce").forEach(function (n) {
      try {
        n.parentNode.removeChild(n);
      } catch (e) {}
    });

    list.forEach(function (el, i) {
      if (!el.id) el.id = "bo_rte_" + i;
    });
    var ids = list
      .map(function (el) {
        return el.id;
      })
      .join(",");

    log("init", ids, "theme=", hasTheme());

    tinyMCE.init({
      mode: "exact",
      elements: ids,
      theme: "modern",
      skin: "prestashop",
      plugins: "lists link code table autoresize",
      toolbar: "bold italic underline | bullist numlist | link | code | undo redo",
      menubar: false,
      statusbar: false,
      height: 280,
      relative_urls: false,
      convert_urls: false,
      entity_encoding: "raw",
      init_instance_callback: function (ed) {
        ok = true;
        log("OK", ed.id);
        hideFallback();
      },
    });
  }

  function tick() {
    if (ok && healthy()) return;
    tries++;
    ensureGlobals();

    if (healthy()) {
      ok = true;
      hideFallback();
      return;
    }
    if (!areas().length) {
      if (tries < maxTries) setTimeout(tick, 400);
      return;
    }

    if (tries < 2) {
      showFallback();
      setTimeout(tick, 400);
      return;
    }

    if (busy) {
      if (tries < maxTries) setTimeout(tick, 400);
      return;
    }

    busy = true;
    ensureStack()
      .then(function () {
        initNow();
        setTimeout(function () {
          busy = false;
          if (!healthy()) {
            showFallback();
            if (tries < maxTries) setTimeout(tick, 800);
          } else {
            ok = true;
            hideFallback();
          }
        }, 900);
      })
      .catch(function (e) {
        busy = false;
        log("error", e && e.message);
        showFallback();
        if (tries < maxTries) setTimeout(tick, 1000);
      });
  }

  ensureGlobals();
  // Preload ASAP
  ensureStack()
    .then(function () {
      log("stack ready theme=", hasTheme());
    })
    .catch(function (e) {
      log("preload fail", e && e.message);
    });

  function start() {
    setTimeout(tick, 200);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  window.addEventListener("load", function () {
    setTimeout(tick, 500);
  });
})();
