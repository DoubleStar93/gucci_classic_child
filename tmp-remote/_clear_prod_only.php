<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('max_execution_time', '600');
header('Content-Type: text/plain; charset=utf-8');

$tokenExpected = 'TOKEN_PLACEHOLDER';
$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
if (!hash_equals($tokenExpected, $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

function rrmdir(string $dir): int
{
    $n = 0;
    if (!is_dir($dir)) {
        return 0;
    }
    $items = @scandir($dir);
    if ($items === false) {
        return 0;
    }
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }
        $path = $dir . DIRECTORY_SEPARATOR . $item;
        if (is_dir($path) && !is_link($path)) {
            $n += rrmdir($path);
        } elseif (@unlink($path)) {
            $n++;
        }
    }
    if (@rmdir($dir)) {
        $n++;
    }
    return $n;
}

$prod = __DIR__ . '/var/cache/prod';
$n = 0;
if (is_dir($prod)) {
    $n = rrmdir($prod);
}
@mkdir($prod, 0755, true);
@unlink(__FILE__);
echo "OK cleared prod ~$n PROD_RECREATED=" . (is_dir($prod) ? 'yes' : 'no') . "\nDONE\n";
