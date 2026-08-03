<?php
/**
 * Griglia categorie homepage + albero menu drawer (categorie padre, no Vetrina).
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
        $this->version = '1.1.0';
        $this->author = 'Anton';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Gucci — categorie homepage');
        $this->description = $this->l('Categorie top in homepage e menu drawer (tema classic-gucci).');
        $this->ps_versions_compliancy = [
            'min' => '9.0.0',
            'max' => _PS_VERSION_,
        ];
    }

    public function install()
    {
        return parent::install()
            && $this->registerHook('displayHome')
            && $this->registerHook('actionFrontControllerSetVariables');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }

    /**
     * Assicura gli hook dopo aggiornamento FTP (modulo già installato).
     */
    public function ensureHooks(): void
    {
        $this->registerHook('displayHome');
        $this->registerHook('actionFrontControllerSetVariables');
    }

    public function hookActionFrontControllerSetVariables(array $params)
    {
        $nodes = $this->loadMenuNodes();

        if (isset($params['templateVars']) && is_array($params['templateVars'])) {
            $params['templateVars']['gucci_menu_nodes'] = $nodes;
        }

        $this->context->smarty->assign([
            'gucci_menu_nodes' => $nodes,
        ]);
    }

    public function hookDisplayHome(array $params)
    {
        $categories = [];
        $classFile = $this->resolveThemeClassFile('GucciHomeCategories.php');

        if ($classFile !== null) {
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

    /**
     * @return array<int, array<string, mixed>>
     */
    private function loadMenuNodes(): array
    {
        $classFile = $this->resolveThemeClassFile('GucciMenuCategories.php');
        if ($classFile === null) {
            return [];
        }

        require_once $classFile;

        if (!class_exists('GucciMenuCategories', false)) {
            return [];
        }

        try {
            return GucciMenuCategories::getMenuNodes($this->context);
        } catch (Throwable $exception) {
            PrestaShopLogger::addLog(
                'gucci_homecategories menu: ' . $exception->getMessage(),
                3,
                null,
                'GucciMenuCategories',
                null,
                true
            );

            return [];
        }
    }

    private function resolveThemeClassFile(string $filename): ?string
    {
        $classFile = _PS_THEME_DIR_ . 'classes/' . $filename;

        if (!is_file($classFile)) {
            $classFile = _PS_ROOT_DIR_ . '/themes/classic-gucci/classes/' . $filename;
        }

        return is_file($classFile) ? $classFile : null;
    }
}
