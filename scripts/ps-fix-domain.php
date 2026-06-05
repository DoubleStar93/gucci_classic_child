<?php
/**
 * One-time PrestaShop domain fix after Hostinger → SiteGround migration.
 * Delete this file immediately after use.
 */
declare(strict_types=1);

$token = 'gucci-fix-' . substr(hash('sha256', 'barbaraalvisi-domain-fix-2026'), 0, 16);
if (($_GET['token'] ?? '') !== $token) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Forbidden. Use ?token={$token}\n";
    exit;
}

header('Content-Type: text/plain; charset=utf-8');

$paramsFile = dirname(__DIR__) . '/app/config/parameters.php';
if (!is_file($paramsFile)) {
    echo "parameters.php not found\n";
    exit(1);
}

$params = require $paramsFile;
$p = $params['parameters'];
$prefix = $p['database_prefix'];
$targetDomain = 'barbaraalvisi.it';

$mysqli = new mysqli(
    $p['database_host'],
    $p['database_user'],
    $p['database_password'],
    $p['database_name']
);

if ($mysqli->connect_error) {
    echo 'DB connect error: ' . $mysqli->connect_error . "\n";
    exit(1);
}

$mysqli->set_charset('utf8mb4');

function fetchConfig(mysqli $db, string $prefix, array $names): array
{
    $in = "'" . implode("','", array_map([$db, 'real_escape_string'], $names)) . "'";
    $result = $db->query("SELECT name, value FROM {$prefix}configuration WHERE name IN ({$in})");
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[$row['name']] = $row['value'];
    }
    return $rows;
}

echo "=== BEFORE ===\n";
$keys = [
    'PS_SHOP_DOMAIN',
    'PS_SHOP_DOMAIN_SSL',
    'PS_SSL_ENABLED',
    'PS_MEDIA_SERVER_1',
    'PS_MEDIA_SERVER_2',
    'PS_MEDIA_SERVER_3',
];
$before = fetchConfig($mysqli, $prefix, $keys);
foreach ($keys as $key) {
    echo "{$key}: " . ($before[$key] ?? '(missing)') . "\n";
}

echo "\nShop URLs BEFORE:\n";
$shopUrls = $mysqli->query("SELECT id_shop_url, domain, domain_ssl, physical_uri, virtual_uri, main FROM {$prefix}shop_url");
while ($row = $shopUrls->fetch_assoc()) {
    echo json_encode($row, JSON_UNESCAPED_SLASHES) . "\n";
}

$updates = [
    'PS_SHOP_DOMAIN' => $targetDomain,
    'PS_SHOP_DOMAIN_SSL' => $targetDomain,
    'PS_SSL_ENABLED' => '1',
    'PS_MEDIA_SERVER_1' => '',
    'PS_MEDIA_SERVER_2' => '',
    'PS_MEDIA_SERVER_3' => '',
];

foreach ($updates as $name => $value) {
    $stmt = $mysqli->prepare("UPDATE {$prefix}configuration SET value = ? WHERE name = ?");
    $stmt->bind_param('ss', $value, $name);
    $stmt->execute();
    echo "\nUpdated {$name} (rows: {$stmt->affected_rows})";
    $stmt->close();
}

$mysqli->query(
    "UPDATE {$prefix}shop_url SET domain = '{$targetDomain}', domain_ssl = '{$targetDomain}'"
);
echo "\nUpdated shop_url rows: " . $mysqli->affected_rows;

$htaccess = dirname(__DIR__) . '/.htaccess';
if (is_file($htaccess)) {
    $content = file_get_contents($htaccess);
    $newContent = preg_replace(
        '/#Domain: .+/',
        '#Domain: ' . $targetDomain,
        $content,
        1,
        $count
    );
    if ($count > 0 && $newContent !== $content) {
        file_put_contents($htaccess, $newContent);
        echo "\nUpdated .htaccess Domain comment";
    } else {
        echo "\n.htaccess Domain comment unchanged";
    }
}

$cacheDirs = [
    dirname(__DIR__) . '/var/cache',
    dirname(__DIR__) . '/cache',
];
foreach ($cacheDirs as $dir) {
    if (!is_dir($dir)) {
        continue;
    }
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    $removed = 0;
    foreach ($iterator as $item) {
        if ($item->isDir()) {
            @rmdir($item->getPathname());
        } else {
            if (@unlink($item->getPathname())) {
                ++$removed;
            }
        }
    }
    echo "\nCleared cache files in {$dir}: {$removed}";
}

echo "\n\n=== AFTER ===\n";
$after = fetchConfig($mysqli, $prefix, $keys);
foreach ($keys as $key) {
    echo "{$key}: " . ($after[$key] ?? '(missing)') . "\n";
}

echo "\nShop URLs AFTER:\n";
$shopUrls = $mysqli->query("SELECT id_shop_url, domain, domain_ssl, physical_uri, virtual_uri, main FROM {$prefix}shop_url");
while ($row = $shopUrls->fetch_assoc()) {
    echo json_encode($row, JSON_UNESCAPED_SLASHES) . "\n";
}

@unlink(__FILE__);
echo "\n\nDone. Script self-deleted.\n";
echo "Retry login: https://{$targetDomain}/l1ka80lkkixgfknd/index.php/login\n";
