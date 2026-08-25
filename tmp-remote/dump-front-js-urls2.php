<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');

require __DIR__ . '/config/config.inc.php';
require_once __DIR__ . '/app/AdminKernel.php';

$kernel = new AdminKernel(_PS_ENV_, false);
$kernel->boot();

// Warm/use Twig to render asset() like BO does
$container = $kernel->getContainer();
$twig = $container->get('twig');
$html = $twig->createTemplate(
  "{{ asset('admin.js', 'front_js') }}\n" .
  "{{ asset('tools.js', 'front_js') }}\n" .
  "{{ asset('jquery/plugins/fancybox/jquery.fancybox.js', 'front_js') }}\n" .
  "{{ asset('jquery/plugins/chosen/jquery.chosen.js', 'front_js') }}\n"
)->render([]);
echo $html;

@unlink(__FILE__);
