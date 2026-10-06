<?php
/**
 * Griglia categorie homepage + albero menu drawer (categorie padre, no Vetrina).
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Barbaraalvisi_Homecategories extends Module
{
    public function __construct()
    {
        $this->name = 'barbaraalvisi_homecategories';
        $this->tab = 'front_office_features';
        $this->version = '1.2.0';
        $this->author = 'Anton';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Barbara Alvisi - categorie homepage');
        $this->description = $this->l('Categorie top in homepage e menu drawer (tema barbaraalvisi).');
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
        $this->sortAccessoriesLikePanel();

        $nodes = $this->loadMenuNodes();

        if (isset($params['templateVars']) && is_array($params['templateVars'])) {
            $params['templateVars']['barbaraalvisi_menu_nodes'] = $nodes;
        }

        $this->context->smarty->assign([
            'barbaraalvisi_menu_nodes' => $nodes,
        ]);
    }

    public function hookDisplayHome(array $params)
    {
        $categories = [];
        $classFile = $this->resolveThemeClassFile('BarbaraalvisiHomeCategories.php');

        if ($classFile !== null) {
            require_once $classFile;

            if (class_exists('BarbaraalvisiHomeCategories', false)) {
                try {
                    $categories = BarbaraalvisiHomeCategories::getTopCategories($this->context, 4);
                } catch (Exception $exception) {
                    PrestaShopLogger::addLog(
                        'barbaraalvisi_homecategories: ' . $exception->getMessage(),
                        3,
                        null,
                        'BarbaraalvisiHomeCategories',
                        null,
                        true
                    );
                }
            }
        }

        $this->context->smarty->assign([
            'barbaraalvisi_home_top_categories' => $categories,
        ]);

        return $this->context->smarty->fetch(
            _PS_THEME_DIR_ . 'templates/_partials/barbaraalvisi-home-categories.tpl'
        );
    }

    /**
     * La scheda ordina i correlati per nome. Il pannello li elenca
     * come getAccessoriesLight, senza ORDER BY sul nome.
     */
    private function sortAccessoriesLikePanel(): void
    {
        $controller = $this->context->controller;
        if (!$controller || $controller->php_self !== 'product') {
            return;
        }

        $accessories = $this->context->smarty->getTemplateVars('accessories');
        if (!is_array($accessories) || count($accessories) < 2) {
            return;
        }

        $product = $this->context->smarty->getTemplateVars('product');
        $idProduct = 0;
        if (is_array($product) || $product instanceof ArrayAccess) {
            $idProduct = (int) ($product['id_product'] ?? $product['id'] ?? 0);
        }
        if ($idProduct < 1) {
            return;
        }

        $listed = Product::getAccessoriesLight((int) $this->context->language->id, $idProduct);
        if (!is_array($listed) || !$listed) {
            return;
        }

        $rank = [];
        foreach ($listed as $index => $row) {
            $rank[(int) $row['id_product']] = (int) $index;
        }

        usort($accessories, function ($left, $right) use ($rank) {
            $leftId = $this->accessoryProductId($left);
            $rightId = $this->accessoryProductId($right);
            $leftRank = $rank[$leftId] ?? PHP_INT_MAX;
            $rightRank = $rank[$rightId] ?? PHP_INT_MAX;

            return $leftRank <=> $rightRank;
        });

        $this->context->smarty->assign('accessories', $accessories);
    }

    /**
     * @param array<string, mixed>|ArrayAccess<string, mixed> $accessory
     */
    private function accessoryProductId($accessory): int
    {
        if (is_array($accessory) || $accessory instanceof ArrayAccess) {
            if (!empty($accessory['id_product'])) {
                return (int) $accessory['id_product'];
            }
            if (!empty($accessory['id'])) {
                return (int) $accessory['id'];
            }
        }

        return 0;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function loadMenuNodes(): array
    {
        $classFile = $this->resolveThemeClassFile('BarbaraalvisiMenuCategories.php');
        if ($classFile === null) {
            return [];
        }

        require_once $classFile;

        if (!class_exists('BarbaraalvisiMenuCategories', false)) {
            return [];
        }

        try {
            return BarbaraalvisiMenuCategories::getMenuNodes($this->context);
        } catch (Throwable $exception) {
            PrestaShopLogger::addLog(
                'barbaraalvisi_homecategories menu: ' . $exception->getMessage(),
                3,
                null,
                'BarbaraalvisiMenuCategories',
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
            $classFile = _PS_ROOT_DIR_ . '/themes/barbaraalvisi/classes/' . $filename;
        }

        return is_file($classFile) ? $classFile : null;
    }
}
