<?php
/**
 * Top categorie homepage — solo categorie senza figli, ordinate per numero prodotti.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class GucciHomeCategories
{
    /** @var array<int, string> */
    private static $productImageTypes = [
        'large_default',
        'thickbox_default',
        'home_default',
        'medium_default',
    ];

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function getTopCategories(Context $context, int $limit = 4): array
    {
        $idLang = (int) $context->language->id;
        $idShop = (int) $context->shop->id;
        $rootCategoryId = (int) Configuration::get('PS_ROOT_CATEGORY');
        $homeCategoryId = (int) Configuration::get('PS_HOME_CATEGORY');
        $exclude = array_unique(array_filter([$rootCategoryId, $homeCategoryId]));

        if ($limit <= 0) {
            return [];
        }

        $sql = new DbQuery();
        $sql->select('c.`id_category`, COUNT(DISTINCT cp.`id_product`) AS nb_products');
        $sql->from('category', 'c');
        $sql->innerJoin('category_shop', 'cs', 'cs.`id_category` = c.`id_category` AND cs.`id_shop` = ' . $idShop);
        $sql->innerJoin('category_product', 'cp', 'cp.`id_category` = c.`id_category`');
        $sql->innerJoin('product', 'p', 'p.`id_product` = cp.`id_product`');
        $sql->innerJoin('product_shop', 'ps', 'ps.`id_product` = p.`id_product` AND ps.`id_shop` = ' . $idShop . ' AND ps.`active` = 1');
        $sql->where('c.`active` = 1');
        if ($exclude) {
            $sql->where('c.`id_category` NOT IN (' . implode(',', array_map('intval', $exclude)) . ')');
        }
        $sql->where('NOT EXISTS (
            SELECT 1
            FROM `' . _DB_PREFIX_ . 'category` child
            INNER JOIN `' . _DB_PREFIX_ . 'category_shop` child_cs
                ON child_cs.`id_category` = child.`id_category` AND child_cs.`id_shop` = ' . $idShop . '
            WHERE child.`id_parent` = c.`id_category` AND child.`active` = 1
        )');
        $sql->groupBy('c.`id_category`');
        $sql->having('nb_products > 0');
        $sql->orderBy('nb_products DESC');
        $sql->limit($limit);

        $rows = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($sql);
        if (!$rows) {
            return [];
        }

        $results = [];
        foreach ($rows as $row) {
            $category = new Category((int) $row['id_category'], $idLang, $idShop);
            if (!Validate::isLoadedObject($category) || !(bool) $category->active) {
                continue;
            }

            $results[] = self::formatCategory($context, $category);
        }

        return $results;
    }

    /**
     * @return array<string, mixed>
     */
    private static function formatCategory(Context $context, Category $category): array
    {
        return [
            'id' => (int) $category->id,
            'name' => $category->name,
            'url' => $context->link->getCategoryLink($category),
            'image' => self::resolveCategoryImage($context, $category),
        ];
    }

    /**
     * @return array{url: string, has_image: bool, width: int, height: int}
     */
    private static function resolveCategoryImage(Context $context, Category $category): array
    {
        $idLang = (int) $context->language->id;
        $categoryId = (int) $category->id;

        $products = $category->getProducts($idLang, 1, 12, 'position', 'ASC', false, true);
        if (is_array($products)) {
            foreach ($products as $productRow) {
                $productImage = self::resolveProductRowImage($context, $productRow, $idLang);
                if ($productImage !== null) {
                    return $productImage;
                }
            }
        }

        $categoryImage = self::resolveCategoryCoverImage($context, $category);
        if ($categoryImage !== null) {
            return $categoryImage;
        }

        $themeFallback = _PS_THEME_DIR_ . 'assets/img/home/cat-' . $categoryId . '.jpg';
        if (is_file($themeFallback)) {
            return [
                'url' => $context->link->getBaseLink() . 'themes/' . _THEME_NAME_ . '/assets/img/home/cat-' . $categoryId . '.jpg',
                'has_image' => true,
                'width' => 800,
                'height' => 800,
            ];
        }

        return [
            'url' => '',
            'has_image' => false,
            'width' => 800,
            'height' => 800,
        ];
    }

    /**
     * @param array<string, mixed> $productRow
     *
     * @return array{url: string, has_image: bool, width: int, height: int}|null
     */
    private static function resolveProductRowImage(Context $context, array $productRow, int $idLang): ?array
    {
        $productId = (int) ($productRow['id_product'] ?? 0);
        if ($productId <= 0 || !Validate::isUnsignedId($productId)) {
            return null;
        }

        $rewrite = trim((string) ($productRow['link_rewrite'] ?? ''));
        if ($rewrite === '') {
            return null;
        }

        try {
            $cover = Product::getCover($productId);
        } catch (Exception $exception) {
            return null;
        }

        if (!is_array($cover) || empty($cover['id_image'])) {
            return null;
        }

        $link = $context->link;
        $imageId = (int) $cover['id_image'];

        foreach (self::$productImageTypes as $type) {
            return [
                'url' => $link->getImageLink($rewrite, $imageId, $type),
                'has_image' => true,
                'width' => self::getImageTypeDimensions($type)['width'],
                'height' => self::getImageTypeDimensions($type)['height'],
            ];
        }

        return null;
    }

    /**
     * @return array{url: string, has_image: bool, width: int, height: int}|null
     */
    private static function resolveCategoryCoverImage(Context $context, Category $category): ?array
    {
        $categoryId = (int) $category->id;
        $link = $context->link;

        foreach (['jpg', 'webp', 'png', 'jpeg'] as $extension) {
            if (!is_file(_PS_CAT_IMG_DIR_ . $categoryId . '.' . $extension)) {
                continue;
            }

            return [
                'url' => $link->getBaseLink() . _THEME_CAT_DIR_ . $categoryId . '.' . $extension,
                'has_image' => true,
                'width' => 800,
                'height' => 800,
            ];
        }

        return null;
    }

    /**
     * @return array{width: int, height: int}
     */
    private static function getImageTypeDimensions(string $type): array
    {
        $map = [
            'large_default' => [800, 800],
            'thickbox_default' => [1200, 1200],
            'home_default' => [250, 250],
            'medium_default' => [452, 452],
        ];

        $dimensions = isset($map[$type]) ? $map[$type] : [800, 800];

        return [
            'width' => $dimensions[0],
            'height' => $dimensions[1],
        ];
    }
}
