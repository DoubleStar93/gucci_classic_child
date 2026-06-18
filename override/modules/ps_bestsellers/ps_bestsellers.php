<?php
/**
 * Override ps_bestsellers — fallback prodotti attivi se nessuna vendita (demo/staging).
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_BestsellersOverride extends Ps_Bestsellers
{
    public function getWidgetVariables($hookName = null, array $configuration = [])
    {
        $variables = parent::getWidgetVariables($hookName, $configuration);

        if (!is_array($variables)) {
            $variables = [];
        }

        if (empty($variables['allProductsLink'])) {
            $variables['allProductsLink'] = $this->context->link->getPageLink('best-sales');
        }

        if (!empty($variables['products'])) {
            return $variables;
        }

        $classFile = _PS_THEME_DIR_ . 'classes/GucciHomeBestsellers.php';
        if (!is_file($classFile)) {
            $classFile = _PS_ROOT_DIR_ . '/themes/classic-gucci/classes/GucciHomeBestsellers.php';
        }

        if (!is_file($classFile)) {
            return $variables;
        }

        require_once $classFile;

        if (!class_exists('GucciHomeBestsellers', false)) {
            return $variables;
        }

        try {
            $variables['products'] = GucciHomeBestsellers::getProducts($this->context, 4);
            if (empty($variables['allProductsLink'])) {
                $variables['allProductsLink'] = GucciHomeBestsellers::getAllProductsLink($this->context);
            }
        } catch (Exception $exception) {
            PrestaShopLogger::addLog(
                'GucciHomeBestsellers fallback: ' . $exception->getMessage(),
                3,
                null,
                'Ps_Bestsellers',
                null,
                true
            );
        }

        return $variables;
    }
}
