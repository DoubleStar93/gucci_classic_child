<?php
/**
 * Più venduti homepage — ProductSale con fallback su prodotti attivi recenti.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class BarbaraalvisiHomeBestsellers
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public static function getProducts(Context $context, int $limit = 4): array
    {
        if ($limit <= 0) {
            return [];
        }

        $idLang = (int) $context->language->id;
        $rawProducts = ProductSale::getBestSales($idLang, 0, $limit);
        if (!is_array($rawProducts)) {
            $rawProducts = [];
        }
        if (count($rawProducts) < $limit) {
            $existingIds = [];
            foreach ($rawProducts as $row) {
                if (!empty($row['id_product'])) {
                    $existingIds[] = (int) $row['id_product'];
                }
            }

            $fallbackLimit = $limit - count($existingIds);
            if ($fallbackLimit > 0) {
                $fallback = Product::getProducts(
                    $idLang,
                    0,
                    $fallbackLimit,
                    'date_add',
                    'DESC',
                    false,
                    true
                );

                if (is_array($fallback)) {
                    foreach ($fallback as $row) {
                        $productId = (int) ($row['id_product'] ?? 0);
                        if ($productId > 0 && !in_array($productId, $existingIds, true)) {
                            $rawProducts[] = $row;
                            $existingIds[] = $productId;
                        }
                    }
                }
            }
        }

        if (!$rawProducts) {
            return [];
        }

        return self::presentProducts($context, array_slice($rawProducts, 0, $limit));
    }

    public static function getAllProductsLink(Context $context): string
    {
        return $context->link->getPageLink('best-sales');
    }

    /**
     * @param array<int, array<string, mixed>> $rawProducts
     *
     * @return array<int, array<string, mixed>>
     */
    private static function presentProducts(Context $context, array $rawProducts): array
    {
        $assembler = new ProductAssembler($context);
        $presenterFactory = new ProductPresenterFactory($context);
        $presentationSettings = $presenterFactory->getPresentationSettings();
        $presenter = $presenterFactory->getPresenter();

        $presented = [];
        foreach ($rawProducts as $rawProduct) {
            $presented[] = $presenter->present(
                $presentationSettings,
                $assembler->assembleProduct($rawProduct),
                $context->language
            );
        }

        return $presented;
    }
}
