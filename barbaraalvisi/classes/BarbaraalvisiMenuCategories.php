<?php
/**
 * Albero menu drawer — categorie padre sotto Home, esclusa «Vetrina».
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class BarbaraalvisiMenuCategories
{
    /**
     * Nomi categoria (lowercase) da escludere dal menu.
     *
     * @var array<int, string>
     */
    private static $excludeNames = [
        'vetrina',
    ];

    /**
     * Nodi compatibili con il template ps_mainmenu (label, url, children, …).
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getMenuNodes(Context $context): array
    {
        $idLang = (int) $context->language->id;
        $idShop = (int) $context->shop->id;
        $homeCategoryId = (int) Configuration::get('PS_HOME_CATEGORY');
        $rootCategoryId = (int) Configuration::get('PS_ROOT_CATEGORY');
        $currentCategoryId = self::resolveCurrentCategoryId($context);

        if ($homeCategoryId <= 0) {
            return [];
        }

        $children = Category::getChildren($homeCategoryId, $idLang, true, $idShop);
        if (!$children) {
            return [];
        }

        $nodes = [];
        foreach ($children as $child) {
            $categoryId = (int) $child['id_category'];
            if ($categoryId === $homeCategoryId || $categoryId === $rootCategoryId) {
                continue;
            }
            if (self::isExcludedName((string) $child['name'])) {
                continue;
            }

            $node = self::buildNode($context, $categoryId, $idLang, $idShop, 0, $currentCategoryId);
            if ($node !== null) {
                $nodes[] = $node;
            }
        }

        return $nodes;
    }

    private static function resolveCurrentCategoryId(Context $context): int
    {
        // Solo da request: su ProductController::$category è protected e non va letto qui.
        $fromRequest = (int) Tools::getValue('id_category');
        if ($fromRequest > 0) {
            return $fromRequest;
        }

        if (
            isset($context->controller)
            && $context->controller instanceof CategoryController
            && method_exists($context->controller, 'getCategory')
        ) {
            $category = $context->controller->getCategory();
            if ($category instanceof Category && (int) $category->id > 0) {
                return (int) $category->id;
            }
        }

        return 0;
    }

    private static function isExcludedName(string $name): bool
    {
        $normalized = Tools::strtolower(trim($name));
        if ($normalized === '') {
            return false;
        }

        return in_array($normalized, self::$excludeNames, true);
    }

    /**
     * @return array<string, mixed>|null
     */
    private static function buildNode(
        Context $context,
        int $categoryId,
        int $idLang,
        int $idShop,
        int $depth,
        int $currentCategoryId
    ): ?array {
        $category = new Category($categoryId, $idLang, $idShop);
        if (!Validate::isLoadedObject($category) || !(bool) $category->active) {
            return null;
        }
        if (self::isExcludedName((string) $category->name)) {
            return null;
        }

        $childRows = Category::getChildren($categoryId, $idLang, true, $idShop);
        $children = [];
        if ($childRows) {
            foreach ($childRows as $childRow) {
                $childNode = self::buildNode(
                    $context,
                    (int) $childRow['id_category'],
                    $idLang,
                    $idShop,
                    $depth + 1,
                    $currentCategoryId
                );
                if ($childNode !== null) {
                    $children[] = $childNode;
                }
            }
        }

        $isCurrent = $currentCategoryId > 0 && $currentCategoryId === $categoryId;

        return [
            'type' => 'category',
            'label' => (string) $category->name,
            'url' => $context->link->getCategoryLink($category),
            'children' => $children,
            'depth' => $depth + 1,
            'page_identifier' => 'category-' . $categoryId,
            'current' => $isCurrent,
            'open_in_new_window' => false,
        ];
    }
}
