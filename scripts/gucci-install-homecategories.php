<?php
/**
 * One-shot installer â€” caricato dal deploy, poi rimosso dal server.
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');

$configFile = __DIR__ . '/config/config.inc.php';

if (!is_file($configFile)) {
    http_response_code(500);
    exit("config.inc.php not found\n");
}

require $configFile;

if (!defined('_PS_VERSION_')) {
    http_response_code(500);
    exit("PrestaShop bootstrap failed\n");
}

header('Content-Type: text/plain; charset=utf-8');

$expectedToken = 'gucci-homecategories-install';
$token = (string) Tools::getValue('token');

if (!hash_equals($expectedToken, $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

try {
    $module = Module::getInstanceByName('gucci_homecategories');

    if (!$module) {
        exit("ERRORE: modulo non trovato in modules/gucci_homecategories\n");
    }

    if (!$module->id) {
        if (!$module->install()) {
            exit('ERRORE: install() fallito â€” ' . implode(', ', $module->getErrors()) . "\n");
        }
        exit("OK: modulo installato (id {$module->id})\n");
    }

    $module->enable();
    if (method_exists($module, 'ensureHooks')) {
        $module->ensureHooks();
    } else {
        $module->registerHook('displayHome');
        $module->registerHook('actionFrontControllerSetVariables');
    }
    exit("OK: modulo giÃ  presente (id {$module->id}), hook displayHome + menu registrati\n");
} catch (Throwable $exception) {
    http_response_code(500);
    exit('ERRORE: ' . $exception->getMessage() . "\n");
}
