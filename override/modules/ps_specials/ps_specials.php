<?php
/**
 * Override ps_specials — link "Vedi tutto" per sezione homepage Gucci.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_SpecialsOverride extends Ps_Specials
{
    public function getWidgetVariables($hookName = null, array $configuration = [])
    {
        $variables = parent::getWidgetVariables($hookName, $configuration);

        if (!is_array($variables)) {
            $variables = [];
        }

        $variables['allProductsLink'] = $this->context->link->getPageLink('prices-drop');

        return $variables;
    }
}
