<?php
/**
 * Stima spedizione nel carrello — corriere predefinito, prezzo fisso + soglia gratuita.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class GucciCartShipping
{
    /**
     * @return array{show: bool, remaining_amount: float, remaining_value: string, reached: bool, threshold_amount: float}
     */
    public static function getFreeShippingProgress(Cart $cart, Context $context): array
    {
        $empty = [
            'show' => false,
            'remaining_amount' => 0.0,
            'remaining_value' => '',
            'reached' => false,
            'threshold_amount' => 0.0,
        ];

        if (!$cart->nbProducts()) {
            return $empty;
        }

        $thresholdInCurrency = self::normalizeThresholdAmount(self::getStoreFreeShippingThreshold());
        if ($thresholdInCurrency <= 0) {
            return $empty;
        }
        $productsTotal = (float) $cart->getOrderTotal(true, Cart::ONLY_PRODUCTS);

        if ($productsTotal >= $thresholdInCurrency - 0.001) {
            return array_merge($empty, ['reached' => true, 'threshold_amount' => $thresholdInCurrency]);
        }

        $remaining = max(0.0, $thresholdInCurrency - $productsTotal);

        return [
            'show' => true,
            'remaining_amount' => $remaining,
            'remaining_value' => self::formatMoney($remaining, $context),
            'reached' => false,
            'threshold_amount' => $thresholdInCurrency,
        ];
    }

    /**
     * @return array{amount: float, value: string, label: string}
     */
    public static function getShippingEstimate(Cart $cart, Context $context): array
    {
        $label = self::translate('Shipping', $context);

        if (!$cart->nbProducts()) {
            return [
                'amount' => 0.0,
                'value' => '',
                'label' => $label,
            ];
        }

        $idCarrier = self::getDefaultCarrierId($context);
        if ($idCarrier <= 0) {
            return [
                'amount' => 0.0,
                'value' => '',
                'label' => $label,
            ];
        }

        $carrier = new Carrier($idCarrier);
        if (!Validate::isLoadedObject($carrier)) {
            return [
                'amount' => 0.0,
                'value' => '',
                'label' => $label,
            ];
        }

        $amount = self::getEstimatedShippingCost($cart, $idCarrier, $context);

        return [
            'amount' => $amount,
            'value' => self::formatShippingValue($amount, $carrier, $cart, $context),
            'label' => $label,
        ];
    }

    /**
     * @return array{amount: float, value: string}
     */
    public static function getCartTotalWithShipping(array $presentedCart, float $shippingAmount, Context $context): array
    {
        if ($shippingAmount <= 0 || !isset($presentedCart['totals']['total']['amount'])) {
            return [
                'amount' => (float) ($presentedCart['totals']['total']['amount'] ?? 0),
                'value' => (string) ($presentedCart['totals']['total']['value'] ?? ''),
            ];
        }

        $productsAmount = (float) ($presentedCart['subtotals']['products']['amount'] ?? 0);
        $discountAmount = (float) ($presentedCart['subtotals']['discounts']['amount'] ?? 0);
        $currentTotal = (float) $presentedCart['totals']['total']['amount'];
        $expectedWithoutShipping = max(0.0, $productsAmount - $discountAmount);

        if ($currentTotal > $expectedWithoutShipping + 0.01) {
            return [
                'amount' => $currentTotal,
                'value' => (string) ($presentedCart['totals']['total']['value'] ?? self::formatMoney($currentTotal, $context)),
            ];
        }

        $newTotal = $currentTotal + $shippingAmount;

        return [
            'amount' => $newTotal,
            'value' => self::formatMoney($newTotal, $context),
        ];
    }

    public static function assignCartShippingVars(Cart $cart, Context $context): void
    {
        try {
            $presentedCart = $context->smarty->getTemplateVars('cart');
            if (!is_array($presentedCart)) {
                if (is_object($presentedCart) && $presentedCart instanceof JsonSerializable) {
                    $presentedCart = $presentedCart->jsonSerialize();
                } elseif (is_object($presentedCart)) {
                    $presentedCart = (array) $presentedCart;
                } else {
                    $presentedCart = [];
                }
            }

            $shipping = self::getShippingEstimate($cart, $context);
            $total = self::getCartTotalWithShipping($presentedCart, $shipping['amount'], $context);
            $freeShipping = self::getFreeShippingProgress($cart, $context);

            $context->smarty->assign([
                'gucci_shipping_amount' => $shipping['amount'],
                'gucci_shipping_value' => $shipping['value'],
                'gucci_shipping_label' => $shipping['label'],
                'gucci_cart_total_amount' => $total['amount'],
                'gucci_cart_total_value' => $total['value'],
                'gucci_free_shipping_show' => $freeShipping['show'],
                'gucci_free_shipping_remaining_amount' => $freeShipping['remaining_amount'],
                'gucci_free_shipping_remaining_value' => $freeShipping['remaining_value'],
                'gucci_free_shipping_reached' => $freeShipping['reached'],
                'gucci_free_shipping_threshold_amount' => $freeShipping['threshold_amount'],
            ]);
        } catch (Throwable $exception) {
            PrestaShopLogger::addLog(
                'GucciCartShipping: ' . $exception->getMessage(),
                3
            );
        }
    }

    private static function getDefaultCarrierId(Context $context): int
    {
        $candidates = [];

        $defaultId = (int) Configuration::get('PS_CARRIER_DEFAULT');
        if ($defaultId > 0) {
            $candidates[] = $defaultId;
        }

        $carriers = Carrier::getCarriers((int) $context->language->id, true, false, false);
        if (is_array($carriers)) {
            foreach ($carriers as $row) {
                $id = (int) ($row['id_carrier'] ?? 0);
                if ($id > 0) {
                    $candidates[] = $id;
                }
            }
        }

        foreach (array_unique($candidates) as $idCarrier) {
            if (self::isDeliverableCarrier((int) $idCarrier)) {
                return (int) $idCarrier;
            }
        }

        return 0;
    }

    private static function isDeliverableCarrier(int $idCarrier): bool
    {
        $carrier = new Carrier($idCarrier);

        if (!Validate::isLoadedObject($carrier) || !$carrier->active || $carrier->deleted) {
            return false;
        }

        if ((int) $carrier->shipping_method === (int) Carrier::SHIPPING_METHOD_FREE) {
            return false;
        }

        return true;
    }

    private static function getEstimatedShippingCost(Cart $cart, int $idCarrier, Context $context): float
    {
        $carrier = new Carrier($idCarrier);
        if (!Validate::isLoadedObject($carrier)) {
            return 0.0;
        }

        $productsTotal = (float) $cart->getOrderTotal(true, Cart::ONLY_PRODUCTS);
        if (self::isFreeShippingForTotal($carrier, $productsTotal, $context)) {
            return 0.0;
        }

        // Prezzo fisso da fasce corriere (affidabile anche senza indirizzo di consegna).
        $rangeCost = self::getCarrierRangePrice($cart, $carrier, $context);
        if ($rangeCost > 0) {
            return $rangeCost;
        }

        $defaultCountry = new Country((int) Configuration::get('PS_COUNTRY_DEFAULT'));
        if (!Validate::isLoadedObject($defaultCountry)) {
            $defaultCountry = null;
        }

        $cost = $cart->getPackageShippingCost($idCarrier, true, $defaultCountry, null);
        // PS spesso restituisce 0 senza indirizzo: non confondere con "gratis" sotto soglia.
        if ($cost !== false && (float) $cost > 0) {
            return (float) $cost;
        }

        return 0.0;
    }

    private static function isFreeShippingForTotal(Carrier $carrier, float $productsTotal, Context $context): bool
    {
        $freeFrom = self::getFreeShippingThresholdAmount($carrier);
        if ($freeFrom <= 0) {
            return false;
        }

        return $productsTotal >= self::normalizeThresholdAmount($freeFrom) - 0.001;
    }

    /**
     * Soglia spedizione gratuita negozio: BO globale → GUCCI_FREE_SHIPPING_THRESHOLD → 150 €.
     */
    public static function getStoreFreeShippingThreshold(): float
    {
        $global = self::getGlobalFreeShippingThreshold();
        if ($global > 0) {
            return $global;
        }

        $configured = (float) Configuration::get('GUCCI_FREE_SHIPPING_THRESHOLD');
        if ($configured > 0) {
            return $configured;
        }

        return 150.0;
    }

    /**
     * @deprecated Usare getStoreFreeShippingThreshold()
     */
    private static function getFreeShippingThresholdAmount(Carrier $carrier): float
    {
        return self::getStoreFreeShippingThreshold();
    }

    private static function getGlobalFreeShippingThreshold(): float
    {
        $context = Context::getContext();
        $idShop = (int) ($context->shop->id ?? 0);
        $idShopGroup = (int) ($context->shop->id_shop_group ?? 0);
        $keys = [
            'PS_SHIPPING_FREE_PRICE',
            'PS_SHIPPING_FREE_MIN_PRICE',
        ];

        foreach ($keys as $key) {
            $value = (float) Configuration::get($key, null, $idShopGroup, $idShop);
            if ($value > 0 && $value < 1000000) {
                return $value;
            }

            $value = (float) Configuration::get($key);
            if ($value > 0 && $value < 1000000) {
                return $value;
            }
        }

        return 0.0;
    }

    /**
     * Importo soglia nella valuta del carrello (PS_SHIPPING_FREE_PRICE è già in valuta negozio).
     */
    private static function normalizeThresholdAmount(float $amount): float
    {
        if ($amount <= 0 || $amount >= 1000000) {
            return 0.0;
        }

        return (float) $amount;
    }

    private static function getCarrierFreeShippingFromPrice(Carrier $carrier): float
    {
        return self::getFreeShippingThresholdAmount($carrier);
    }

    private static function getFreeShippingThresholdFromZeroDeliveryRange(int $idCarrier): float
    {
        $idZone = (int) Country::getIdZone((int) Configuration::get('PS_COUNTRY_DEFAULT'));
        if ($idZone <= 0 || $idCarrier <= 0) {
            return 0.0;
        }

        $sql = new DbQuery();
        $sql->select('MIN(rp.delimiter1) AS threshold');
        $sql->from('range_price', 'rp');
        $sql->innerJoin('delivery', 'd', 'd.id_range_price = rp.id_range_price');
        $sql->where('d.id_carrier = ' . (int) $idCarrier);
        $sql->where('d.id_zone = ' . (int) $idZone);
        $sql->where('d.price = 0');
        $sql->where('rp.delimiter1 > 0');
        $sql->where('rp.delimiter1 < 1000000');

        $value = Db::getInstance()->getValue($sql);

        return $value ? (float) $value : 0.0;
    }

    private static function getCarrierRangePrice(Cart $cart, Carrier $carrier, Context $context): float
    {
        $idZone = (int) Country::getIdZone((int) Configuration::get('PS_COUNTRY_DEFAULT'));
        if ($idZone <= 0) {
            return 0.0;
        }

        $idCarrier = (int) $carrier->id;
        $shippingMethod = (int) $carrier->shipping_method;
        $orderTotals = array_unique([
            (float) $cart->getOrderTotal(true, Cart::ONLY_PRODUCTS),
            (float) $cart->getOrderTotal(false, Cart::ONLY_PRODUCTS),
        ]);
        $cost = 0.0;

        foreach ($orderTotals as $orderTotal) {
            if ($shippingMethod === (int) Carrier::SHIPPING_METHOD_PRICE) {
                $cost = self::getDeliveryPriceByPrice($carrier, $orderTotal, $idZone);
            } elseif ($shippingMethod === (int) Carrier::SHIPPING_METHOD_WEIGHT) {
                $cost = self::getDeliveryPriceByWeight($carrier, (float) $cart->getTotalWeight(), $idZone);
            }

            if ($cost > 0) {
                break;
            }
        }

        $cost += (float) $carrier->shipping_handling;

        if ($cost > 0 && Configuration::get('PS_TAX') && (int) $carrier->getIdTaxRulesGroup() > 0) {
            $address = new Address((int) $cart->id_address_delivery);
            if (!Validate::isLoadedObject($address)) {
                $address = Address::initialize();
            }

            $taxCalculator = TaxManagerFactory::getManager($address, (int) $carrier->getIdTaxRulesGroup())->getTaxCalculator();
            $cost = (float) $taxCalculator->addTaxes($cost);
        }

        return max(0.0, $cost);
    }

    private static function isShippingFreeAmount(float $shippingAmount, Carrier $carrier, Cart $cart, Context $context): bool
    {
        if ($shippingAmount > 0) {
            return false;
        }

        $productsTotal = (float) $cart->getOrderTotal(true, Cart::ONLY_PRODUCTS);

        return self::isFreeShippingForTotal($carrier, $productsTotal, $context);
    }

    private static function formatShippingValue(float $shippingAmount, Carrier $carrier, Cart $cart, Context $context): string
    {
        if ($shippingAmount > 0) {
            return self::formatMoney($shippingAmount, $context);
        }

        if (self::isShippingFreeAmount($shippingAmount, $carrier, $cart, $context)) {
            return self::translate('Free', $context);
        }

        return '';
    }

    private static function getDeliveryPriceByPrice(Carrier $carrier, float $orderTotal, int $idZone): float
    {
        if (method_exists($carrier, 'getDeliveryPriceByPrice')) {
            return (float) $carrier->getDeliveryPriceByPrice($orderTotal, $idZone);
        }

        return (float) Carrier::getDeliveryPriceByPrice($orderTotal, $idZone, (int) $carrier->id);
    }

    private static function getDeliveryPriceByWeight(Carrier $carrier, float $weight, int $idZone): float
    {
        if (method_exists($carrier, 'getDeliveryPriceByWeight')) {
            return (float) $carrier->getDeliveryPriceByWeight($weight, $idZone);
        }

        return (float) Carrier::getDeliveryPriceByWeight($weight, $idZone, (int) $carrier->id);
    }

    private static function formatMoney(float $amount, Context $context): string
    {
        if (method_exists('Tools', 'displayPrice')) {
            return Tools::displayPrice($amount);
        }

        $currency = $context->currency;
        if ($currency && method_exists($context, 'getCurrentLocale')) {
            $locale = $context->getCurrentLocale();
            if ($locale && method_exists($locale, 'formatPrice')) {
                return $locale->formatPrice($amount, $currency->iso_code);
            }
        }

        return number_format($amount, 2, ',', '.') . ' €';
    }

    private static function translate(string $word, Context $context): string
    {
        if (method_exists($context, 'getTranslator')) {
            $translator = $context->getTranslator();
            if ($translator) {
                return $translator->trans($word, [], 'Shop.Theme.Checkout');
            }
        }

        return $word;
    }
}
