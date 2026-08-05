<?php
/**
 * Top categorie homepage — solo categorie senza figli, ordinate per numero prodotti.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class GucciHomeCategories
{
    /**
     * Nomi categoria (lowercase) da escludere dalla griglia home.
     * Es. «Vetrina» = prodotti in vetrina, non va nelle tile categorie.
     *
     * @var array<int, string>
     */
    private static $excludeNames = [
        'vetrina',
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
        $sql->innerJoin(
            'category_lang',
            'cl',
            'cl.`id_category` = c.`id_category` AND cl.`id_lang` = ' . $idLang . ' AND cl.`id_shop` = ' . $idShop
        );
        $sql->innerJoin('category_product', 'cp', 'cp.`id_category` = c.`id_category`');
        $sql->innerJoin('product', 'p', 'p.`id_product` = cp.`id_product`');
        $sql->innerJoin('product_shop', 'ps', 'ps.`id_product` = p.`id_product` AND ps.`id_shop` = ' . $idShop . ' AND ps.`active` = 1');
        $sql->where('c.`active` = 1');
        if ($exclude) {
            $sql->where('c.`id_category` NOT IN (' . implode(',', array_map('intval', $exclude)) . ')');
        }
        if (self::$excludeNames) {
            $excluded = array_map(static function ($name) {
                return '\'' . pSQL(Tools::strtolower(trim((string) $name))) . '\'';
            }, self::$excludeNames);
            $sql->where('LOWER(TRIM(cl.`name`)) NOT IN (' . implode(',', $excluded) . ')');
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
     * Solo cover categoria BO (`img/c/{id}.jpg`) — stesso originale usato dalla PLP.
     * Nessun fallback prodotto / tema / thumbnail / placeholder.
     *
     * @return array{url: string, has_image: bool, width: int, height: int}
     */
    private static function resolveCategoryImage(Context $context, Category $category): array
    {
        $categoryId = (int) $category->id;
        $coverPath = _PS_CAT_IMG_DIR_ . $categoryId . '.jpg';

        if (!is_file($coverPath)) {
            return [
                'url' => '',
                'has_image' => false,
                'width' => 800,
                'height' => 800,
            ];
        }

        $rewrite = trim((string) $category->link_rewrite);
        if ($rewrite === '') {
            $rewrite = (string) $categoryId;
        }

        $width = 800;
        $height = 800;
        $size = @getimagesize($coverPath);
        if (is_array($size) && !empty($size[0]) && !empty($size[1])) {
            $width = (int) $size[0];
            $height = (int) $size[1];
        }

        // type null = file originale (non category_default / small_default ridimensionati)
        $url = $context->link->getCatImageLink($rewrite, $categoryId, null);
        $mtime = (int) @filemtime($coverPath);
        if ($mtime > 0) {
            $url .= (strpos($url, '?') === false ? '?' : '&') . 't=' . $mtime;
        }

        return [
            'url' => $url,
            'has_image' => true,
            'width' => $width,
            'height' => $height,
        ];
    }
}
