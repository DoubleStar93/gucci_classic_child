<?php
/**
 * One-shot: elimina cartelle _stash-* / _theme_stash content via filesystem (veloce).
 */
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

function isStashName(string $name): bool
{
    return str_starts_with($name, '_stash-')
        || str_starts_with($name, '_stash_');
}

function rrmdir(string $dir): int
{
    $count = 0;
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
            $count += rrmdir($path);
        } else {
            if (@unlink($path)) {
                $count++;
            }
        }
    }
    if (@rmdir($dir)) {
        $count++;
    }
    return $count;
}

$scanParents = [
    $root,
    $root . '/var',
    $root . '/var/cache',
    $root . '/themes',
    $root . '/_theme_stash',
];

$totalRemoved = 0;
$totalFiles = 0;

foreach ($scanParents as $parent) {
    if (!is_dir($parent)) {
        $lines[] = "SKIP (assente): {$parent}";
        continue;
    }
    $entries = @scandir($parent) ?: [];
    foreach ($entries as $name) {
        if ($name === '.' || $name === '..') {
            continue;
        }
        if (!isStashName($name)) {
            continue;
        }
        $path = $parent . '/' . $name;
        if (!is_dir($path)) {
            continue;
        }
        $n = rrmdir($path);
        $totalRemoved++;
        $totalFiles += $n;
        $lines[] = "OK rimosso: {$path} (~{$n} nodi)";
    }
}

// Svuota _theme_stash se resta vuota o con residui non-_stash
$themeStash = $root . '/_theme_stash';
if (is_dir($themeStash)) {
    $kids = array_values(array_filter(@scandir($themeStash) ?: [], static fn ($n) => $n !== '.' && $n !== '..'));
    if (!$kids) {
        $lines[] = 'OK _theme_stash già vuota';
    } else {
        foreach ($kids as $name) {
            $path = $themeStash . '/' . $name;
            if (is_dir($path)) {
                $n = rrmdir($path);
                $totalRemoved++;
                $totalFiles += $n;
                $lines[] = "OK rimosso da _theme_stash: {$name} (~{$n} nodi)";
            } else {
                if (@unlink($path)) {
                    $totalFiles++;
                    $lines[] = "OK file rimosso: {$path}";
                }
            }
        }
    }
}

$lines[] = "TOTALE cartelle stash: {$totalRemoved}, nodi rimossi ~{$totalFiles}";
$lines[] = 'OK: pulizia stash completata';
exit(implode("\n", $lines) . "\n");
