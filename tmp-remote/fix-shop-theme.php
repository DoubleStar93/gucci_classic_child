<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
require __DIR__ . '/config/config.inc.php';
header('Content-Type: text/plain; charset=utf-8');
$token = $_GET['token'] ?? '';
if ($token !== 'barbaraalvisi-theme-activate') {
    http_response_code(403);
    exit("Forbidden\n");
}

$db = Db::getInstance();
$p = _DB_PREFIX_;
$themeName = 'barbaraalvisi';

$before = $db->getValue("SELECT theme_name FROM `{$p}shop` WHERE id_shop=1");
echo "shop.theme_name BEFORE={$before}\n";

$db->execute("UPDATE `{$p}shop` SET `theme_name`='" . pSQL($themeName) . "' WHERE `id_shop`=1");
$db->execute("UPDATE `{$p}configuration` SET `value`='" . pSQL($themeName) . "' WHERE `name`='PS_THEME_NAME'");
Configuration::updateValue('PS_THEME_NAME', $themeName);

$after = $db->getValue("SELECT theme_name FROM `{$p}shop` WHERE id_shop=1");
echo "shop.theme_name AFTER={$after}\n";
echo "PS_THEME_NAME=" . Configuration::get('PS_THEME_NAME') . "\n";

// Module
$legacy = Module::getInstanceByName('gucci_homecategories');
if ($legacy && $legacy->id) {
    $legacy->unregisterHook('displayHome');
    $legacy->unregisterHook('actionFrontControllerSetVariables');
    $legacy->uninstall();
    echo "gucci_homecategories uninstalled\n";
}

$module = Module::getInstanceByName('barbaraalvisi_homecategories');
if ($module) {
    if (!$module->id) {
        $module->install();
    } else {
        $module->enable();
        $module->ensureHooks();
    }
    echo "barbaraalvisi_homecategories id={$module->id} displayHome=" . ($module->isRegisteredInHook('displayHome') ? 'yes' : 'no') . "\n";
} else {
    echo "MODULE MISSING\n";
}

echo "yml=" . (is_file(_PS_ROOT_DIR_ . '/themes/barbaraalvisi/config/theme.yml') ? 'ok' : 'missing') . "\n";
echo "cats tpl=" . (is_file(_PS_ROOT_DIR_ . '/themes/barbaraalvisi/templates/_partials/barbaraalvisi-home-categories.tpl') ? 'ok' : 'missing') . "\n";
echo "DONE\n";
