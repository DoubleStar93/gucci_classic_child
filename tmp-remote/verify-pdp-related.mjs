import 'dotenv/config';
import { Client } from 'basic-ftp';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

function get(url, max = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location &&
          max > 0
        ) {
          const next = new URL(res.headers.location, url).href;
          res.resume();
          return resolve(get(next, max - 1));
        }
        const c = [];
        res.on('data', (x) => c.push(x));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            url,
            body: Buffer.concat(c).toString('utf8'),
          })
        );
      })
      .on('error', reject);
  });
}

async function withShopOpen(fn) {
  const client = new Client(180000);
  await client.access({
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT || 21),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === 'true',
  });
  await client.downloadTo('tmp-remote/index.php.bak', '/barbaraalvisi.it/public_html/index.php');
  const original = fs.readFileSync('tmp-remote/index.php.bak', 'utf8');
  const token =
    'ba-maint-' +
    crypto.createHash('sha256').update('barbaraalvisi-maint-2026').digest('hex').slice(0, 16);
  const boot = `if (isset($_GET['ba_maint_token']) && hash_equals('${token}', (string) $_GET['ba_maint_token'])) {
  require __DIR__ . '/config/config.inc.php';
  header('Content-Type: text/plain; charset=utf-8');
  $v = isset($_GET['enable']) ? (string) $_GET['enable'] : '';
  if ($v === '0' || $v === '1') {
    Configuration::updateValue('PS_SHOP_ENABLE', $v);
    Db::getInstance()->execute(
      'UPDATE \`' . _DB_PREFIX_ . "configuration\` SET \`value\`='" . pSQL($v) . "' WHERE \`name\`='PS_SHOP_ENABLE'"
    );
  }
  echo 'PS_SHOP_ENABLE=' . Configuration::get('PS_SHOP_ENABLE') . PHP_EOL;
  exit;
}
`;
  const patched = original.startsWith('<?php')
    ? '<?php\n' + boot + original.slice(5)
    : '<?php\n' + boot + '?>\n' + original;
  fs.writeFileSync('tmp-remote/index.php.patched', patched);
  await client.uploadFrom('tmp-remote/index.php.patched', '/barbaraalvisi.it/public_html/index.php');
  await get(
    'https://barbaraalvisi.it/index.php?ba_maint_token=' +
      encodeURIComponent(token) +
      '&enable=1'
  );
  try {
    return await fn();
  } finally {
    await get(
      'https://barbaraalvisi.it/index.php?ba_maint_token=' +
        encodeURIComponent(token) +
        '&enable=0'
    );
    await client.uploadFrom('tmp-remote/index.php.bak', '/barbaraalvisi.it/public_html/index.php');
    client.close();
  }
}

const result = await withShopOpen(async () => {
  const home = await get('https://barbaraalvisi.it/index.php');
  console.log('css', (home.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
  const hrefs = [...home.body.matchAll(/href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((h) => /product|abito|giacca|gonna|mantella|blusa|pantalone/i.test(h));
  const unique = [...new Set(hrefs)].slice(0, 20);
  console.log('hrefs', unique.slice(0, 10));

  for (const h of unique) {
    const url = h.startsWith('http')
      ? h
      : 'https://barbaraalvisi.it' + (h.startsWith('/') ? h : '/' + h);
    const page = await get(url);
    const related =
      page.body.includes('barbaraalvisi-pdp-category-products') ||
      page.body.includes('barbaraalvisi-pdp-accessories') ||
      /Della stessa categoria|Potrebbe piacerti/i.test(page.body);
    if (!related) continue;
    console.log('FOUND', page.url);
    fs.writeFileSync('tmp-remote/pdp-related-page.html', page.body);
    const i = Math.max(
      page.body.indexOf('barbaraalvisi-pdp-category-products'),
      page.body.indexOf('barbaraalvisi-pdp-accessories'),
      page.body.search(/Potrebbe piacerti/i)
    );
    fs.writeFileSync(
      'tmp-remote/pdp-related-snippet.html',
      page.body.slice(Math.max(0, i), Math.max(0, i) + 5000)
    );
    console.log('thumb-swap', (page.body.match(/barbaraalvisi-thumb-swap/g) || []).length);
    console.log('css', (page.body.match(/custom\.css\?v=[0-9.]+/) || [])[0]);
    return page.url;
  }
  return null;
});

console.log('result url', result);
