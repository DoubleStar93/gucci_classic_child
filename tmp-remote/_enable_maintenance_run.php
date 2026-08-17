<?php
/**
 * One-shot: rimette il negozio in manutenzione (PS_SHOP_ENABLE = 0).
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');

$tokenExpected = '0fb47dea8b828a25f65fed9c10d8f32b';
$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
if (!hash_equals($tokenExpected, $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

require __DIR__ . '/config/config.inc.php';

try {
    $before = (string) Configuration::get('PS_SHOP_ENABLE');
    Configuration::updateValue('PS_SHOP_ENABLE', 0);
    Db::getInstance()->execute(
        "UPDATE `" . _DB_PREFIX_ . "configuration` SET `value` = '0' WHERE `name` = 'PS_SHOP_ENABLE'"
    );
    $after = (string) Configuration::get('PS_SHOP_ENABLE');
    exit("PS_SHOP_ENABLE prima={$before}\nPS_SHOP_ENABLE dopo={$after}\nOK: manutenzione attiva\n");
} catch (Throwable $e) {
    http_response_code(500);
    exit('ERRORE: ' . $e->getMessage() . "\n");
}
