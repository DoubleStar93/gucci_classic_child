<?php
/**
 * One-shot: attiva/disattiva manutenzione shop.
 * Eliminare dopo l'uso.
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');
require __DIR__ . '/config/config.inc.php';
header('Content-Type: text/plain; charset=utf-8');

$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
if (!hash_equals('barbaraalvisi-maintenance', $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

$enable = Tools::getValue('enable');
// enable=0 → manutenzione ON (shop chiuso)
// enable=1 → shop aperto
if ($enable === '0' || $enable === '1') {
    Configuration::updateValue('PS_SHOP_ENABLE', $enable);
    Db::getInstance()->execute(
        'UPDATE `' . _DB_PREFIX_ . "configuration` SET `value`='" . pSQL($enable) . "' WHERE `name`='PS_SHOP_ENABLE'"
    );
}

$rows = Db::getInstance()->executeS(
    'SELECT id_shop, id_shop_group, value FROM `' . _DB_PREFIX_ . "configuration` WHERE name='PS_SHOP_ENABLE'"
);
foreach ($rows as $r) {
    echo 'PS_SHOP_ENABLE shop=' . var_export($r['id_shop'], true)
        . ' group=' . var_export($r['id_shop_group'], true)
        . ' value=' . var_export($r['value'], true) . "\n";
}
echo $enable === '0' ? "Manutenzione ATTIVA\n" : ($enable === '1' ? "Shop APERTO\n" : "Solo lettura\n");
