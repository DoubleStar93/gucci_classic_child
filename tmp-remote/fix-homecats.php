<?php
/**
 * One-shot: ripristina gucci_homecategories su displayHome.
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');
require __DIR__ . '/config/config.inc.php';
header('Content-Type: text/plain; charset=utf-8');

$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
if (!hash_equals('gucci-homecategories-install', $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

$lines = [];

try {
    $context = Context::getContext();
    if (!$context->shop || !Validate::isLoadedObject($context->shop)) {
        $idShop = (int) Configuration::get('PS_SHOP_DEFAULT') ?: 1;
        $context->shop = new Shop($idShop);
        Shop::setContext(Shop::CONTEXT_SHOP, $idShop);
    }

    // Disabilita modulo rename se ancora agganciato
    if (Module::isInstalled('barbaraalvisi_homecategories')) {
        $ba = Module::getInstanceByName('barbaraalvisi_homecategories');
        if ($ba && $ba->id) {
            $ba->unregisterHook('displayHome');
            $ba->unregisterHook('actionFrontControllerSetVariables');
            $lines[] = 'OK: barbaraalvisi_homecategories scollegato dagli hook';
        }
    }

    $module = Module::getInstanceByName('gucci_homecategories');
    if (!$module) {
        exit("ERRORE: modulo gucci_homecategories non trovato in /modules\n");
    }

    if (!$module->id) {
        if (!$module->install()) {
            exit('ERRORE install: ' . implode(', ', $module->getErrors()) . "\n");
        }
        $lines[] = "OK: gucci_homecategories installato (id {$module->id})";
    } else {
        $module->enable();
        if (method_exists($module, 'ensureHooks')) {
            $module->ensureHooks();
        } else {
            $module->registerHook('displayHome');
            $module->registerHook('actionFrontControllerSetVariables');
        }
        $lines[] = "OK: gucci_homecategories già presente (id {$module->id}), hook ripristinati";
    }

    $lines[] = 'enabled=' . (Module::isEnabled('gucci_homecategories') ? 'yes' : 'no');
    $lines[] = 'hook displayHome=' . ($module->isRegisteredInHook('displayHome') ? 'yes' : 'no');

    exit(implode("\n", $lines) . "\n");
} catch (Throwable $e) {
    http_response_code(500);
    exit('ERRORE: ' . $e->getMessage() . "\n");
}
