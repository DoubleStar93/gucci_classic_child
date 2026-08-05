<?php
/**
 * Diagnostica spedizione carrello — front controller (passa WAF SiteGround).
 *
 * URL: /module/everpspopup/shippingdiag?token=barbaraalvisi-diag-...
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

require_once _PS_MODULE_DIR_ . 'everpspopup/lib/barbaraalvisi-shipping-diag.php';

class EverpspopupShippingdiagModuleFrontController extends ModuleFrontController
{
    public $display_header = false;
    public $display_footer = false;

    public function init()
    {
        $token = 'barbaraalvisi-diag-' . substr(hash('sha256', 'barbaraalvisi-shipping-diag-2026'), 0, 16);
        if (Tools::getValue('token') !== $token) {
            header('HTTP/1.1 403 Forbidden');
            header('Content-Type: text/plain; charset=utf-8');
            echo "Forbidden. Usa: ?token={$token}\n";
            exit;
        }

        parent::init();
    }

    public function initContent()
    {
        header('Content-Type: text/plain; charset=utf-8');

        $requestedCartId = (int) Tools::getValue('id_cart');
        barbaraalvisi_run_shipping_diagnostic($this->context, $requestedCartId > 0 ? $requestedCartId : null);

        exit;
    }
}
