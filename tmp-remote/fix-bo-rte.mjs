/**
 * Fix BO product descriptions: ensure admin.js/tools.js load from absolute /js
 * and window.str2url exists so product_edit init (and TinyMCE) can finish.
 *
 * Patches Twig layout includes on server + clears Symfony admin cache.
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
const stamp = `9.0.3-fix${Date.now().toString(36)}`;

const client = new Client(120_000);
const tmp = path.join(os.tmpdir(), "fix-bo-rte");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

async function get(remote) {
  const local = path.join(tmp, remote.replace(/[\\/]/g, "_").slice(-100));
  await client.downloadTo(local, remote);
  return { local, text: await fs.readFile(local, "utf8") };
}

async function put(local, remote) {
  await client.uploadFrom(local, remote);
}

// 1) Ensure config front_js + version
{
  const remote = `${shopRoot}/app/config/config.yml`;
  const { local, text } = await get(remote);
  let yml = text;
  if (!yml.includes("barbaraalvisi.it/js")) {
    yml = yml.replace(
      /assets:\s*\n(?:.*\n)*?(?=^\s*# esi|^ {2}secret:)/m,
      `  assets:\n    version: '${stamp}'\n    packages:\n      front_js:\n        base_urls:\n          - '${staging}/js'\n\n`
    );
  } else {
    yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
  }
  await fs.writeFile(local, yml, "utf8");
  await put(local, remote);
  console.log("config.yml version", stamp);
}

// 2) Patch core_javascript.html.twig — absolute URLs + str2url safety net
{
  const remote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
  const { local, text } = await get(remote);
  console.log("core_javascript original length", text.length);

  const patched = `{# Absolute /js URLs — avoids admin pretty-route prefixing (/adminfolder/js → 404) #}
<script src="${staging}/js/admin.js?${stamp}"></script>
<script>
  {# Ensure product_edit linkRewrite can call window.str2url even if admin.js is cached empty #}
  (function () {
    if (typeof window.str2url === 'function') return;
    if (typeof str2url === 'function') { window.str2url = str2url; return; }
    window.str2url = function (str) {
      if (!str) return '';
      str = String(str).toLowerCase();
      str = str.replace(/[^a-z0-9\\s\\-]/g, '');
      str = str.replace(/[\\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      return str;
    };
  })();
</script>
<script src="${staging}/js/tools.js?${stamp}"></script>
<script src="${staging}/js/jquery/plugins/fancybox/jquery.fancybox.js?${stamp}"></script>
<script src="${staging}/js/jquery/plugins/chosen/jquery.chosen.js?${stamp}"></script>
`;

  // Keep any extra scripts that were after the standard block (modules may extend)
  // Replace only the known front_js script block if present; else overwrite whole file carefully.
  let out;
  if (/asset\('admin\.js',\s*'front_js'\)/.test(text)) {
    // Replace from first admin.js script through chosen.js script
    out = text.replace(
      /<script src="\{\{\s*asset\('admin\.js',\s*'front_js'\)\s*\}\}"><\/script>[\s\S]*?<script src="\{\{\s*asset\('jquery\/plugins\/chosen\/jquery\.chosen\.js',\s*'front_js'\)\s*\}\}"><\/script>/,
      patched.trim()
    );
    if (out === text) {
      console.log("WARN: regex replace failed, writing full replacement of body scripts");
      out = text + "\n" + patched;
    }
  } else if (text.includes("barbaraalvisi.it/js/admin.js")) {
    out = text.replace(/admin\.js\?[^"']+/g, `admin.js?${stamp}`)
      .replace(/tools\.js\?[^"']+/g, `tools.js?${stamp}`)
      .replace(/fancybox\.js\?[^"']+/g, `jquery.fancybox.js?${stamp}`)
      .replace(/chosen\.js\?[^"']+/g, `jquery.chosen.js?${stamp}`);
    if (!out.includes("window.str2url")) {
      out = out.replace(
        /(<script src="https:\/\/barbaraalvisi\.it\/js\/admin\.js\?[^\"]+"><\/script>)/,
        `$1\n<script>(function(){if(typeof window.str2url==='function')return;if(typeof str2url==='function'){window.str2url=str2url;return;}window.str2url=function(str){if(!str)return'';str=String(str).toLowerCase();str=str.replace(/[^a-z0-9\\s\\-]/g,'');return str.replace(/[\\s]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');};})();</script>`
      );
    }
  } else {
    out = patched + "\n" + text;
  }

  await fs.writeFile(local, out, "utf8");
  await put(local, remote);
  console.log("patched core_javascript.html.twig");
  console.log(out.slice(0, 600));
}

// 3) Patch stylesheets.css for fancybox/chosen absolute
{
  const remote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/stylesheets.html.twig`;
  const { local, text } = await get(remote);
  let out = text;
  if (/asset\('jquery\/plugins\/fancybox/.test(text)) {
    out = text
      .replace(
        /\{\{\s*asset\('jquery\/plugins\/fancybox\/jquery\.fancybox\.css',\s*'front_js'\)\s*\}\}/g,
        `${staging}/js/jquery/plugins/fancybox/jquery.fancybox.css?${stamp}`
      )
      .replace(
        /\{\{\s*asset\('jquery\/plugins\/chosen\/jquery\.chosen\.css',\s*'front_js'\)\s*\}\}/g,
        `${staging}/js/jquery/plugins/chosen/jquery.chosen.css?${stamp}`
      );
  } else {
    out = text
      .replace(/fancybox\.css\?[^"']+/g, `jquery.fancybox.css?${stamp}`)
      .replace(/chosen\.css\?[^"']+/g, `jquery.chosen.css?${stamp}`);
  }
  await fs.writeFile(local, out, "utf8");
  await put(local, remote);
  console.log("patched stylesheets.html.twig");
}

// 4) TinyMCE rescue — small public JS + append to core_javascript
{
  const rescue = `/*! barbaraalvisi BO RTE rescue */
(function () {
  function ensureStr2url() {
    if (typeof window.str2url === 'function') return;
    if (typeof str2url === 'function') { window.str2url = str2url; return; }
    window.str2url = function (str) {
      if (!str) return '';
      return String(str).toLowerCase()
        .replace(/[^a-z0-9\\s-]/g, '')
        .replace(/[\\s]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };
  }

  function editorsMissing() {
    var areas = document.querySelectorAll('textarea.autoload_rte, textarea.rte');
    if (!areas.length) return false;
    return !document.querySelector('.mce-tinymce, .tox-tinymce');
  }

  function loadTinyAndInit() {
    ensureStr2url();
    if (typeof window.tinyMCE !== 'undefined') {
      tryInit();
      return;
    }
    var base = ${JSON.stringify(staging)} + '/js/tiny_mce';
    window.tinyMCEPreInit = { base: base, suffix: '.min' };
    var s = document.createElement('script');
    s.src = base + '/tinymce.min.js';
    s.onload = tryInit;
    document.head.appendChild(s);
  }

  function tryInit() {
    ensureStr2url();
    if (typeof window.tinyMCE === 'undefined') return;
    var sel = 'textarea.autoload_rte:not(.tox-edit-area textarea), textarea.rte';
    if (!document.querySelector(sel)) return;
    if (document.querySelector('.mce-tinymce, .tox-tinymce')) return;
    var baseAdmin = (typeof window.baseAdminDir !== 'undefined')
      ? window.baseAdminDir
      : '/l1ka80lkkixgfknd/';
    window.tinyMCE.init({
      selector: 'textarea.autoload_rte, textarea.rte',
      plugins: 'align colorpicker link image table media placeholder lists advlist code autoresize hr',
      toolbar1: 'code,colorpicker,bold,italic,underline,strikethrough,blockquote,link,align,bullist,numlist,table,image,media,formatselect,hr',
      menubar: false,
      statusbar: false,
      skin: 'prestashop',
      relative_urls: false,
      convert_urls: false,
      entity_encoding: 'raw',
      external_filemanager_path: baseAdmin + 'filemanager/',
      external_plugins: { filemanager: baseAdmin + 'filemanager/plugin.min.js' },
      language: window.iso_user || 'it'
    });
  }

  ensureStr2url();
  document.addEventListener('DOMContentLoaded', function () {
    ensureStr2url();
    setTimeout(function () {
      if (editorsMissing()) loadTinyAndInit();
    }, 1200);
  });
})();
`;
  const rescueLocal = path.join(tmp, "bo-rte-rescue.js");
  await fs.writeFile(rescueLocal, rescue, "utf8");
  await put(rescueLocal, `${shopRoot}/js/admin/bo-rte-rescue.js`);

  const remote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
  const { local, text } = await get(remote);
  if (!text.includes("bo-rte-rescue.js")) {
    const withRescue =
      text.trimEnd() +
      `\n<script src="${staging}/js/admin/bo-rte-rescue.js?${stamp}"></script>\n`;
    await fs.writeFile(local, withRescue, "utf8");
    await put(local, remote);
    console.log("appended bo-rte-rescue.js to core_javascript");
  } else {
    console.log("rescue already referenced");
  }
}

// 5) Clear Symfony cache (stash prod)
{
  const token = Date.now().toString(36);
  try {
    await client.rename(
      `${shopRoot}/var/cache/prod`,
      `${shopRoot}/var/cache/_stash-rte-${token}`
    );
    try {
      await client.send(`MKD ${shopRoot}/var/cache/prod`);
    } catch {
      // exists
    }
    console.log("cache prod stashed");
  } catch (e) {
    console.log("cache:", e.message);
  }
}

client.close();
console.log("DONE — hard refresh product edit (Ctrl+F5)");
