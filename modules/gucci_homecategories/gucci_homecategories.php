<?php
/**
 * Griglia categorie homepage — sostituisce override IndexController.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Gucci_Homecategories extends Module
{
    public function __construct()
    {
        $this->name = 'gucci_homecategories';
        $this->tab = 'front_office_features';
        $this->version = '1.0.0';
        $this->author = 'Anton';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Gucci — categorie homepage');
        $this->description = $this->l('Mostra le categorie top in homepage (tema classic-gucci).');
        $this->ps_versions_compliancy = [
            'min' => '9.0.0',
            'max' => _PS_VERSION_,
        ];
    }

    public function install()
    {
        return parent::install()
            && $this->registerHook('displayHome');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }

    public function hookDisplayHome(array $params)
    {
        $categories = [];
        $classFile = _PS_THEME_DIR_ . 'classes/GucciHomeCategories.php';

        if (!is_file($classFile)) {
            $classFile = _PS_ROOT_DIR_ . '/themes/classic-gucci/classes/GucciHomeCategories.php';
        }

        if (is_file($classFile)) {
            require_once $classFile;

            if (class_exists('GucciHomeCategories', false)) {
                try {
                    $categories = GucciHomeCategories::getTopCategories($this->context, 4);
                } catch (Exception $exception) {
                    PrestaShopLogger::addLog(
                        'gucci_homecategories: ' . $exception->getMessage(),
                        3,
                        null,
                        'GucciHomeCategories',
                        null,
                        true
                    );
                }
            }
        }

        $this->context->smarty->assign([
            'gucci_home_top_categories' => $categories,
        ]);

        return $this->context->smarty->fetch(
            _PS_THEME_DIR_ . 'templates/_partials/gucci-home-categories.tpl'
        );
    }
}
