<?php
/**
 * One-shot: reinstalla / ripara everpspopup dopo upload FTP. Eliminato subito dopo l'uso.
 */
declare(strict_types=1);

use PrestaShop\PrestaShop\Core\Util\CacheClearLocker;

$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
if (!preg_match('/^[a-f0-9]{32}$/', $token)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    exit('Forbidden');
}

$root = dirname(__FILE__);

function gucciFindAdminDir(string $shopRoot): ?string
{
    foreach (scandir($shopRoot) as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }

        $path = $shopRoot . DIRECTORY_SEPARATOR . $entry;
        if (!is_dir($path)) {
            continue;
        }

        if (is_file($path . '/index.php') && is_dir($path . '/themes/default')) {
            return $path;
        }
    }

    return null;
}

$adminDir = gucciFindAdminDir($root);
if (!$adminDir) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    exit('FAIL: admin directory not found');
}

define('_PS_ADMIN_DIR_', $adminDir);

$config = $root . '/config/config.inc.php';
if (!is_file($config)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    exit('config.inc.php not found');
}

require $config;

if (class_exists('AdminKernel')) {
    define('_PS_APP_ID_', AdminKernel::APP_ID);
    require_once $root . '/autoload.php';

    if (class_exists(CacheClearLocker::class)) {
        CacheClearLocker::waitUntilUnlocked(_PS_ENV_, _PS_APP_ID_);
    }

    $kernel = new AdminKernel(_PS_ENV_, _PS_MODE_DEV_);
    $kernel->boot();

    if (class_exists('Context')) {
        Context::getContext()->container = $kernel->getContainer();
    }
} else {
    $init = $root . '/init.php';
    if (is_file($init)) {
        require $init;
    }

    if (is_file($root . '/app/AppKernel.php')) {
        require_once $root . '/app/AppKernel.php';
        $env = defined('_PS_ENV_') ? _PS_ENV_ : 'prod';
        $debug = defined('_PS_MODE_DEV_') ? (bool) _PS_MODE_DEV_ : false;
        $kernel = new AppKernel($env, $debug);
        $kernel->boot();
        if (class_exists('Context')) {
            Context::getContext()->container = $kernel->getContainer();
        }
    }
}

if (class_exists('Context') && class_exists('Employee') && class_exists('Db')) {
    $employeeId = (int) Db::getInstance()->getValue(
        'SELECT `id_employee` FROM `' . _DB_PREFIX_ . 'employee` WHERE `active` = 1 ORDER BY `id_employee` ASC'
    );

    if ($employeeId > 0) {
        Context::getContext()->employee = new Employee($employeeId);
    }
}

header('Content-Type: text/plain; charset=utf-8');

if (!class_exists('Module') || !class_exists('Db')) {
    exit('FAIL: PrestaShop not loaded');
}

$module = Module::getInstanceByName('everpspopup');
if (!$module) {
    exit('FAIL: everpspopup files missing in modules/');
}

$force = isset($_GET['force']) && $_GET['force'] === '1';

$popupCount = 0;
try {
    $popupCount = (int) Db::getInstance()->getValue(
        'SELECT COUNT(*) FROM `' . _DB_PREFIX_ . 'everpspopup`'
    );
} catch (Exception $exception) {
    $popupCount = 0;
}

$needsReinstall = $force || !Module::isInstalled('everpspopup') || $popupCount === 0;

if (Module::isInstalled('everpspopup') && $needsReinstall) {
    if (!$module->uninstall()) {
        exit('FAIL uninstall: ' . implode(' | ', (array) $module->getErrors()));
    }
}

if (!Module::isInstalled('everpspopup')) {
    if (!$module->install()) {
        exit('FAIL install: ' . implode(' | ', (array) $module->getErrors()));
    }
}

$module = Module::getInstanceByName('everpspopup');
if (!$module) {
    exit('FAIL: everpspopup instance missing after install');
}

if (!Module::isEnabled($module->name)) {
    if (!$module->enable()) {
        exit('FAIL enable: ' . implode(' | ', (array) $module->getErrors()));
    }
}

if (class_exists('Tools') && method_exists('Tools', 'clearAllCache')) {
    Tools::clearAllCache();
}

$popupCount = (int) Db::getInstance()->getValue(
    'SELECT COUNT(*) FROM `' . _DB_PREFIX_ . 'everpspopup`'
);

exit('OK active=' . (int) Module::isEnabled($module->name) . ' popups=' . $popupCount);
