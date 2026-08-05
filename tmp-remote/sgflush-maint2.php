<?php
if (!defined('_PS_VERSION_')) { exit; }
class EverpspopupSgflushModuleFrontController extends ModuleFrontController {
  public $display_header = false;
  public $display_footer = false;
  public function initContent() {
    header('Content-Type: text/plain; charset=utf-8');
    $token = 'barbaraalvisi-sgflush-' . substr(hash('sha256', 'barbaraalvisi-sg-flush-2026'), 0, 16);
    if (Tools::getValue('token') !== $token) {
      header('HTTP/1.1 403 Forbidden');
      echo "Forbidden\n";
      exit;
    }
    Configuration::updateValue('PS_SHOP_ENABLE', '0');
    Db::getInstance()->execute(
      'UPDATE `' . _DB_PREFIX_ . "configuration` SET `value`='0' WHERE `name`='PS_SHOP_ENABLE'"
    );
    if (Tools::getValue('clear_ip') === '1') {
      Configuration::updateValue('PS_MAINTENANCE_IP', '');
      Db::getInstance()->execute(
        'UPDATE `' . _DB_PREFIX_ . "configuration` SET `value`='' WHERE `name`='PS_MAINTENANCE_IP'"
      );
      echo "PS_MAINTENANCE_IP cleared\n";
    }
    $rows = Db::getInstance()->executeS(
      'SELECT name, id_shop, id_shop_group, value FROM `' . _DB_PREFIX_ .
      "configuration` WHERE name IN ('PS_SHOP_ENABLE','PS_MAINTENANCE_IP')"
    );
    foreach ($rows as $r) {
      echo $r['name'] . ' shop=' . var_export($r['id_shop'], true) .
        ' value=' . var_export($r['value'], true) . "\n";
    }
    echo 'remote_addr=' . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";
    echo "Manutenzione ATTIVA\n";
    exit;
  }
}
