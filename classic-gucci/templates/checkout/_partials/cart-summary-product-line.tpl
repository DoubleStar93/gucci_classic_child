{**
 * Classic Gucci — riga prodotto nel riepilogo checkout
 *}
{block name='cart_summary_product_line'}
  <article class="gucci-checkout-summary-product">
    <a href="{$product.url|escape:'html':'UTF-8'}" class="gucci-checkout-summary-product__media">
      {if $product.default_image}
        <img
          src="{$product.default_image.small.url|escape:'html':'UTF-8'}"
          alt="{$product.name|escape:'html':'UTF-8'}"
          loading="lazy"
          width="56"
          height="56"
        >
      {else}
        <img
          src="{$urls.no_picture_image.bySize.small_default.url|escape:'html':'UTF-8'}"
          alt="{$product.name|escape:'html':'UTF-8'}"
          loading="lazy"
          width="56"
          height="56"
        >
      {/if}
    </a>

    <div class="gucci-checkout-summary-product__body">
      <a href="{$product.url|escape:'html':'UTF-8'}" class="gucci-checkout-summary-product__name">{$product.name}</a>
      <p class="gucci-checkout-summary-product__meta">
        <span class="gucci-checkout-summary-product__qty">
          {if $language.iso_code == 'it'}Qtà {$product.quantity}{else}Qty {$product.quantity}{/if}
        </span>
        <span class="gucci-checkout-summary-product__price">{$product.price}</span>
      </p>
    </div>
  </article>
{/block}
