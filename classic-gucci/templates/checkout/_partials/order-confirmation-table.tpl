{**
 * Classic Gucci — riepilogo articoli conferma ordine
 *}
<div class="gucci-order-confirmation-table-wrap">
  <h2 class="gucci-order-confirmation-section-title">
    {if $language.iso_code == 'it'}Articoli{else}{l s='Order items' d='Shop.Theme.Checkout'}{/if}
  </h2>

  <div class="order-confirmation-table gucci-order-confirmation-lines">
    {foreach from=$products item=product}
      <article class="order-line gucci-order-confirmation-line">
        <div class="gucci-order-confirmation-line__media">
          {if !empty($product.default_image)}
            <picture>
              {if !empty($product.default_image.medium.sources.avif)}<source srcset="{$product.default_image.medium.sources.avif}" type="image/avif">{/if}
              {if !empty($product.default_image.medium.sources.webp)}<source srcset="{$product.default_image.medium.sources.webp}" type="image/webp">{/if}
              <img src="{$product.default_image.medium.url}" alt="{$product.name|escape:'html':'UTF-8'}" loading="lazy" width="80" height="80">
            </picture>
          {else}
            <picture>
              {if !empty($urls.no_picture_image.bySize.medium_default.sources.avif)}<source srcset="{$urls.no_picture_image.bySize.medium_default.sources.avif}" type="image/avif">{/if}
              {if !empty($urls.no_picture_image.bySize.medium_default.sources.webp)}<source srcset="{$urls.no_picture_image.bySize.medium_default.sources.webp}" type="image/webp">{/if}
              <img src="{$urls.no_picture_image.bySize.medium_default.url}" alt="" loading="lazy" width="80" height="80">
            </picture>
          {/if}
        </div>

        <div class="gucci-order-confirmation-line__body">
          <h3 class="gucci-order-confirmation-line__name">
            {if $add_product_link}<a href="{$product.url}">{$product.name}</a>{else}{$product.name}{/if}
          </h3>
          <p class="gucci-order-confirmation-line__unit">
            {if $language.iso_code == 'it'}Prezzo unitario{else}{l s='Unit price' d='Shop.Theme.Checkout'}{/if}:
            <span>{$product.price}</span>
          </p>
        </div>

        <div class="gucci-order-confirmation-line__qty" aria-label="{l s='Quantity' d='Shop.Theme.Checkout'}">
          {$product.quantity}
        </div>

        <div class="gucci-order-confirmation-line__total">
          {$product.total}
        </div>
      </article>
    {/foreach}
  </div>

  <div class="gucci-order-confirmation-totals">
    {foreach $subtotals as $subtotal}
      {if $subtotal !== null && $subtotal.type !== 'tax' && $subtotal.label !== null}
        <div class="cart-summary-line gucci-order-confirmation-summary-line" id="order-subtotal-{$subtotal.type}">
          <span class="label">
            {if $subtotal.type === 'shipping' && $language.iso_code == 'it'}
              Spedizione
            {elseif $subtotal.type === 'products' && $language.iso_code == 'it'}
              Totale parziale
            {else}
              {$subtotal.label}
            {/if}
          </span>
          <span class="value">
            {if 'discount' == $subtotal.type}-&nbsp;{/if}{$subtotal.value}
          </span>
        </div>
      {/if}
    {/foreach}

    {if !$configuration.display_prices_tax_incl && $configuration.taxes_enabled}
      <div class="cart-summary-line gucci-order-confirmation-summary-line">
        <span class="label">{$totals.total.label}&nbsp;{$labels.tax_short}</span>
        <span class="value">{$totals.total.value}</span>
      </div>
      <div class="cart-summary-line cart-total gucci-order-confirmation-summary-line gucci-order-confirmation-summary-line--total">
        <span class="label">{$totals.total_including_tax.label}</span>
        <span class="value">{$totals.total_including_tax.value}</span>
      </div>
    {else}
      <div class="cart-summary-line cart-total gucci-order-confirmation-summary-line gucci-order-confirmation-summary-line--total">
        <span class="label">
          {if $language.iso_code == 'it'}Totale{else}{$totals.total.label}{/if}
          {if $configuration.taxes_enabled && $configuration.display_taxes_label}&nbsp;{$labels.tax_short}{/if}
        </span>
        <span class="value">{$totals.total.value}</span>
      </div>
    {/if}

    {if $subtotals.tax !== null && $subtotals.tax.label !== null}
      <div class="cart-summary-line gucci-order-confirmation-summary-line gucci-order-confirmation-summary-line--tax">
        <span class="label">{$subtotals.tax.label}</span>
        <span class="value">{$subtotals.tax.value}</span>
      </div>
    {/if}
  </div>
</div>
