<?php
/**
 * Attiva/disattiva manutenzione.
 * URL: /index.php?fc=module&module=everpspopup&controller=sgflush&token=...&enable=0|1
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class EverpspopupSgflushModuleFrontController extends ModuleFrontController
{
    public $display_header = false;
    public $display_footer = false;

    public function initContent()
    {
        header('Content-Type: text/plain; charset=utf-8');

        $token = 'barbaraalvisi-sgflush-' . substr(hash('sha256', 'barbaraalvisi-sg-flush-2026'), 0, 16);
        if (Tools::getValue('token') !== $token) {
            header('HTTP/1.1 403 Forbidden');
            echo "Forbidden\n";
            exit;
        }

        $enable = Tools::getValue('enable');
        if ($enable === '0' || $enable === '1') {
            Configuration::updateValue('PS_SHOP_ENABLE', $enable);
            Db::getInstance()->execute(
                'UPDATE `' . _DB_PREFIX_ . "configuration` SET `value`='" . pSQL($enable) . "' WHERE `name`='PS_SHOP_ENABLE'"
            );
        }

        $rows = Db::getInstance()->executeS(
            'SELECT id_shop, id_shop_group, value FROM `' . _DB_PREFIX_ . "configuration` WHERE name='PS_SHOP_ENABLE'"
        );
        foreach ($rows as $r) {
            echo 'PS_SHOP_ENABLE shop=' . var_export($r['id_shop'], true)
                . ' group=' . var_export($r['id_shop_group'], true)
                . ' value=' . var_export($r['value'], true) . "\n";
        }

        if ($enable === '0') {
            echo "Manutenzione ATTIVA\n";
        } elseif ($enable === '1') {
            echo "Shop APERTO\n";
        }

        exit;
    }
}
