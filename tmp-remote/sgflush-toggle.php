<?php
if (!defined('_PS_VERSION_')) { exit; }
class EverpspopupSgflushModuleFrontController extends ModuleFrontController {
  public $display_header = false;
  public $display_footer = false;
  public function initContent() {
    header('Content-Type: text/plain; charset=utf-8');
    $t = 'barbaraalvisi-sgflush-' . substr(hash('sha256', 'barbaraalvisi-sg-flush-2026'), 0, 16);
    if (Tools::getValue('token') !== $t) { http_response_code(403); exit('Forbidden'); }
    $v = Tools::getValue('enable');
    if ($v === '0' || $v === '1') {
      Configuration::updateValue('PS_SHOP_ENABLE', $v);
      Db::getInstance()->execute(
        'UPDATE `' . _DB_PREFIX_ . "configuration` SET `value`='" . pSQL($v) . "' WHERE `name`='PS_SHOP_ENABLE'"
      );
    }
    echo 'PS_SHOP_ENABLE=' . Configuration::get('PS_SHOP_ENABLE') . "\n";
    exit;
  }
}
