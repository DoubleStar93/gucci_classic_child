<?php
require __DIR__ . '/config/config.inc.php';
header('Content-Type: text/plain');
$token = $_GET['token'] ?? '';
if ($token !== 'barbaraalvisi-theme-activate') {
    http_response_code(403);
    exit('Forbidden');
}
Db::getInstance()->execute(
    "UPDATE `" . _DB_PREFIX_ . "configuration` SET `value`='classic-gucci' WHERE `name`='PS_THEME_NAME'"
);
Configuration::updateValue('PS_THEME_NAME', 'classic-gucci');
echo 'PS_THEME_NAME=' . Configuration::get('PS_THEME_NAME') . PHP_EOL;
echo 'theme.yml=' . (is_file(_PS_ROOT_DIR_ . '/themes/classic-gucci/config/theme.yml') ? 'OK' : 'MISSING') . PHP_EOL;
echo 'header.tpl=' . (is_file(_PS_ROOT_DIR_ . '/themes/classic-gucci/templates/_partials/header.tpl') ? 'OK' : 'MISSING') . PHP_EOL;
echo 'DONE' . PHP_EOL;
