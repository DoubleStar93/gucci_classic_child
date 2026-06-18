<?php
/**
 * Override ps_featuredproducts — link "Vedi tutto" per sezione homepage Gucci.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_FeaturedproductsOverride extends Ps_Featuredproducts
{
    public function getWidgetVariables($hookName = null, array $configuration = [])
    {
        $variables = parent::getWidgetVariables($hookName, $configuration);

        if (!is_array($variables)) {
            $variables = [];
        }

        $variables['allProductsLink'] = $this->getFeaturedCategoryLink();

        return $variables;
    }

    private function getFeaturedCategoryLink(): string
    {
        $categoryId = (int) Configuration::get('HOME_FEATURED_CAT');

        if ($categoryId <= 0) {
            return '';
        }

        return (string) $this->context->link->getCategoryLink($categoryId);
    }
}
