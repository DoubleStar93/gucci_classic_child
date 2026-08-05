<?php
/**
 * Switch sicuro a tema barbaraalvisi + modulo categorie.
 * Non elimina classic-gucci (rollback manuale possibile).
 */
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

    $themeDir = _PS_ROOT_DIR_ . '/themes/' . $themeName;
    if (!is_file($themeDir . '/config/theme.yml')) {
        exit("ERRORE: manca themes/{$themeName}/config/theme.yml\n");
    }
    $yml = file_get_contents($themeDir . '/config/theme.yml');
    if (strpos($yml, 'cart_default:') === false) {
        exit("ERRORE: theme.yml senza image_types.cart_default\n");
    }
    $lines[] = 'OK: theme.yml con image_types';

    // Pulisci solo metadata legacy classic-gucci in config/themes (non la cartella tema)
    $cfgThemes = _PS_ROOT_DIR_ . '/config/themes';
    if (is_dir($cfgThemes . '/classic-gucci')) {
        $path = $cfgThemes . '/classic-gucci';
        $it = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($it as $file) {
            $file->isDir() ? @rmdir($file->getPathname()) : @unlink($file->getPathname());
        }
        @rmdir($path);
        $lines[] = 'OK: rimosso config/themes/classic-gucci metadata';
    }

    $lines[] = 'Prima PS_THEME_NAME=' . Configuration::get('PS_THEME_NAME');

    $builder = new PrestaShop\PrestaShop\Core\Addon\Theme\ThemeManagerBuilder($context, Db::getInstance());
    $themeManager = $builder->build();

    // Forza refresh repository: cancella shop1.json barbaraalvisi se vecchio
    $shopJson = _PS_ROOT_DIR_ . '/config/themes/barbaraalvisi/shop1.json';
    if (is_file($shopJson)) {
        @unlink($shopJson);
        $lines[] = 'OK: invalidato config/themes/barbaraalvisi/shop1.json';
    }

    $ok = $themeManager->enable($themeName);
    $lines[] = 'ThemeManager::enable => ' . var_export($ok, true);
    if (!$ok) {
        $errs = $themeManager->getErrors($themeName);
        $lines[] = 'errors: ' . print_r($errs, true);
        // Fallback DB se enable fallisce ma tema è valido
        Db::getInstance()->execute(
            "UPDATE `" . _DB_PREFIX_ . "configuration` SET `value`='" . pSQL($themeName) . "' WHERE `name`='PS_THEME_NAME'"
        );
        Configuration::updateValue('PS_THEME_NAME', $themeName);
        $lines[] = 'FALLBACK: PS_THEME_NAME forzato a barbaraalvisi';
    }

    $lines[] = 'Dopo PS_THEME_NAME=' . Configuration::get('PS_THEME_NAME');

    // Modulo categorie: attiva barbaraalvisi, scollega gucci
    if (Module::isInstalled('gucci_homecategories')) {
        $legacy = Module::getInstanceByName('gucci_homecategories');
        if ($legacy && $legacy->id) {
            $legacy->unregisterHook('displayHome');
            $legacy->unregisterHook('actionFrontControllerSetVariables');
            if ($legacy->uninstall()) {
                $lines[] = 'OK: gucci_homecategories disinstallato';
            } else {
                $legacy->disable();
                $lines[] = 'WARN: gucci_homecategories disabilitato (uninstall fallito)';
            }
        }
    } else {
        $lines[] = 'OK: gucci_homecategories non installato';
    }

    $module = Module::getInstanceByName('barbaraalvisi_homecategories');
    if (!$module) {
        $lines[] = 'ERRORE: modulo barbaraalvisi_homecategories non in /modules';
    } elseif (!$module->id) {
        if ($module->install()) {
            $lines[] = "OK: barbaraalvisi_homecategories installato (id {$module->id})";
        } else {
            $lines[] = 'ERRORE install modulo: ' . implode(', ', $module->getErrors());
        }
    } else {
        $module->enable();
        $module->ensureHooks();
        $lines[] = "OK: barbaraalvisi_homecategories attivo (id {$module->id})";
    }

    if ($module && $module->id) {
        $lines[] = 'hook displayHome=' . ($module->isRegisteredInHook('displayHome') ? 'yes' : 'NO');
    }

    exit(implode("\n", $lines) . "\n");
} catch (Throwable $e) {
    http_response_code(500);
    exit('ERRORE: ' . $e->getMessage() . "\n" . $e->getFile() . ':' . $e->getLine() . "\n");
}
