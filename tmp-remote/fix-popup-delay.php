<?php
require __DIR__ . '/config/config.inc.php';
header('Content-Type: text/plain; charset=utf-8');
$token = $_GET['token'] ?? '';
if ($token !== 'barbaraalvisi-theme-activate') {
    http_response_code(403);
    exit("Forbidden\n");
}

$db = Db::getInstance();
$p = _DB_PREFIX_;

$before = $db->executeS("SELECT id_everpspopup, delay, cookie_time, active FROM `{$p}everpspopup`");
echo "BEFORE:\n";
foreach ($before as $r) {
    echo " id={$r['id_everpspopup']} delay={$r['delay']} cookie={$r['cookie_time']} active={$r['active']}\n";
}

$db->execute("UPDATE `{$p}everpspopup` SET `delay` = 3000 WHERE `delay` > 5000");

$after = $db->executeS("SELECT id_everpspopup, delay, cookie_time, active FROM `{$p}everpspopup`");
echo "AFTER:\n";
foreach ($after as $r) {
    echo " id={$r['id_everpspopup']} delay={$r['delay']} cookie={$r['cookie_time']} active={$r['active']}\n";
}
echo "DONE\n";
