<?php
/**
 * Override ps_shoppingcart — variabili spedizione Gucci nel modal add-to-cart.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_ShoppingcartOverride extends Ps_Shoppingcart
{
    public function renderModal($id_product, $id_product_attribute, $id_customization)
    {
        $this->assignGucciCartShippingVars();

        return parent::renderModal($id_product, $id_product_attribute, $id_customization);
    }

    private function assignGucciCartShippingVars(): void
    {
        if (empty($this->context->cart) || !Validate::isLoadedObject($this->context->cart)) {
            return;
        }

        $classFile = _PS_THEME_DIR_ . 'classes/GucciCartShipping.php';
        if (!is_file($classFile)) {
            $classFile = _PS_ROOT_DIR_ . '/themes/classic-gucci/classes/GucciCartShipping.php';
        }

        if (!is_file($classFile)) {
            return;
        }

        require_once $classFile;

        if (class_exists('GucciCartShipping', false)) {
            GucciCartShipping::assignCartShippingVars($this->context->cart, $this->context);
        }
    }
}
