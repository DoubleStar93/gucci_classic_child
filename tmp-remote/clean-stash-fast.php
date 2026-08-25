<?php
header('Content-Type: text/plain; charset=utf-8');
$cache = __DIR__ . '/var/cache';
$removed = 0;
$bytes = 0;

function rrmdir($dir, &$removed, &$bytes) {
  if (!is_dir($dir)) return;
  $it = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::CHILD_FIRST
  );
  foreach ($it as $f) {
    if ($f->isFile()) {
      $bytes += (int) $f->getSize();
      @unlink($f->getPathname());
      $removed++;
    } else {
      @rmdir($f->getPathname());
    }
  }
  @rmdir($dir);
}

if (!is_dir($cache)) {
  echo "no cache dir: $cache\n";
  exit;
}

foreach (scandir($cache) ?: [] as $name) {
  if ($name === '.' || $name === '..') continue;
  if (strpos($name, '_stash') !== 0) continue;
  $path = $cache . '/' . $name;
  if (!is_dir($path)) continue;
  echo "removing $name ...\n";
  flush();
  rrmdir($path, $removed, $bytes);
}

echo "done files=$removed bytes=$bytes\n";
@unlink(__FILE__);
