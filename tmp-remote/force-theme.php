<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
require __DIR__ . '/config/config.inc.php';
header('Content-Type: text/plain; charset=utf-8');
$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
if (!hash_equals('barbaraalvisi-theme-activate', $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

$db = Db::getInstance();
$p = _DB_PREFIX_;
$rows = $db->executeS(
    'SELECT id_configuration, id_shop_group, id_shop, value FROM `' . $p . "configuration` WHERE name='PS_THEME_NAME'"
);
echo "PS_THEME_NAME rows:\n";
foreach ($rows as $r) {
    echo ' id=' . $r['id_configuration']
        . ' shop_group=' . var_export($r['id_shop_group'], true)
        . ' shop=' . var_export($r['id_shop'], true)
        . ' value=' . $r['value'] . "\n";
}

$db->execute("UPDATE `{$p}configuration` SET `value`='barbaraalvisi' WHERE `name`='PS_THEME_NAME'");
Configuration::updateValue('PS_THEME_NAME', 'barbaraalvisi');
echo "Updated all to barbaraalvisi\n";

echo 'classic-gucci dir: ' . (is_dir(_PS_ROOT_DIR_ . '/themes/classic-gucci') ? 'YES' : 'no') . "\n";
echo 'barbaraalvisi dir: ' . (is_dir(_PS_ROOT_DIR_ . '/themes/barbaraalvisi') ? 'YES' : 'no') . "\n";
echo 'THEME_NAME const: ' . (defined('_THEME_NAME_') ? _THEME_NAME_ : 'n/a') . "\n";

$rows2 = $db->executeS(
    'SELECT id_configuration, id_shop_group, id_shop, value FROM `' . $p . "configuration` WHERE name='PS_THEME_NAME'"
);
echo "After update:\n";
foreach ($rows2 as $r) {
    echo ' id=' . $r['id_configuration']
        . ' shop=' . var_export($r['id_shop'], true)
        . ' value=' . $r['value'] . "\n";
}
echo "DONE\n";
