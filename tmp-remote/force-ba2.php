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

echo "=== BEFORE ===\n";
echo "_THEME_NAME_=" . (defined('_THEME_NAME_') ? _THEME_NAME_ : 'n/a') . "\n";
echo "Configuration::get=" . Configuration::get('PS_THEME_NAME') . "\n";
$rows = $db->executeS("SELECT id_configuration, id_shop, id_shop_group, value FROM `{$p}configuration` WHERE name='PS_THEME_NAME'");
foreach ($rows as $r) {
    echo "row id={$r['id_configuration']} shop=" . var_export($r['id_shop'], true) . " value={$r['value']}\n";
}

// Force ALL rows + insert shop-specific if needed
$db->execute("UPDATE `{$p}configuration` SET value='barbaraalvisi' WHERE name='PS_THEME_NAME'");
Configuration::updateValue('PS_THEME_NAME', 'barbaraalvisi');

// Also update for shop 1 explicitly
$idShop = (int) Configuration::get('PS_SHOP_DEFAULT') ?: 1;
Configuration::updateValue('PS_THEME_NAME', 'barbaraalvisi', false, null, $idShop);

echo "\n=== AFTER DB ===\n";
$rows = $db->executeS("SELECT id_configuration, id_shop, id_shop_group, value FROM `{$p}configuration` WHERE name='PS_THEME_NAME'");
foreach ($rows as $r) {
    echo "row id={$r['id_configuration']} shop=" . var_export($r['id_shop'], true) . " value={$r['value']}\n";
}

// Ensure shop1.json exists with image_types from yml via repository rebuild
$context = Context::getContext();
if (!$context->shop) {
    $context->shop = new Shop($idShop);
    Shop::setContext(Shop::CONTEXT_SHOP, $idShop);
}
if (!$context->employee) {
    $context->employee = new Employee();
}

$builder = new PrestaShop\PrestaShop\Core\Addon\Theme\ThemeManagerBuilder($context, $db);
$repo = $builder->buildRepository($context->shop);

// Delete cached json and reload
$jsonPath = _PS_ROOT_DIR_ . '/config/themes/barbaraalvisi/shop1.json';
if (is_file($jsonPath)) {
    unlink($jsonPath);
    echo "deleted shop1.json\n";
}
try {
    $theme = $repo->getInstanceByName('barbaraalvisi');
    echo "repo name=" . $theme->getName() . "\n";
    echo "repo dir=" . $theme->getDirectory() . "\n";
    $attrs = method_exists($theme, 'get') ? null : null;
    // dump if image_types present in json after get
    clearstatcache();
    if (is_file($jsonPath)) {
        $json = json_decode(file_get_contents($jsonPath), true);
        echo "shop1.json image_types=" . (isset($json['global_settings']['image_types']['cart_default']) ? 'YES' : 'NO') . "\n";
    } else {
        echo "shop1.json not recreated yet\n";
    }
} catch (Throwable $e) {
    echo "repo ERR: " . $e->getMessage() . "\n";
}

$tm = $builder->build();
$ok = $tm->enable('barbaraalvisi');
echo "enable=" . var_export($ok, true) . "\n";
if (!$ok) {
    echo "errors=" . print_r($tm->getErrors('barbaraalvisi'), true) . "\n";
}

echo "Configuration final=" . Configuration::get('PS_THEME_NAME') . "\n";
echo "classic-gucci dir=" . (is_dir(_PS_ROOT_DIR_ . '/themes/classic-gucci') ? 'YES' : 'no') . "\n";
echo "barbaraalvisi dir=" . (is_dir(_PS_ROOT_DIR_ . '/themes/barbaraalvisi') ? 'YES' : 'no') . "\n";

// Module check
$m = Module::getInstanceByName('barbaraalvisi_homecategories');
echo "module id=" . ($m && $m->id ? $m->id : 'none') . " enabled=" . (Module::isEnabled('barbaraalvisi_homecategories') ? 'yes' : 'no') . "\n";
if ($m && $m->id) {
    $m->ensureHooks();
    echo "displayHome=" . ($m->isRegisteredInHook('displayHome') ? 'yes' : 'no') . "\n";
}
echo "DONE\n";
