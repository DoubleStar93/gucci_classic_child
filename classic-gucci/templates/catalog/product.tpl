{**
 * Classic Gucci — scheda prodotto stile gucci.com (Gossip shoulder bag reference)
 *}
{extends file='parent:catalog/product.tpl'}

{block name='content'}
  <section id="main" class="gucci-pdp" itemscope itemtype="https://schema.org/Product">
    <meta itemprop="url" content="{$product.url}">

    {if isset($product.reference_to_display) && $product.reference_to_display}
      <meta itemprop="sku" content="{$product.reference_to_display}">
    {/if}

    <form
      action="{$urls.pages.cart}"
      method="post"
      id="add-to-cart-or-refresh"
      class="gucci-pdp-layout product-container js-product-container"
    >
      <input type="hidden" name="token" value="{$static_token}">
      <input type="hidden" name="id_product" value="{$product.id}" id="product_page_product_id">
      <input type="hidden" name="id_customization" value="{$product.id_customization}" id="product_customization_id" class="js-product-customization-id">

      <div class="gucci-pdp-gallery-col">
        {include file='catalog/_partials/gucci-product-gallery.tpl' galleryMode='all'}
      </div>

      <div class="gucci-pdp-buybox-col product-information">
        <div class="gucci-pdp-buybox product-actions js-product-actions">
          {block name='page_header_container'}
            {block name='page_header'}
              <h1 class="h1 gucci-product-page-title" itemprop="name">{block name='page_title'}{$product.name}{/block}</h1>
            {/block}
          {/block}

          <p class="gucci-pdp-variant-note js-gucci-variant-note" {if empty($product.attributes)}hidden{/if}>
            {if $language.iso_code == 'it'}Variante{else}{l s='Variant' d='Shop.Theme.Catalog'}{/if}
            {if !empty($product.attributes)}
              {foreach from=$product.attributes item=attribute name=gucciAttrs}
                {if !$smarty.foreach.gucciAttrs.first} {/if}{$attribute.name}
              {/foreach}
            {/if}
          </p>

          {block name='product_prices'}
            {include file='catalog/_partials/product-prices.tpl'}
          {/block}

          {if $product.is_customizable && count($product.customizations.fields)}
            {block name='product_customization'}
              {include file="catalog/_partials/product-customization.tpl" customizations=$product.customizations}
            {/block}
          {/if}

          {block name='product_variants'}
            {include file='catalog/_partials/product-variants.tpl'}
          {/block}

          {block name='product_buy'}
            {block name='product_pack'}{/block}
            {block name='product_discounts'}{/block}

            {block name='product_add_to_cart'}
              {include file='catalog/_partials/product-add-to-cart.tpl'}
            {/block}

            {block name='product_refresh'}{/block}
          {/block}

          <p class="gucci-pdp-delivery-note">
            <span class="gucci-pdp-delivery-icon material-icons" aria-hidden="true">local_shipping</span>
            {if $language.iso_code == 'it'}
              Spedizione e ritiro in negozio gratuiti
            {else}
              {l s='Free shipping and in-store pickup' d='Shop.Theme.Checkout'}
            {/if}
          </p>

          <button
            type="button"
            class="gucci-pdp-secondary-btn gucci-contact-toggle btn-unstyle"
            data-gucci-contact-open
          >
            {l s='Contact us' d='Shop.Theme.Global'}
          </button>
          <p class="gucci-pdp-contact-note">
            {if $language.iso_code == 'it'}
              I nostri Client Advisor sono qui per aiutarti.
            {else}
              {l s='Our Client Advisors are here to help.' d='Shop.Theme.Global'}
            {/if}
          </p>

          {include file='catalog/_partials/gucci-product-buybox-services.tpl'}

          <div class="gucci-pdp-store-actions">
            <a class="gucci-pdp-store-link" href="{$urls.pages.stores|default:'#'}">
              <span class="material-icons" aria-hidden="true">place</span>
              {if $language.iso_code == 'it'}Cerca in negozio{else}{l s='Find in store' d='Shop.Theme.Global'}{/if}
            </a>
            <a class="gucci-pdp-store-link" href="{$urls.pages.contact|default:'#'}">
              <span class="material-icons" aria-hidden="true">event</span>
              {if $language.iso_code == 'it'}Prenota un appuntamento{else}{l s='Book an appointment' d='Shop.Theme.Global'}{/if}
            </a>
          </div>
        </div>
      </div>

      <div class="gucci-pdp-details-col">
        <section class="gucci-pdp-description-block" aria-labelledby="gucci-pdp-description-title">
          <h2 id="gucci-pdp-description-title" class="gucci-pdp-section-title">
            {if $language.iso_code == 'it'}Descrizione del prodotto{else}{l s='Product description' d='Shop.Theme.Catalog'}{/if}
          </h2>

          {if isset($product.reference_to_display) && $product.reference_to_display}
            <p class="gucci-pdp-style-code">
              {if $language.iso_code == 'it'}Stile{else}{l s='Style' d='Shop.Theme.Catalog'}{/if} {$product.reference_to_display}
            </p>
          {/if}

          {if $product.description}
            <div class="gucci-pdp-description-text product-description" itemprop="description">
              {$product.description nofilter}
            </div>
          {elseif $product.description_short}
            <div class="gucci-pdp-description-text product-description gucci-pdp-short-description" itemprop="description">
              {$product.description_short nofilter}
            </div>
          {/if}
        </section>

        {include file='catalog/_partials/gucci-product-accordions.tpl'}
      </div>
    </form>

    {block name='product_accessories'}
      {if $accessories}
        <section class="product-accessories gucci-pdp-accessories clearfix">
          <p class="gucci-pdp-accessories-title">
            {if $language.iso_code == 'it'}Potrebbe piacerti anche{else}{l s='You might also like' d='Shop.Theme.Catalog'}{/if}
          </p>
          <div class="products row gucci-pdp-accessories-grid">
            {foreach from=$accessories item="product_accessory" key="position"}
              {block name='product_miniature'}
                {include file='catalog/_partials/miniatures/product.tpl' product=$product_accessory position=$position productClasses="col-xs-6 col-sm-4 col-md-3 gucci-pdp-accessory-item"}
              {/block}
            {/foreach}
          </div>
        </section>
      {/if}
    {/block}

    {block name='product_footer'}{/block}

    {block name='product_images_modal'}{/block}

    {block name='page_footer_container'}{/block}
  </section>
{/block}

{block name='hook_display_reassurance'}{/block}
