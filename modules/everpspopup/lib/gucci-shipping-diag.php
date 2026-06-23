<?php
/**
 * Logica diagnostica spedizione carrello (Gucci / Barbara Alvisi).
 * Usata dal front controller everpspopup/shippingdiag e dallo script standalone.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

function gucci_diag_section(string $title): void
{
    echo "\n=== {$title} ===\n";
}

function gucci_diag_line(string $label, $value): void
{
    if (is_bool($value)) {
        $value = $value ? 'true' : 'false';
    } elseif (is_array($value)) {
        $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    echo str_pad($label . ':', 42) . $value . "\n";
}

function gucci_diag_format_price(float $amount, Context $context): string
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

function gucci_diag_shipping_method_label(int $method): string
{
    $map = [
        (int) Carrier::SHIPPING_METHOD_FREE => 'FREE (ritiro/gratis)',
        (int) Carrier::SHIPPING_METHOD_WEIGHT => 'WEIGHT',
        (int) Carrier::SHIPPING_METHOD_PRICE => 'PRICE',
    ];

    return ($map[$method] ?? 'UNKNOWN') . " ({$method})";
}

function gucci_diag_carrier_price(Carrier $carrier, float $orderTotal, int $idZone)
{
    if ((int) $carrier->shipping_method !== (int) Carrier::SHIPPING_METHOD_PRICE) {
        return '(n/a — metodo non PRICE)';
    }

    if (method_exists($carrier, 'getDeliveryPriceByPrice')) {
        return $carrier->getDeliveryPriceByPrice($orderTotal, $idZone);
    }

    return Carrier::getDeliveryPriceByPrice($orderTotal, $idZone, (int) $carrier->id);
}

function gucci_diag_carrier_weight(Carrier $carrier, float $weight, int $idZone)
{
    if (method_exists($carrier, 'getDeliveryPriceByWeight')) {
        return $carrier->getDeliveryPriceByWeight($weight, $idZone);
    }

    return Carrier::getDeliveryPriceByWeight($weight, $idZone, (int) $carrier->id);
}
{
    $map = [
        (int) Carrier::SHIPPING_METHOD_FREE => 'FREE (ritiro/gratis)',
        (int) Carrier::SHIPPING_METHOD_WEIGHT => 'WEIGHT',
        (int) Carrier::SHIPPING_METHOD_PRICE => 'PRICE',
    ];

    return ($map[$method] ?? 'UNKNOWN') . " ({$method})";
}

/** @return array<int, array<string, mixed>> */
function gucci_diag_load_recent_carts(int $limit = 5): array
{
    $sql = new DbQuery();
    $sql->select('c.id_cart, c.id_carrier, c.id_currency, c.id_lang, COUNT(cp.id_product) AS nb_lines, SUM(cp.quantity) AS nb_products, c.date_upd');
    $sql->from('cart', 'c');
    $sql->innerJoin('cart_product', 'cp', 'cp.id_cart = c.id_cart');
    $sql->groupBy('c.id_cart');
    $sql->orderBy('c.date_upd DESC');
    $sql->limit($limit);

    $rows = Db::getInstance()->executeS($sql);

    return is_array($rows) ? $rows : [];
}

function gucci_diag_analyze_cart(Cart $cart, Context $context): void
{
    gucci_diag_section('Carrello analizzato #' . (int) $cart->id);

    $productsIncl = (float) $cart->getOrderTotal(true, Cart::ONLY_PRODUCTS);
    $productsExcl = (float) $cart->getOrderTotal(false, Cart::ONLY_PRODUCTS);

    gucci_diag_line('Righe prodotto', (int) $cart->nbProducts());
    gucci_diag_line('Subtotale prodotti (IVA incl.)', gucci_diag_format_price($productsIncl, $context));
    gucci_diag_line('Subtotale prodotti (IVA escl.)', gucci_diag_format_price($productsExcl, $context));
    gucci_diag_line('id_carrier sul carrello', (int) $cart->id_carrier);
    gucci_diag_line('id_address_delivery', (int) $cart->id_address_delivery);

    if ((int) $cart->id_address_delivery === 0) {
        echo "  ⚠ Nessun indirizzo di consegna → getPackageShippingCost() spesso restituisce 0 (= Gratis)\n";
    }

    $defaultCarrierId = (int) Configuration::get('PS_CARRIER_DEFAULT');
    $defaultCountryId = (int) Configuration::get('PS_COUNTRY_DEFAULT');
    $idZone = (int) Country::getIdZone($defaultCountryId);
    $defaultCountry = new Country($defaultCountryId, (int) $context->language->id);
    $countryLabel = '';
    if (Validate::isLoadedObject($defaultCountry)) {
        $countryLabel = is_array($defaultCountry->name)
            ? (string) ($defaultCountry->name[(int) $context->language->id] ?? reset($defaultCountry->name))
            : (string) $defaultCountry->name;
    }

    gucci_diag_line('PS_CARRIER_DEFAULT', $defaultCarrierId);
    gucci_diag_line(
        'PS_COUNTRY_DEFAULT',
        $defaultCountryId . ($countryLabel !== '' ? ' (' . $countryLabel . ')' : '')
    );
    gucci_diag_line('Zona paese default', $idZone);

    $carriers = Carrier::getCarriers((int) $context->language->id, true, false, false);
    if (!is_array($carriers) || !$carriers) {
        echo "Nessun corriere attivo trovato.\n";

        return;
    }

    gucci_diag_section('Corrieri attivi');
    foreach ($carriers as $row) {
        $id = (int) ($row['id_carrier'] ?? 0);
        if ($id <= 0) {
            continue;
        }

        $carrier = new Carrier($id);
        if (!Validate::isLoadedObject($carrier)) {
            continue;
        }

        $freeFrom = method_exists($carrier, 'getShippingFreePrice')
            ? (float) $carrier->getShippingFreePrice()
            : 0.0;

        echo "\n--- Corriere #{$id}: {$carrier->name} ---\n";
        gucci_diag_line('  shipping_method', gucci_diag_shipping_method_label((int) $carrier->shipping_method));
        gucci_diag_line('  shipping_handling', (float) $carrier->shipping_handling);
        gucci_diag_line('  spedizione gratuita da (€)', $freeFrom);
        gucci_diag_line('  è default BO', $id === $defaultCarrierId ? 'SÌ' : 'no');
        gucci_diag_line(
            '  sotto soglia gratuita?',
            ($freeFrom > 0 && $productsIncl >= (float) Tools::convertPrice($freeFrom, $context->currency)) ? 'SÌ → GRATIS' : 'no'
        );

        foreach ([$productsIncl, $productsExcl] as $orderTotal) {
            $label = '  fascia PRICE per ordine ' . number_format($orderTotal, 2, ',', '.') . ' €';
            gucci_diag_line($label, gucci_diag_carrier_price($carrier, $orderTotal, $idZone));
        }

        if ((int) $carrier->shipping_method === (int) Carrier::SHIPPING_METHOD_WEIGHT) {
            gucci_diag_line('  fascia WEIGHT', gucci_diag_carrier_weight($carrier, (float) $cart->getTotalWeight(), $idZone));
        }

        $packageCost = $cart->getPackageShippingCost($id, true, Validate::isLoadedObject($defaultCountry) ? $defaultCountry : null, null);
        gucci_diag_line('  getPackageShippingCost()', $packageCost === false ? 'false' : number_format((float) $packageCost, 2, ',', '.') . ' €');

        if ($packageCost !== false && (float) $packageCost === 0.0 && ($freeFrom <= 0 || $productsIncl < (float) Tools::convertPrice($freeFrom, $context->currency))) {
            echo "  ⚠ getPackageShippingCost=0 ma sotto soglia → PrestaShop non ha calcolato un prezzo reale\n";
        }
    }

    gucci_diag_section('Tema / GucciCartShipping');
    $gucciClass = _PS_THEME_DIR_ . 'classes/GucciCartShipping.php';
    gucci_diag_line('File GucciCartShipping.php', is_file($gucciClass) ? 'presente' : 'MANCANTE');
    gucci_diag_line('Tema attivo', _THEME_NAME_);

    if (is_file($gucciClass)) {
        require_once $gucciClass;
        if (class_exists('GucciCartShipping', false)) {
            $estimate = GucciCartShipping::getShippingEstimate($cart, $context);
            gucci_diag_line('GucciCartShipping amount', number_format((float) ($estimate['amount'] ?? 0), 2, ',', '.') . ' €');
            gucci_diag_line('GucciCartShipping value', (string) ($estimate['value'] ?? ''));
            if ((float) ($estimate['amount'] ?? 0) <= 0 && ($estimate['value'] ?? '') !== '') {
                echo "  ⚠ amount=0 ma value='" . ($estimate['value'] ?? '') . "' → mostrato come GRATIS\n";
            }
            if ((float) ($estimate['amount'] ?? 0) <= 0 && ($estimate['value'] ?? '') === '') {
                echo "  ⚠ amount=0 e value vuoto → template può cadere su subtotale PrestaShop (spesso GRATIS)\n";
            }

            $progress = GucciCartShipping::getFreeShippingProgress($cart, $context);
            gucci_diag_line('Soglia BO (getStoreFreeShippingThreshold)', number_format(GucciCartShipping::getStoreFreeShippingThreshold(), 2, ',', '.') . ' €');
            gucci_diag_line('PS_SHIPPING_FREE_PRICE (raw)', Configuration::get('PS_SHIPPING_FREE_PRICE') ?: '0');
            gucci_diag_line('gucci_free_shipping_show', !empty($progress['show']) ? 'SÌ' : 'no');
            gucci_diag_line('gucci_free_shipping_remaining', (string) ($progress['remaining_value'] ?? ''));
            gucci_diag_line('gucci_free_shipping_reached', !empty($progress['reached']) ? 'SÌ' : 'no');
        }
    }

    gucci_diag_section('Hook modulo everpspopup');
    $module = Module::getInstanceByName('everpspopup');
    if (!$module) {
        echo "Modulo everpspopup non trovato.\n";

        return;
    }

    gucci_diag_line('everpspopup installato', Module::isInstalled('everpspopup'));
    gucci_diag_line('everpspopup attivo', Module::isEnabled('everpspopup'));
    gucci_diag_line('versione modulo', $module->version ?? '?');
    gucci_diag_line('hook displayShoppingCart registrato', $module->isRegisteredInHook('displayShoppingCart'));
    gucci_diag_line('metodo hookDisplayShoppingCart', method_exists($module, 'hookDisplayShoppingCart'));

    gucci_diag_section('Subtotale spedizione (CartPresenter / front)');
    $presenter = new PrestaShop\PrestaShop\Adapter\Presenter\Cart\CartPresenter();
    $presented = $presenter->present($cart);
    $shippingSub = $presented['subtotals']['shipping'] ?? null;
    if (is_array($shippingSub)) {
        gucci_diag_line('presented shipping amount', $shippingSub['amount'] ?? '?');
        gucci_diag_line('presented shipping value', $shippingSub['value'] ?? '(vuoto)');
    } else {
        echo "Subtotale shipping non presente nel cart presenter.\n";
    }
}

function gucci_run_shipping_diagnostic(Context $context, ?int $requestedCartId = null): void
{
    echo "Diagnostica spedizione carrello\n";
    echo 'Data: ' . date('Y-m-d H:i:s') . "\n";
    echo 'Shop: ' . (Configuration::get('PS_SHOP_NAME') ?: '?') . "\n";
    gucci_diag_line('PrestaShop', _PS_VERSION_);

    try {
        gucci_run_shipping_diagnostic_body($context, $requestedCartId);
    } catch (Throwable $exception) {
        gucci_diag_section('ERRORE PHP');
        echo $exception->getMessage() . "\n";
        echo $exception->getFile() . ':' . $exception->getLine() . "\n";
    }
}

function gucci_run_shipping_diagnostic_body(Context $context, ?int $requestedCartId = null): void
{
    $cart = $context->cart;

    if (Validate::isLoadedObject($cart) && $cart->nbProducts() > 0 && !$requestedCartId) {
        gucci_diag_line('Fonte carrello', 'sessione visitatore corrente');
        gucci_diag_analyze_cart($cart, $context);
    } else {
        gucci_diag_section('Carrello sessione');
        if (!$requestedCartId) {
            echo "Nessun carrello in sessione (o carrello vuoto).\n";
        }

        $recent = gucci_diag_load_recent_carts(3);
        if (!$recent) {
            echo "Nessun carrello recente con prodotti nel database.\n";
            echo "\nApri il carrello nel browser (con prodotti) e rilancia lo script,\n";
            echo "oppure aggiungi ?id_cart=ID al URL se conosci l'ID.\n";

            return;
        }

        gucci_diag_line('Fonte carrello', 'ultimi carrelli DB (più recente con prodotti)');

        $picked = null;
        if ($requestedCartId > 0) {
            foreach ($recent as $row) {
                if ((int) $row['id_cart'] === $requestedCartId) {
                    $picked = $row;
                    break;
                }
            }
        }
        if (!$picked) {
            $picked = $recent[0];
        }

        gucci_diag_line('id_cart usato', (int) $picked['id_cart']);
        gucci_diag_line('prodotti nel carrello', (int) ($picked['nb_products'] ?? 0));
        gucci_diag_line('ultimo aggiornamento', (string) ($picked['date_upd'] ?? '?'));

        $dbCart = new Cart((int) $picked['id_cart']);
        if (!Validate::isLoadedObject($dbCart)) {
            echo "Impossibile caricare il carrello #{$picked['id_cart']}.\n";

            return;
        }

        gucci_diag_analyze_cart($dbCart, $context);
    }

    gucci_diag_section('Interpretazione rapida');
    echo <<<'TXT'
• GRATIS sotto 150 € + getPackageShippingCost=0 → PrestaShop non calcola senza indirizzo; serve fascia PRICE > 0 su GLS.
• fascia PRICE = 0 → controlla zone/fasce corriere GLS per la zona del paese default.
• Corriere default = Click and collect → spedizione gratuita finché non imposti GLS come default.
• hook displayShoppingCart = no → GucciCartShipping non gira; visita homepage una volta o registra hook in BO.
• GucciCartShipping amount=0 e value=Gratis → soglia superata O calcolo fallito (vedi righe ⚠ sopra).
TXT;

    echo "\n";
}
