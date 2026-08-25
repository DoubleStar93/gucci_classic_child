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
const stamp = `9.0.3-rte${Date.now().toString(36)}`;

const client = new Client(90_000);
const tmp = path.join(os.tmpdir(), "rte-final");
await fs.mkdir(tmp, { recursive: true });

await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
});

await client.uploadFrom(
  "tmp-remote/bo-rte-rescue.js",
  `${shopRoot}/js/admin/bo-rte-rescue.js`
);
await client.uploadFrom(
  "tmp-remote/bo-rte-rescue.css",
  `${shopRoot}/js/admin/bo-rte-rescue.css`
);

const remote = `${shopRoot}/src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig`;
const local = path.join(tmp, "core.twig");
await client.downloadTo(local, remote);
let core = await fs.readFile(local, "utf8");

// Replace early bootstrap block with stronger version including defaultTinyMceConfig
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
  // Prevent native TinyMCEEditor from requesting missing /js/tiny_mce/plugins/filemanager (403)
  // Filemanager stays available via external_plugins path under the admin folder.
  window.defaultTinyMceConfig = Object.assign({}, window.defaultTinyMceConfig || {}, {
    plugins: 'align colorpicker link image table media placeholder lists advlist code autoresize hr',
    external_plugins: {
      filemanager: (window.baseAdminDir || '/l1ka80lkkixgfknd/') + 'filemanager/plugin.min.js'
    },
    skin: 'prestashop',
    skin_url: '${staging}/js/tiny_mce/skins/prestashop',
    theme_url: '${staging}/js/tiny_mce/themes/modern/theme.min.js',
    language: false
  });
</script>
<link rel="stylesheet" href="${staging}/js/admin/bo-rte-rescue.css?${stamp}">
`;

if (core.includes("window.tinyMCEPreInit")) {
  core = core.replace(
    /<script>\s*window\.PS_ALLOW_ACCENTED_CHARS_URL[\s\S]*?<\/script>\s*<link rel="stylesheet" href="[^"]*bo-rte-rescue\.css[^"]*">/,
    early.trim()
  );
  // if replace failed (different formatting), inject after main.bundle
  if (!core.includes("defaultTinyMceConfig")) {
    core = core.replace(
      /<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>/,
      `<script src="{{ asset('themes/new-theme/public/main.bundle.js') }}"></script>\n${early}`
    );
  }
} else {
  core = core.replace(
    /<script src="\{\{\s*asset\('themes\/new-theme\/public\/main\.bundle\.js'\)\s*\}\}"><\/script>/,
    `<script src="{{ asset('themes/new-theme/public/main.bundle.js') }}"></script>\n${early}`
  );
}

core = core
  .replace(/admin\.js\?[^"'\s]+/g, `admin.js?${stamp}`)
  .replace(/tools\.js\?[^"'\s]+/g, `tools.js?${stamp}`)
  .replace(/jquery\.fancybox\.js\?[^"'\s]+/g, `jquery.fancybox.js?${stamp}`)
  .replace(/jquery\.chosen\.js\?[^"'\s]+/g, `jquery.chosen.js?${stamp}`)
  .replace(/bo-rte-rescue\.js\?[^"'\s]+/g, `bo-rte-rescue.js?${stamp}`)
  .replace(/bo-rte-rescue\.css\?[^"'\s]+/g, `bo-rte-rescue.css?${stamp}`);

if (!core.includes("bo-rte-rescue.js")) {
  core += `\n<script src="${staging}/js/admin/bo-rte-rescue.js?${stamp}"></script>\n`;
}

await fs.writeFile(local, core, "utf8");
await client.uploadFrom(local, remote);

const cfgRemote = `${shopRoot}/app/config/config.yml`;
const cfgLocal = path.join(tmp, "cfg.yml");
await client.downloadTo(cfgLocal, cfgRemote);
let yml = await fs.readFile(cfgLocal, "utf8");
yml = yml.replace(/version:\s*'[^']+'/, `version: '${stamp}'`);
if (!yml.includes("barbaraalvisi.it/js")) {
  throw new Error("front_js base_urls missing");
}
await fs.writeFile(cfgLocal, yml, "utf8");
await client.uploadFrom(cfgLocal, cfgRemote);

const token = Date.now().toString(36);
try {
  await client.rename(
    `${shopRoot}/var/cache/prod`,
    `${shopRoot}/var/cache/_stash-rte3-${token}`
  );
  try {
    await client.send(`MKD ${shopRoot}/var/cache/prod`);
  } catch {}
  console.log("cache stashed");
} catch (e) {
  console.log("cache", e.message);
}

console.log("defaultTinyMceConfig in twig:", core.includes("defaultTinyMceConfig"));
console.log("DONE", stamp);
client.close();
