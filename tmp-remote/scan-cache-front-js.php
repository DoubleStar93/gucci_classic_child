<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');

$roots = [
  __DIR__ . '/var/cache/prod',
  __DIR__ . '/var/cache/dev',
];

foreach ($roots as $root) {
  if (!is_dir($root)) {
    echo "missing $root\n";
    continue;
  }
  echo "=== $root ===\n";
  $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root));
  $hits = 0;
  foreach ($it as $f) {
    if (!$f->isFile()) continue;
    $name = $f->getFilename();
    if (!preg_match('/\.(php|xml|yml|json)$/', $name)) continue;
    // skip huge files
    if ($f->getSize() > 8_000_000) continue;
    $path = $f->getPathname();
    $chunk = @file_get_contents($path);
    if ($chunk === false) continue;
    if (stripos($chunk, 'front_js') === false && stripos($chunk, 'barbaraalvisi.it/js') === false) continue;
    // find nearby context
    if (preg_match_all('/.{0,80}(front_js|barbaraalvisi\.it\/js|base_urls|PathPackage|UrlPackage).{0,120}/s', $chunk, $m)) {
      echo "-- $path (" . $f->getSize() . ")\n";
      foreach (array_slice($m[0], 0, 8) as $line) {
        echo preg_replace('/\s+/', ' ', $line) . "\n";
      }
      $hits++;
      if ($hits >= 12) break 2;
    }
  }
  echo "hits=$hits\n";
}

echo "done\n";
@unlink(__FILE__);
