/**
 * Fix TinyMCE race: preload tinymce.min.js + themes/modern/theme.min.js + skin CSS
 * BEFORE product_edit.bundle.js runs. Proven: theme must be registered before init.
 */
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";
import { Client } from "basic-ftp";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const shopRoot = process.env.FTP_REMOTE_PATH.trim()
  .replace(/\/+$/, "")
  .replace(/\/themes\/[^/]+$/i, "");
const staging = "https://barbaraalvisi.it";
const stamp = `9.0.3-tm${Date.now().toString(36)}`;

const rescueJs = `/*! barbaraalvisi BO RTE rescue v4 — preload theme then init */
(function () {
  var BASE = "${staging}";
  var TINY = BASE + "/js/tiny_mce";
  var tries = 0;
  var maxTries = 20;
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
        return String(str).toLowerCase()
          .replace(/[^a-z0-9\\s-]/g, "")
          .replace(/[\\s]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
      };
    }
    window.tinyMCEPreInit = { base: TINY, suffix: ".min" };
    var adminDir = window.baseAdminDir || "/l1ka80lkkixgfknd/";
    window.defaultTinyMceConfig = Object.assign({}, window.defaultTinyMceConfig || {}, {
      plugins: "align colorpicker link image table media placeholder lists advlist code autoresize hr",
      external_plugins: { filemanager: adminDir + "filemanager/plugin.min.js" },
      skin: "prestashop",
      theme: "modern",
      language: false,
      menubar: false,
      statusbar: false,
      relative_urls: false,
      convert_urls: false,
      entity_encoding: "raw"
    });
  }

  function loadCss(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]') && src.indexOf("tinymce.min") >= 0 && typeof window.tinyMCE !== "undefined") {
        resolve();
        return;
      }
      // theme may already be registered
      if (src.indexOf("/themes/modern/theme") >= 0 && window.tinyMCE && tinyMCE.ThemeManager && tinyMCE.ThemeManager.get("modern")) {
        resolve();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("fail " + src)); };
      document.head.appendChild(s);
    });
  }

  function areas() {
    return Array.prototype.slice.call(document.querySelectorAll("textarea.autoload_rte, textarea.rte"));
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
    areas().forEach(function (el) { el.classList.remove("bo-rte-fallback"); });
  }

  function ensureStack() {
    ensureGlobals();
    loadCss(TINY + "/skins/prestashop/skin.min.css");
    loadCss(TINY + "/skins/prestashop/content.min.css");
    return loadScript(TINY + "/tinymce.min.js?" + Date.now().toString(36).slice(-4))
      .catch(function () { return loadScript(TINY + "/tinymce.min.js"); })
      .then(function () {
        // CRITICAL: theme must be present before init (ScriptLoader race on this host)
        return loadScript(TINY + "/themes/modern/theme.min.js");
      });
  }

  function initNow() {
    var list = areas();
    if (!list.length) return;
    if (healthy()) { ok = true; hideFallback(); return; }

    // remove broken instances
    try { if (window.tinyMCE) tinyMCE.remove(); } catch (e) {}
    document.querySelectorAll(".mce-tinymce").forEach(function (n) {
      try { n.parentNode.removeChild(n); } catch (e) {}
    });

    list.forEach(function (el, i) {
      if (!el.id) el.id = "bo_rte_" + i;
    });
    var ids = list.map(function (el) { return el.id; }).join(",");
    log("init", ids, "theme=", !!(tinyMCE.ThemeManager && tinyMCE.ThemeManager.get("modern")));

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
      }
    });
  }

  function tick() {
    if (ok && healthy()) return;
    tries++;
    ensureGlobals();

    if (healthy()) { ok = true; hideFallback(); return; }
    if (!areas().length) {
      if (tries < maxTries) setTimeout(tick, 400);
      return;
    }

    // let native PS try briefly
    if (tries < 3) {
      showFallback();
      setTimeout(tick, 500);
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
            if (tries < maxTries) setTimeout(tick, 900);
          } else {
            ok = true;
            hideFallback();
          }
        }, 1000);
      })
      .catch(function (e) {
        busy = false;
        log("stack error", e && e.message);
        showFallback();
      });
  }

  ensureGlobals();
  // Preload stack ASAP (even before textareas exist)
  ensureStack().then(function () { log("stack preloaded, theme=", !!(tinyMCE.ThemeManager && tinyMCE.ThemeManager.get("modern"))); }).catch(function () {});

  function start() { setTimeout(tick, 200); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  window.addEventListener("load", function () { setTimeout(tick, 600); });
})();
`;

const rescueCss = `textarea.autoload_rte.bo-rte-fallback,
textarea.rte.bo-rte-fallback {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 180px !important;
  width: 100% !important;
  pointer-events: auto !important;
  background: #fff !important;
  color: #222 !important;
  border: 1px solid #999 !important;
  padding: 10px !important;
  font: 14px/1.45 Consolas, Monaco, monospace !important;
  box-sizing: border-box !important;
}
`;

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "rte-v4");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

const jsLocal = path.join(tmp, "bo-rte-rescue-v4.js");
const cssLocal = path.join(tmp, "bo-rte-rescue-v4.css");
await fs.writeFile(jsLocal, rescueJs, "utf8");
await fs.writeFile(cssLocal, rescueCss, "utf8");
await client.uploadFrom(jsLocal, `${shopRoot}/js/admin/bo-rte-rescue-v4.js`);
await client.uploadFrom(cssLocal, `${shopRoot}/js/admin/bo-rte-rescue-v4.css`);

// Patch core_javascript: preload tinymce+theme+skin early, point rescue to v4
const coreRemote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
const coreLocal = path.join(tmp, "core.twig");
await client.downloadTo(coreLocal, coreRemote);
let core = await fs.readFile(coreLocal, "utf8");

const preload = `
<link rel="stylesheet" href="${staging}/js/tiny_mce/skins/prestashop/skin.min.css?${stamp}">
<link rel="stylesheet" href="${staging}/js/tiny_mce/skins/prestashop/content.min.css?${stamp}">
<script>
  window.PS_ALLOW_ACCENTED_CHARS_URL = window.PS_ALLOW_ACCENTED_CHARS_URL || false;
  window.tinyMCEPreInit = { base: '${staging}/js/tiny_mce', suffix: '.min' };
  if (typeof window.str2url !== 'function') {
    window.str2url = function (str) {
      if (!str) return '';
      return String(str).toLowerCase().replace(/[^a-z0-9\\s-]/g,'').replace(/[\\s]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
    };
  }
  window.defaultTinyMceConfig = Object.assign({}, window.defaultTinyMceConfig || {}, {
    plugins: 'align colorpicker link image table media placeholder lists advlist code autoresize hr',
    external_plugins: { filemanager: (window.baseAdminDir || '/l1ka80lkkixgfknd/') + 'filemanager/plugin.min.js' },
    skin: 'prestashop',
    theme: 'modern',
    language: false,
    menubar: false,
    statusbar: false,
    relative_urls: false,
    convert_urls: false,
    entity_encoding: 'raw'
  });
</script>
<script src="${staging}/js/tiny_mce/tinymce.min.js?${stamp}"></script>
<script src="${staging}/js/tiny_mce/themes/modern/theme.min.js?${stamp}"></script>
<link rel="stylesheet" href="${staging}/js/admin/bo-rte-rescue-v4.css?${stamp}">
`;

// Replace existing early bootstrap block if present
if (core.includes("tinyMCEPreInit")) {
  core = core.replace(
    /<script>\s*window\.PS_ALLOW_ACCENTED_CHARS_URL[\s\S]*?bo-rte-rescue[^>]*>/,
    preload.trim() + "\n"
  );
  // fallback if regex failed
  if (!core.includes("themes/modern/theme.min.js")) {
    core = core.replace(
      /<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>/,
      `<script src="{{ asset('themes/new-theme/public/main.bundle.js') }}"></script>\n${preload}`
    );
  }
} else {
  core = core.replace(
    /<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>/,
    `<script src="{{ asset('themes/new-theme/public/main.bundle.js') }}"></script>\n${preload}`
  );
}

// Ensure tinymce+theme preload exists
if (!core.includes("themes/modern/theme.min.js")) {
  core = core.replace(
    /<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>/,
    `<script src="{{ asset('themes/new-theme/public/main.bundle.js') }}"></script>\n${preload}`
  );
}

// Point rescue script to v4 only (remove old rescue refs duplicates carefully)
core = core.replace(/bo-rte-rescue(?:-v3)?\.(js|css)\?[^"'\s]*/g, `bo-rte-rescue-v4.$1?${stamp}`);
if (!core.includes("bo-rte-rescue-v4.js")) {
  core += `\n<script src="${staging}/js/admin/bo-rte-rescue-v4.js?${stamp}"></script>\n`;
}

// Keep absolute admin.js
core = core
  .replace(/admin\.js\?[^"'\s]+/g, `admin.js?${stamp}`)
  .replace(/tools\.js\?[^"'\s]+/g, `tools.js?${stamp}`);

await fs.writeFile(coreLocal, core, "utf8");
await client.uploadFrom(coreLocal, coreRemote);

const cfgLocal = path.join(tmp, "cfg.yml");
await client.downloadTo(cfgLocal, `${shopRoot}/app/config/config.yml`);
let yml = await fs.readFile(cfgLocal, "utf8");
yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, `${shopRoot}/app/config/config.yml`);

try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-tm-${Date.now().toString(36)}`
  );
  try {
    await client.send(`MKD ${shopRoot}/var/cache/prod`);
  } catch {}
} catch (e) {
  console.log("cache", e.message);
}

await client.uploadFrom(
  "tmp-remote/clean-stash-fast.php",
  `${shopRoot}/clean-stash-fast.php`
);

console.log("DONE", stamp);
console.log("has theme preload", core.includes("themes/modern/theme.min.js"));
console.log("has rescue v4", core.includes("bo-rte-rescue-v4.js"));
client.close();
