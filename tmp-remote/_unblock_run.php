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

$root = __DIR__;
$lines = [];

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

function isStash(string $name): bool
{
    return str_starts_with($name, '_stash-') || str_starts_with($name, '_stash_');
}

$parents = [$root, $root . '/var', $root . '/var/cache', $root . '/themes', $root . '/_theme_stash'];
$folders = 0;
$nodes = 0;

foreach ($parents as $parent) {
    if (!is_dir($parent)) {
        $lines[] = "SKIP $parent";
        continue;
    }
    foreach (@scandir($parent) ?: [] as $name) {
        if ($name === '.' || $name === '..') {
            continue;
        }
        if (!isStash($name)) {
            continue;
        }
        $path = $parent . '/' . $name;
        if (!is_dir($path)) {
            continue;
        }
        $n = rrmdir($path);
        $folders++;
        $nodes += $n;
        $lines[] = "OK stash $path ~$n";
    }
}

$themeStash = $root . '/_theme_stash';
if (is_dir($themeStash)) {
    $n = rrmdir($themeStash);
    $nodes += $n;
    $lines[] = "OK rmdir _theme_stash ~$n";
}

$prod = $root . '/var/cache/prod';
if (is_dir($prod)) {
    $n = rrmdir($prod);
    $nodes += $n;
    $lines[] = "OK cleared prod ~$n";
}
@mkdir($prod, 0755, true);

$lines[] = "FOLDERS=$folders NODES~$nodes PROD_RECREATED=" . (is_dir($prod) ? 'yes' : 'no');
@unlink(__FILE__);
echo implode("\n", $lines) . "\nDONE\n";
