<?php
/**
 * Diagnostica spedizione carrello — Barbara Alvisi / classic-gucci
 *
 * Standalone (upload manuale in cartella admin) oppure:
 *   npm run diagnose:shipping   → usa /module/everpspopup/shippingdiag
 */
declare(strict_types=1);

$token = 'gucci-diag-' . substr(hash('sha256', 'barbaraalvisi-shipping-diag-2026'), 0, 16);

if (($_GET['token'] ?? '') !== $token) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Forbidden. Usa: ?token={$token}\n";
    exit;
}

$configCandidates = [
    dirname(__DIR__) . '/config/config.inc.php',
    dirname(__FILE__) . '/../../config/config.inc.php',
    dirname(__FILE__) . '/../config/config.inc.php',
    dirname(__FILE__) . '/config/config.inc.php',
];

$configInc = null;
foreach ($configCandidates as $candidate) {
    if (is_file($candidate)) {
        $configInc = $candidate;
        break;
    }
}

if (!$configInc) {
    header('Content-Type: text/plain; charset=utf-8');
    echo "config.inc.php non trovato.\n";
    exit(1);
}

require $configInc;
require_once _PS_MODULE_DIR_ . 'everpspopup/lib/gucci-shipping-diag.php';

header('Content-Type: text/plain; charset=utf-8');

$requestedCartId = (int) Tools::getValue('id_cart');
gucci_run_shipping_diagnostic(Context::getContext(), $requestedCartId > 0 ? $requestedCartId : null);
