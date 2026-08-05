<?php
/**
 * One-shot: attiva tema barbaraalvisi (ps_shop.theme_name + PS_THEME_NAME) e modulo categorie.
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
$db = Db::getInstance();
$p = _DB_PREFIX_;
$lines = [];

try {
    if (!is_file(_PS_ROOT_DIR_ . '/themes/' . $themeName . '/config/theme.yml')) {
        exit("ERRORE: themes/{$themeName}/config/theme.yml mancante\n");
    }

    $beforeShop = (string) $db->getValue("SELECT theme_name FROM `{$p}shop` WHERE id_shop = 1");
    $lines[] = "shop.theme_name prima={$beforeShop}";

    $db->execute("UPDATE `{$p}shop` SET `theme_name` = '" . pSQL($themeName) . "' WHERE `id_shop` = 1");
    $db->execute("UPDATE `{$p}configuration` SET `value` = '" . pSQL($themeName) . "' WHERE `name` = 'PS_THEME_NAME'");
    Configuration::updateValue('PS_THEME_NAME', $themeName);

    $lines[] = 'shop.theme_name dopo=' . $db->getValue("SELECT theme_name FROM `{$p}shop` WHERE id_shop = 1");
    $lines[] = 'PS_THEME_NAME=' . Configuration::get('PS_THEME_NAME');

    if (Module::isInstalled('gucci_homecategories')) {
        $legacy = Module::getInstanceByName('gucci_homecategories');
        if ($legacy && $legacy->id) {
            $legacy->unregisterHook('displayHome');
            $legacy->unregisterHook('actionFrontControllerSetVariables');
            if ($legacy->uninstall()) {
                $lines[] = 'OK: gucci_homecategories disinstallato';
            } else {
                $legacy->disable();
                $lines[] = 'WARN: gucci_homecategories disabilitato';
            }
        }
    }

    $module = Module::getInstanceByName('barbaraalvisi_homecategories');
    if (!$module) {
        $lines[] = 'ERRORE: modulo barbaraalvisi_homecategories non trovato';
    } elseif (!$module->id) {
        if ($module->install()) {
            $lines[] = "OK: barbaraalvisi_homecategories installato (id {$module->id})";
        } else {
            $lines[] = 'ERRORE install: ' . implode(', ', $module->getErrors());
        }
    } else {
        $module->enable();
        if (method_exists($module, 'ensureHooks')) {
            $module->ensureHooks();
        }
        $lines[] = "OK: barbaraalvisi_homecategories attivo (id {$module->id})";
    }

    if ($module && $module->id) {
        $lines[] = 'hook displayHome=' . ($module->isRegisteredInHook('displayHome') ? 'yes' : 'NO');
    }

    exit(implode("\n", $lines) . "\n");
} catch (Throwable $e) {
    http_response_code(500);
    exit('ERRORE: ' . $e->getMessage() . "\n");
}
