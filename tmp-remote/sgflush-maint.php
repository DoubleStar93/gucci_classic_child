<?php
/**
 * Temporary: diagnose/fix maintenance. Token same as sgflush.
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

        $p = _DB_PREFIX_;
        $db = Db::getInstance();
        $rows = $db->executeS(
            "SELECT id_configuration, id_shop, id_shop_group, name, value
             FROM `{$p}configuration`
             WHERE name IN ('PS_SHOP_ENABLE','PS_MAINTENANCE_IP','PS_THEME_NAME')
             ORDER BY name, id_shop"
        );
        foreach ($rows as $r) {
            echo $r['name']
                . ' shop=' . var_export($r['id_shop'], true)
                . ' group=' . var_export($r['id_shop_group'], true)
                . ' value=' . $r['value'] . "\n";
        }
        echo '_THEME_NAME_=' . (defined('_THEME_NAME_') ? _THEME_NAME_ : 'n/a') . "\n";
        echo 'theme barbaraalvisi=' . (is_dir(_PS_ROOT_DIR_ . '/themes/barbaraalvisi') ? 'yes' : 'no') . "\n";
        echo 'theme classic=' . (is_dir(_PS_ROOT_DIR_ . '/themes/classic') ? 'yes' : 'no') . "\n";

        if (Tools::getValue('fix') === '1') {
            Configuration::updateValue('PS_SHOP_ENABLE', '1');
            $db->execute("UPDATE `{$p}configuration` SET `value`='1' WHERE `name`='PS_SHOP_ENABLE'");
            echo "FIXED PS_SHOP_ENABLE=1\n";
        }

        exit;
    }
}
