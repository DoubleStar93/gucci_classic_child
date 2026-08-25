<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');

try {
  require __DIR__ . '/config/config.inc.php';
  require_once __DIR__ . '/app/AdminKernel.php';

  $kernel = new AdminKernel(_PS_ENV_, false);
  $kernel->boot();
  $container = $kernel->getContainer();
  $packages = $container->get('assets.packages');

  foreach ([
    'admin.js',
    'tools.js',
    'jquery/plugins/fancybox/jquery.fancybox.js',
    'jquery/plugins/chosen/jquery.chosen.js',
  ] as $file) {
    echo $file . ' => ' . $packages->getUrl($file, 'front_js') . "\n";
  }
} catch (Throwable $e) {
  echo 'ERROR: ' . $e->getMessage() . "\n";
  echo $e->getFile() . ':' . $e->getLine() . "\n";
}

@unlink(__FILE__);
