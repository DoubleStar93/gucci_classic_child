<?php
/**
 * One-shot: render core_javascript + stylesheets asset URLs as BO would.
 * Also prints a safe str2url presence probe snippet recommendation.
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');

require __DIR__ . '/config/config.inc.php';
require_once __DIR__ . '/app/AdminKernel.php';

$kernel = new AdminKernel(_PS_ENV_, false);
$kernel->boot();
$container = $kernel->getContainer();

// Render twig templates used by layout
try {
  $twig = $container->get('twig');
} catch (Throwable $e) {
  // Symfony 6+ may need different retrieval
  $twig = null;
  foreach (['twig', 'html'] as $id) {
    try {
      if (method_exists($container, 'get') && $container->has($id)) {
        $svc = $container->get($id);
        if ($svc instanceof \Twig\Environment) {
          $twig = $svc;
          break;
        }
      }
    } catch (Throwable $e2) {
      echo "get($id): " . $e2->getMessage() . "\n";
    }
  }
}

if (!$twig) {
  // Manual UrlPackage like compiled container
  echo "Twig unavailable — manual UrlPackage simulation\n";
  require_once __DIR__ . '/vendor/autoload.php';
  $version = new \Symfony\Component\Asset\VersionStrategy\StaticVersionStrategy('probe');
  $pkg = new \Symfony\Component\Asset\UrlPackage(['https://barbaraalvisi.it/js'], $version);
  foreach (['admin.js', 'tools.js', 'tiny_mce/tinymce.min.js', 'admin/tinymce.inc.js'] as $f) {
    echo "$f => " . $pkg->getUrl($f) . "\n";
  }
} else {
  echo "=== core_javascript.html.twig ===\n";
  echo $twig->render('@PrestaShop/Admin/Layout/core_javascript.html.twig');
  echo "\n=== stylesheets fancybox/chosen lines ===\n";
  echo $twig->render('@PrestaShop/Admin/Layout/stylesheets.html.twig');
}

echo "\n=== admin.js has str2url? ===\n";
$adminJs = file_get_contents(__DIR__ . '/js/admin.js');
echo (strpos($adminJs, 'function str2url') !== false ? 'YES' : 'NO') . "\n";

echo "done\n";
@unlink(__FILE__);
