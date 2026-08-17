<?php
/**
 * One-shot: sblocca shop (esci manutenzione) + ripulisce cache Symfony/Smarty.
 * Upload in public_html, esegui con ?token=..., poi elimina.
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');

$tokenExpected = 'b22cf84a21492695db48ea2c33d039e7';
$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
if (!hash_equals($tokenExpected, $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

require __DIR__ . '/config/config.inc.php';

$db = Db::getInstance();
$p = _DB_PREFIX_;
$lines = [];

try {
    $beforeEnable = (string) Configuration::get('PS_SHOP_ENABLE');
    $beforeIp = (string) Configuration::get('PS_MAINTENANCE_IP');
    $lines[] = "PS_SHOP_ENABLE prima={$beforeEnable}";
    $lines[] = 'PS_MAINTENANCE_IP prima=' . ($beforeIp === '' ? '(vuoto)' : $beforeIp);

    Configuration::updateValue('PS_SHOP_ENABLE', 1);
    // Non forzare IP: negozio aperto a tutti
    $db->execute(
        "UPDATE `{$p}configuration` SET `value` = '1' WHERE `name` = 'PS_SHOP_ENABLE'"
    );

    $lines[] = 'PS_SHOP_ENABLE dopo=' . Configuration::get('PS_SHOP_ENABLE');

    // Svuota cache Symfony (prod) e Smarty compile se possibile
    $cacheRoot = _PS_ROOT_DIR_ . '/var/cache';
    $removed = [];
    if (is_dir($cacheRoot)) {
        foreach (['prod', 'dev'] as $env) {
            $path = $cacheRoot . '/' . $env;
            if (!is_dir($path)) {
                continue;
            }
            $stash = $cacheRoot . '/_stash-unlock-' . $env . '-' . bin2hex(random_bytes(4));
            if (@rename($path, $stash)) {
                $removed[] = basename($stash);
                @mkdir($path, 0775, true);
            } else {
                $lines[] = "WARN: impossibile rinominare {$path}";
            }
        }
    }
    $lines[] = 'cache stash: ' . (count($removed) ? implode(', ', $removed) : '(nessuna)');

    // Soft clear class_index if present
    $classIndex = _PS_ROOT_DIR_ . '/var/cache/prod/class_index.php';
    if (is_file($classIndex)) {
        @unlink($classIndex);
        $lines[] = 'class_index.php rimosso';
    }

    $lines[] = 'OK: shop riaperto + cache invalidata';
    exit(implode("\n", $lines) . "\n");
} catch (Throwable $e) {
    http_response_code(500);
    exit('ERRORE: ' . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n");
}
