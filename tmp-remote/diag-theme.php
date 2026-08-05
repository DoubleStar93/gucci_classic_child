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

echo "_THEME_NAME_=" . (defined('_THEME_NAME_') ? _THEME_NAME_ : 'n/a') . "\n";
echo "_PS_THEME_DIR_=" . (defined('_PS_THEME_DIR_') ? _PS_THEME_DIR_ : 'n/a') . "\n";
echo "_PS_PARENT_THEME_DIR_=" . (defined('_PS_PARENT_THEME_DIR_') ? _PS_PARENT_THEME_DIR_ : 'n/a') . "\n";
echo "Configuration PS_THEME_NAME=" . Configuration::get('PS_THEME_NAME') . "\n";
echo "theme.yml exists barbaraalvisi=" . (is_file(_PS_ROOT_DIR_ . '/themes/barbaraalvisi/config/theme.yml') ? 'yes' : 'no') . "\n";
echo "header.tpl barbaraalvisi=" . (is_file(_PS_ROOT_DIR_ . '/themes/barbaraalvisi/templates/_partials/header.tpl') ? 'yes' : 'no') . "\n";
echo "header.tpl classic=" . (is_file(_PS_ROOT_DIR_ . '/themes/classic/templates/_partials/header.tpl') ? 'yes' : 'no') . "\n";

// Find config/themes json
$cfgThemes = _PS_ROOT_DIR_ . '/config/themes';
if (is_dir($cfgThemes)) {
    echo "config/themes:\n";
    foreach (scandir($cfgThemes) as $f) {
        if ($f === '.' || $f === '..') {
            continue;
        }
        echo " - $f\n";
        $path = $cfgThemes . '/' . $f;
        if (is_file($path) && preg_match('/\\.json$/', $f)) {
            echo '   ' . substr(file_get_contents($path), 0, 300) . "\n";
        } elseif (is_dir($path)) {
            foreach (scandir($path) as $sf) {
                if (preg_match('/\\.json$/', $sf)) {
                    $jp = $path . '/' . $sf;
                    echo "   $sf: " . substr(file_get_contents($jp), 0, 200) . "\n";
                }
            }
        }
    }
}

// Try ThemeRepository getInstanceByName
try {
    $context = Context::getContext();
    if (!$context->shop) {
        $context->shop = new Shop((int) Configuration::get('PS_SHOP_DEFAULT') ?: 1);
    }
    $builder = new PrestaShop\PrestaShop\Core\Addon\Theme\ThemeManagerBuilder($context, Db::getInstance());
    $repo = $builder->buildRepository($context->shop);
    $theme = $repo->getInstanceByName('barbaraalvisi');
    if ($theme) {
        echo "Theme object name=" . $theme->getName() . "\n";
        echo "Theme directory=" . $theme->getDirectory() . "\n";
        if (method_exists($theme, 'get') ) {
            //
        }
        echo "Theme attributes name=" . (method_exists($theme, 'get') ? '' : '') . "\n";
        $attrs = method_exists($theme, 'getAttributes') ? $theme->getAttributes() : null;
        if (is_array($attrs)) {
            echo 'attr name=' . ($attrs['name'] ?? '?') . ' parent=' . ($attrs['parent'] ?? '?') . "\n";
        }
    }
} catch (Throwable $e) {
    echo 'repo error: ' . $e->getMessage() . "\n";
}
