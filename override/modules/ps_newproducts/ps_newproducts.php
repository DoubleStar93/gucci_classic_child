<?php
/**
 * Override ps_newproducts — link "Vedi tutto" per sezione homepage Gucci.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_NewproductsOverride extends Ps_Newproducts
{
    public function getWidgetVariables($hookName = null, array $configuration = [])
    {
        $variables = parent::getWidgetVariables($hookName, $configuration);

        if (!is_array($variables)) {
            $variables = [];
        }

        $variables['allProductsLink'] = $this->context->link->getPageLink('new-products');

        return $variables;
    }
}
