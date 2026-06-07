<?php
/**
 * Override IndexController — categorie top in homepage.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

$gucciHomeCategoriesClass = _PS_THEME_DIR_ . 'classes/GucciHomeCategories.php';
if (!is_file($gucciHomeCategoriesClass)) {
    $gucciHomeCategoriesClass = _PS_ROOT_DIR_ . '/themes/classic-gucci/classes/GucciHomeCategories.php';
}

if (is_file($gucciHomeCategoriesClass)) {
    require_once $gucciHomeCategoriesClass;
}

class IndexController extends IndexControllerCore
{
    public function init()
    {
        parent::init();

        $categories = [];

        if (class_exists('GucciHomeCategories', false)) {
            try {
                $categories = GucciHomeCategories::getTopCategories($this->context, 4);
            } catch (Exception $exception) {
                PrestaShopLogger::addLog(
                    'GucciHomeCategories: ' . $exception->getMessage(),
                    3,
                    null,
                    'GucciHomeCategories',
                    null,
                    true
                );
            }
        }

        $this->context->smarty->assign([
            'gucci_home_top_categories' => $categories,
        ]);
    }
}
