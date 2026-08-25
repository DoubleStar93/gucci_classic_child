import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import dotenv from 'dotenv';
import { Client } from 'basic-ftp';

dotenv.config({ path: path.join(process.cwd(), '.env') });
const shopRoot = process.env.FTP_REMOTE_PATH.trim().replace(/\/+$/, '').replace(/\/themes\/[^/]+$/i, '');
const client = new Client(60000);
const tmp = path.join(os.tmpdir(), 'verify-restore');
await fs.mkdir(tmp, { recursive: true });
await client.access({
  host: process.env.FTP_HOST.trim(),
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER.trim(),
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true',
});

for (const rel of [
  'src/PrestaShopBundle/Resources/views/Admin/Layout/core_javascript.html.twig',
  'src/PrestaShopBundle/Resources/views/Admin/Layout/stylesheets.html.twig',
  'app/config/config.yml',
]) {
  const local = path.join(tmp, path.basename(rel));
  await client.downloadTo(local, shopRoot + '/' + rel);
  const t = await fs.readFile(local, 'utf8');
  console.log('===', rel, '===');
  if (rel.endsWith('config.yml')) {
    const idx = t.indexOf('assets:');
    console.log(t.slice(idx, idx + 350));
  } else {
    console.log(t.slice(0, 800));
    console.log('--- barbara hardcode:', t.includes('barbaraalvisi.it'));
    console.log('--- rescue/polyfill:', /bo-rte-rescue|str2url|defaultTinyMceConfig|preload/.test(t));
    console.log('--- uses asset front_js:', t.includes("asset(") && t.includes('front_js'));
  }
}

const list = await client.list(shopRoot + '/js/admin');
console.log(
  'rescue leftovers:',
  list.filter((f) => /bo-rte|selftest|tinymce-self/.test(f.name)).map((f) => f.name)
);
client.close();
