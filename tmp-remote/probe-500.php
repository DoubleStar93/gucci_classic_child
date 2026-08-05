<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');

$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
if ($token !== 'barbaraalvisi-theme-activate') {
    http_response_code(403);
    exit("Forbidden\n");
}

try {
    require __DIR__ . '/config/config.inc.php';

    echo "PS_THEME_NAME=" . Configuration::get('PS_THEME_NAME') . "\n";
    echo "_THEME_NAME_=" . (defined('_THEME_NAME_') ? _THEME_NAME_ : 'n/a') . "\n";
    echo "_PS_THEME_DIR_=" . (defined('_PS_THEME_DIR_') ? _PS_THEME_DIR_ : 'n/a') . "\n";
    echo "dir classic-gucci=" . (is_dir(_PS_ROOT_DIR_ . '/themes/classic-gucci') ? 'YES' : 'no') . "\n";
    echo "dir barbaraalvisi=" . (is_dir(_PS_ROOT_DIR_ . '/themes/barbaraalvisi') ? 'YES' : 'no') . "\n";
    echo "yml classic-gucci=" . (is_file(_PS_ROOT_DIR_ . '/themes/classic-gucci/config/theme.yml') ? 'YES' : 'no') . "\n";
    echo "yml barbaraalvisi=" . (is_file(_PS_ROOT_DIR_ . '/themes/barbaraalvisi/config/theme.yml') ? 'YES' : 'no') . "\n";
    echo "header barbaraalvisi=" . (is_file(_PS_ROOT_DIR_ . '/themes/barbaraalvisi/templates/_partials/header.tpl') ? 'YES' : 'no') . "\n";

    // Try loading theme repository / smarty compile path
    $themeName = Configuration::get('PS_THEME_NAME');
    $themePath = _PS_ROOT_DIR_ . '/themes/' . $themeName;
    if (!is_dir($themePath)) {
        echo "ERRORE: cartella tema attivo assente: {$themePath}\n";
    }

    // Simulate front bootstrap piece that often 500s
    $context = Context::getContext();
    if (!$context->shop) {
        $context->shop = new Shop((int) Configuration::get('PS_SHOP_DEFAULT') ?: 1);
        Shop::setContext(Shop::CONTEXT_SHOP, (int) $context->shop->id);
    }
    if (!$context->language) {
        $context->language = new Language((int) Configuration::get('PS_LANG_DEFAULT') ?: 1);
    }
    if (!$context->currency) {
        $context->currency = new Currency((int) Configuration::get('PS_CURRENCY_DEFAULT') ?: 1);
    }

    // Try ThemeRepository get active theme
    $builder = new PrestaShop\PrestaShop\Core\Addon\Theme\ThemeManagerBuilder($context, Db::getInstance());
    $repo = $builder->buildRepository($context->shop);
    try {
        $theme = $repo->getInstanceByName($themeName);
        echo "repo theme ok name=" . $theme->getName() . " dir=" . $theme->getDirectory() . "\n";
    } catch (Throwable $e) {
        echo "repo getInstanceByName FAIL: " . $e->getMessage() . "\n";
    }

    // Try Smarty fetch of layout
    try {
        $smarty = $context->smarty;
        if (!$smarty) {
            echo "smarty null\n";
        } else {
            echo "smarty ok\n";
        }
    } catch (Throwable $e) {
        echo "smarty FAIL: " . $e->getMessage() . "\n";
    }

    // Include front controller briefly
    try {
        if (!defined('_PS_ADMIN_DIR_')) {
            // FrontKernel style - just check theme assets path used by Link
        }
        echo "DONE probe\n";
    } catch (Throwable $e) {
        echo "front FAIL: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
    }
} catch (Throwable $e) {
    echo "BOOT FAIL: " . $e->getMessage() . "\n" . $e->getFile() . ':' . $e->getLine() . "\n" . $e->getTraceAsString() . "\n";
}
