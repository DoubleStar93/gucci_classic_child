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

$themeName = 'barbaraalvisi';
$lines = [];

try {
    $context = Context::getContext();
    if (!$context->shop || !Validate::isLoadedObject($context->shop)) {
        $idShop = (int) Configuration::get('PS_SHOP_DEFAULT') ?: 1;
        $context->shop = new Shop($idShop);
        Shop::setContext(Shop::CONTEXT_SHOP, $idShop);
    }
    if (!$context->employee) {
        $context->employee = new Employee();
    }
    if (!$context->language || !Validate::isLoadedObject($context->language)) {
        $idLang = (int) Configuration::get('PS_LANG_DEFAULT') ?: 1;
        $context->language = new Language($idLang);
    }

    $lines[] = 'shop id=' . (int) $context->shop->id;
    $lines[] = 'Prima PS_THEME_NAME=' . Configuration::get('PS_THEME_NAME');

    $builder = new PrestaShop\PrestaShop\Core\Addon\Theme\ThemeManagerBuilder($context, Db::getInstance());
    $themeManager = $builder->build();

    // Repository: is theme recognized?
    if (method_exists($themeManager, 'getThemeList') || true) {
        $repo = $builder->buildRepository($context->shop);
        $themes = $repo->getList();
        $names = [];
        foreach ($themes as $t) {
            $names[] = method_exists($t, 'getName') ? $t->getName() : (string) $t;
        }
        $lines[] = 'Themes found: ' . implode(', ', $names);
        $lines[] = 'Has barbaraalvisi: ' . ($repo->getInstanceByName($themeName) ? 'yes' : 'NO');
    }

    $ok = $themeManager->enable($themeName);
    $lines[] = 'enable => ' . var_export($ok, true);
    if (!$ok) {
        $errs = $themeManager->getErrors($themeName);
        $lines[] = 'errors: ' . print_r($errs, true);
    }

    $lines[] = 'Dopo PS_THEME_NAME=' . Configuration::get('PS_THEME_NAME');

    // Force DB anyway
    Db::getInstance()->execute(
        "UPDATE `" . _DB_PREFIX_ . "configuration` SET `value`='" . pSQL($themeName) . "' WHERE `name`='PS_THEME_NAME'"
    );
    Configuration::updateValue('PS_THEME_NAME', $themeName);
    $lines[] = 'Forced DB PS_THEME_NAME=' . Configuration::get('PS_THEME_NAME');

    exit(implode("\n", $lines) . "\n");
} catch (Throwable $e) {
    http_response_code(500);
    exit('ERRORE: ' . $e->getMessage() . "\n" . $e->getFile() . ':' . $e->getLine() . "\n");
}
