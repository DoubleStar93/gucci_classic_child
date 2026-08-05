{**
 * Barbara Alvisi — scheda prodotto stile luxury reference (Gossip shoulder bag reference)
 *}
{extends file='parent:catalog/product.tpl'}

{block name='content'}
  <section id="main" class="barbaraalvisi-pdp" itemscope itemtype="https://schema.org/Product">
    <meta itemprop="url" content="{$product.url}">

    {if isset($product.reference_to_display) && $product.reference_to_display}
      <meta itemprop="sku" content="{$product.reference_to_display}">
    {/if}

    <div class="barbaraalvisi-pdp-layout product-container js-product-container">
      <div class="barbaraalvisi-pdp-gallery-col">
        {block name='product_cover_thumbnails'}
          {include file='catalog/_partials/product-cover-thumbnails.tpl'}
        {/block}
      </div>

      <div class="barbaraalvisi-pdp-content-row">
        <div class="barbaraalvisi-pdp-buybox-col product-information">
          <div class="barbaraalvisi-pdp-buybox product-actions js-product-actions">
            <form
              action="{$urls.pages.cart}"
              method="post"
              id="add-to-cart-or-refresh"
            >
              <input type="hidden" name="token" value="{$static_token}">
              <input type="hidden" name="id_product" value="{$product.id}" id="product_page_product_id">
              <input type="hidden" name="id_customization" value="{$product.id_customization}" id="product_customization_id" class="js-product-customization-id">
            {block name='page_header_container'}
              {block name='page_header'}
                <h1 class="h1 barbaraalvisi-product-page-title" itemprop="name">{block name='page_title'}{$product.name}{/block}</h1>
              {/block}
            {/block}

            <p class="barbaraalvisi-pdp-variant-note js-barbaraalvisi-variant-note" {if empty($product.attributes)}hidden{/if}>
              {if $language.iso_code == 'it'}Variante{else}{l s='Variant' d='Shop.Theme.Catalog'}{/if}
              {if !empty($product.attributes)}
                {foreach from=$product.attributes item=attribute name=barbaraalvisiAttrs}
                  {if !$smarty.foreach.barbaraalvisiAttrs.first} {/if}{$attribute.name}
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

              {block name='product_refresh'}
                <input class="product-refresh ps-hidden-by-js" name="refresh" type="submit" value="{l s='Refresh' d='Shop.Theme.Actions'}">
              {/block}
            {/block}

              <button
                type="button"
                class="barbaraalvisi-pdp-secondary-btn barbaraalvisi-contact-toggle barbaraalvisi-btn barbaraalvisi-btn--outline btn-unstyle"
                data-barbaraalvisi-contact-open
              >
                {if $language.iso_code == 'it'}Contattaci{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
              </button>
            </form>
          </div>
        </div>

        <div class="barbaraalvisi-pdp-details-col">
          <section class="barbaraalvisi-pdp-description-block" aria-labelledby="barbaraalvisi-pdp-description-title">
            <h2 id="barbaraalvisi-pdp-description-title" class="barbaraalvisi-pdp-section-title">
              {if $language.iso_code == 'it'}Descrizione del prodotto{else}{l s='Product description' d='Shop.Theme.Catalog'}{/if}
            </h2>

            {if isset($product.reference_to_display) && $product.reference_to_display}
              <p class="barbaraalvisi-pdp-style-code">{$product.reference_to_display}</p>
            {/if}

            {if $product.description}
              <div class="barbaraalvisi-pdp-description-text product-description" itemprop="description">
                {$product.description nofilter}
              </div>
            {elseif $product.description_short}
              <div class="barbaraalvisi-pdp-description-text product-description barbaraalvisi-pdp-short-description" itemprop="description">
                {$product.description_short nofilter}
              </div>
            {/if}
          </section>

          {include file='catalog/_partials/barbaraalvisi-product-accordions.tpl'}
        </div>
      </div>
    </div>

    <div class="barbaraalvisi-pdp-product-grids">
      {block name='product_accessories'}
        {if $accessories}
          {if $language.iso_code == 'it'}
            {assign var='barbaraalvisiAccessoriesTitle' value='Potrebbe piacerti anche'}
          {else}
            {assign var='barbaraalvisiAccessoriesTitle' value='You might also like'}
          {/if}
          {include
            file='_partials/barbaraalvisi-product-grid-section.tpl'
            products=$accessories
            sectionTitle=$barbaraalvisiAccessoriesTitle
            sectionClass='product-accessories barbaraalvisi-pdp-accessories'
            titleClass='barbaraalvisi-pdp-accessories-title'
          }
        {/if}
      {/block}

      {block name='product_footer'}
        <div class="barbaraalvisi-pdp-footer-grids">
          {hook h='displayFooterProduct' product=$product category=$category}
        </div>
      {/block}
    </div>

    {block name='product_images_modal'}{/block}

    {block name='page_footer_container'}{/block}
  </section>
{/block}

{block name='hook_display_reassurance'}{/block}
