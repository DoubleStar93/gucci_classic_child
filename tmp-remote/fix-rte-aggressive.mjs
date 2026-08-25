/**
 * Aggressive BO RTE fix:
 * - CSS fallback so textareas stay visible/editable if TinyMCE fails
 * - Stronger rescue: unhide stuck textareas, remove broken editors, re-init minimal TinyMCE
 * - Define PS_ALLOW_ACCENTED_CHARS_URL + tinyMCEPreInit early
 * - Bust cache + clear Symfony prod cache
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
const staging = (process.env.STAGING_URL || "https://barbaraalvisi.it/")
  .trim()
  .replace(/\/+$/, "");
const stamp = `9.0.3-rte${Date.now().toString(36)}`;

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "rte-aggressive");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

async function putText(remote, contents) {
  const local = path.join(tmp, remote.replace(/[\\/]/g, "_").slice(-80));
  await fs.writeFile(local, contents, "utf8");
  await client.uploadFrom(local, remote);
}

const rescueCss = `/* Force product description fields usable even if TinyMCE fails mid-init */
textarea.autoload_rte,
textarea.rte {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 180px !important;
  width: 100% !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 2 !important;
  background: #fff !important;
  color: #000 !important;
  border: 1px solid #bbb !important;
  padding: 8px !important;
}
/* If TinyMCE left a broken shell without iframe, don't block clicks forever */
.mce-tinymce:not(:has(iframe)) {
  display: none !important;
}
`;

const rescueJs = `/*! barbaraalvisi BO RTE rescue v2 */
(function () {
  var BASE = ${JSON.stringify(staging)};
  var TINY_BASE = BASE + '/js/tiny_mce';
  var tries = 0;
  var maxTries = 20;
  var booting = false;

  function log() {
    if (window.console && console.info) {
      console.info.apply(console, ['[bo-rte-rescue]'].concat([].slice.call(arguments)));
    }
  }

  function ensureGlobals() {
    if (typeof window.PS_ALLOW_ACCENTED_CHARS_URL === 'undefined') {
      window.PS_ALLOW_ACCENTED_CHARS_URL = false;
    }
    if (typeof window.str2url !== 'function') {
      if (typeof str2url === 'function') {
        window.str2url = str2url;
      } else {
        window.str2url = function (str) {
          if (!str) return '';
          return String(str)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\\u0300-\\u036f]/g, '')
            .replace(/[^a-z0-9\\s-]/g, '')
            .replace(/[\\s]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        };
      }
    }
    window.tinyMCEPreInit = window.tinyMCEPreInit || {
      base: TINY_BASE,
      suffix: '.min'
    };
  }

  function areas() {
    return document.querySelectorAll('textarea.autoload_rte, textarea.rte');
  }

  function unhideAreas() {
    areas().forEach(function (el) {
      el.style.setProperty('display', 'block', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('min-height', '180px', 'important');
      el.removeAttribute('disabled');
      el.readOnly = false;
    });
  }

  function healthyEditorExists() {
    var shells = document.querySelectorAll('.mce-tinymce');
    for (var i = 0; i < shells.length; i++) {
      if (shells[i].querySelector('iframe')) return true;
    }
    return false;
  }

  function destroyBrokenEditors() {
    if (typeof window.tinyMCE === 'undefined' || !tinyMCE.editors) return;
    try {
      var list = tinyMCE.editors.slice ? tinyMCE.editors.slice() : [];
      // tinyMCE.editors may be array-like
      if (!list.length && tinyMCE.editors.length) {
        for (var i = 0; i < tinyMCE.editors.length; i++) list.push(tinyMCE.editors[i]);
      }
      list.forEach(function (ed) {
        try {
          if (!ed) return;
          var iframeOk = ed.iframeElement || (ed.getContainer && ed.getContainer() && ed.getContainer().querySelector('iframe'));
          if (!iframeOk) {
            ed.remove();
          }
        } catch (e) {}
      });
    } catch (e) {}
    // Remove empty mce shells
    document.querySelectorAll('.mce-tinymce').forEach(function (shell) {
      if (!shell.querySelector('iframe')) shell.remove();
    });
  }

  function loadTiny(cb) {
    if (typeof window.tinyMCE !== 'undefined') {
      cb();
      return;
    }
    ensureGlobals();
    var existing = document.querySelector('script[data-bo-rte-tinymce]');
    if (existing) {
      existing.addEventListener('load', cb);
      return;
    }
    var s = document.createElement('script');
    s.src = TINY_BASE + '/tinymce.min.js';
    s.async = false;
    s.setAttribute('data-bo-rte-tinymce', '1');
    s.onload = function () { cb(); };
    s.onerror = function () { log('tinymce.min.js failed to load'); booting = false; };
    document.head.appendChild(s);
  }

  function initEditors() {
    ensureGlobals();
    unhideAreas();
    destroyBrokenEditors();
    if (!areas().length) {
      log('no textarea.autoload_rte yet');
      return;
    }
    if (healthyEditorExists()) {
      log('healthy TinyMCE already present');
      return;
    }

    var baseAdmin =
      typeof window.baseAdminDir !== 'undefined' && window.baseAdminDir
        ? window.baseAdminDir
        : '/l1ka80lkkixgfknd/';

    log('init TinyMCE on', areas().length, 'textareas');
    try {
      window.tinyMCE.init({
        selector: 'textarea.autoload_rte, textarea.rte',
        // Minimal plugins — avoid filemanager/skin quirks that abort init
        plugins: 'lists link code table autoresize',
        toolbar:
          'bold italic underline | bullist numlist | link | code | undo redo',
        menubar: false,
        statusbar: false,
        branding: false,
        relative_urls: false,
        convert_urls: false,
        entity_encoding: 'raw',
        height: 280,
        min_height: 200,
        resize: true,
        skin: 'prestashop',
        skin_url: TINY_BASE + '/skins/prestashop',
        theme_url: TINY_BASE + '/themes/modern/theme.min.js',
        language: false,
        setup: function (ed) {
          ed.on('init', function () {
            log('editor ready', ed.id);
            unhideAreas();
          });
        },
        init_instance_callback: function () {
          unhideAreas();
        }
      });
    } catch (e) {
      log('init error', e);
      unhideAreas();
    }
  }

  function tick() {
    ensureGlobals();
    unhideAreas();
    tries += 1;
    if (healthyEditorExists()) {
      log('ok after', tries, 'tries');
      return;
    }
    if (!areas().length) {
      if (tries < maxTries) setTimeout(tick, 500);
      return;
    }
    if (booting) {
      if (tries < maxTries) setTimeout(tick, 500);
      return;
    }
    booting = true;
    loadTiny(function () {
      initEditors();
      booting = false;
      // Verify shortly after
      setTimeout(function () {
        if (!healthyEditorExists()) {
          log('init produced no iframe — keeping raw textareas visible');
          unhideAreas();
          destroyBrokenEditors();
        }
      }, 800);
      if (tries < maxTries && !healthyEditorExists()) setTimeout(tick, 1000);
    });
  }

  ensureGlobals();
  // Run ASAP and keep retrying — product form JS may hide textareas mid-flight
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(tick, 300);
    });
  } else {
    setTimeout(tick, 300);
  }
  window.addEventListener('load', function () {
    setTimeout(tick, 600);
  });
})();
`;

await putText(`${shopRoot}/js/admin/bo-rte-rescue.css`, rescueCss);
await putText(`${shopRoot}/js/admin/bo-rte-rescue.js`, rescueJs);
console.log("uploaded rescue css/js", stamp);

// Patch core_javascript: early preinit + css + updated rescue url
const coreRemote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
const coreLocal = path.join(tmp, "core_javascript.html.twig");
await client.downloadTo(coreLocal, coreRemote);
let core = await fs.readFile(coreLocal, "utf8");

const early = `<script>
  window.PS_ALLOW_ACCENTED_CHARS_URL = window.PS_ALLOW_ACCENTED_CHARS_URL || false;
  window.tinyMCEPreInit = { base: '${staging}/js/tiny_mce', suffix: '.min' };
  if (typeof window.str2url !== 'function') {
    window.str2url = function (str) {
      if (!str) return '';
      return String(str).toLowerCase()
        .replace(/[^a-z0-9\\s-]/g, '')
        .replace(/[\\s]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };
  }
</script>
<link rel="stylesheet" href="${staging}/js/admin/bo-rte-rescue.css?${stamp}">
`;

// Ensure early block right after main.bundle
if (!core.includes("tinyMCEPreInit")) {
  core = core.replace(
    /<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>/,
    `<script src="{{ asset('themes/new-theme/public/main.bundle.js') }}"></script>\n${early}`
  );
} else {
  // refresh stamp on rescue assets
  core = core.replace(/bo-rte-rescue\.(js|css)\?[^"'\s]+/g, `bo-rte-rescue.$1?${stamp}`);
  if (!core.includes("bo-rte-rescue.css")) {
    core = core.replace(
      /(<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>)/,
      `$1\n${early}`
    );
  }
}

// Make sure absolute admin.js still present with new stamp
core = core.replace(/admin\.js\?[^"'\s]+/g, `admin.js?${stamp}`);
core = core.replace(/tools\.js\?[^"'\s]+/g, `tools.js?${stamp}`);
core = core.replace(/jquery\.fancybox\.js\?[^"'\s]+/g, `jquery.fancybox.js?${stamp}`);
core = core.replace(/jquery\.chosen\.js\?[^"'\s]+/g, `jquery.chosen.js?${stamp}`);
core = core.replace(/bo-rte-rescue\.js\?[^"'\s]+/g, `bo-rte-rescue.js?${stamp}`);

if (!core.includes("bo-rte-rescue.js")) {
  core = core.trimEnd() + `\n<script src="${staging}/js/admin/bo-rte-rescue.js?${stamp}"></script>\n`;
}
if (!core.includes("bo-rte-rescue.css")) {
  core = core.replace(
    /(<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>)/,
    `$1\n<link rel="stylesheet" href="${staging}/js/admin/bo-rte-rescue.css?${stamp}">\n`
  );
}

await fs.writeFile(coreLocal, core, "utf8");
await client.uploadFrom(coreLocal, coreRemote);
console.log("patched core_javascript");

// Bump assets version in config.yml
const cfgRemote = `${shopRoot}/app/config/config.yml`;
const cfgLocal = path.join(tmp, "config.yml");
await client.downloadTo(cfgLocal, cfgRemote);
let yml = await fs.readFile(cfgLocal, "utf8");
yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, cfgRemote);

// stash cache
const token = Date.now().toString(36);
try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-rte2-${token}`
  );
  try {
    await client.send(`MKD ${shopRoot}/var/cache/prod`);
  } catch {}
  console.log("cache stashed");
} catch (e) {
  console.log("cache", e.message);
}

client.close();
console.log("DONE", stamp);
