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

echo "_THEME_NAME_=" . _THEME_NAME_ . "\n";
echo "PS_THEME_NAME=" . Configuration::get('PS_THEME_NAME') . "\n";

// Shop table columns related to theme
$cols = $db->executeS("SHOW COLUMNS FROM `{$p}shop`");
foreach ($cols as $c) {
    if (stripos($c['Field'], 'theme') !== false || stripos($c['Field'], 'name') !== false) {
        echo "shop.{$c['Field']}\n";
    }
}
$shops = $db->executeS("SELECT * FROM `{$p}shop`");
echo "shops=" . print_r($shops, true) . "\n";

// Find any config with classic-gucci
$hits = $db->executeS("SELECT name, value, id_shop FROM `{$p}configuration` WHERE value LIKE '%classic-gucci%' OR name LIKE '%THEME%' LIMIT 50");
echo "config theme-related:\n";
foreach ($hits as $h) {
    echo "  {$h['name']} shop={$h['id_shop']} = {$h['value']}\n";
}

// Check defines files
foreach ([
    'config/defines.inc.php',
    'config/defines_custom.inc.php',
    'app/config/parameters.php',
    'app/config/parameters.php.dist',
] as $rel) {
    $path = _PS_ROOT_DIR_ . '/' . $rel;
    if (!is_file($path)) {
        echo "$rel MISSING\n";
        continue;
    }
    $txt = file_get_contents($path);
    if (stripos($txt, 'THEME') !== false || stripos($txt, 'gucci') !== false || stripos($txt, 'barbara') !== false) {
        echo "=== $rel matches ===\n";
        foreach (preg_split('/\R/', $txt) as $i => $line) {
            if (stripos($line, 'THEME') !== false || stripos($line, 'gucci') !== false || stripos($line, 'barbara') !== false) {
                echo ($i + 1) . ': ' . trim($line) . "\n";
            }
        }
    } else {
        echo "$rel no theme refs\n";
    }
}

// How is theme resolved in this PS version?
echo "\nclass_exists Theme=" . (class_exists('Theme') ? 'yes' : 'no') . "\n";
if (isset(Context::getContext()->shop)) {
    $shop = Context::getContext()->shop;
    echo "shop->id=" . $shop->id . "\n";
    if (property_exists($shop, 'theme') || isset($shop->theme)) {
        try {
            $t = $shop->theme;
            echo "shop->theme type=" . (is_object($t) ? get_class($t) : gettype($t)) . "\n";
            if (is_object($t) && method_exists($t, 'getName')) {
                echo "shop->theme->getName=" . $t->getName() . "\n";
            }
        } catch (Throwable $e) {
            echo "shop->theme ERR " . $e->getMessage() . "\n";
        }
    }
}
