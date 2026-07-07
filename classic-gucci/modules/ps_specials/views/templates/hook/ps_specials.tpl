{**
 * Classic Gucci — offerte speciali in homepage
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Offerte'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {assign var='gucciSectionTitle' value='On sale'}
    {assign var='gucciSectionLinkLabel' value='View all'}
  {/if}
  {assign var='gucciAllProductsLink' value=''}
  {if isset($urls.pages.prices_drop) && $urls.pages.prices_drop}
    {assign var='gucciAllProductsLink' value=$urls.pages.prices_drop}
  {/if}
  {if $products|@count > 4}
    {assign var='gucciHomeProducts' value=$products|array_slice:0:4}
  {else}
    {assign var='gucciHomeProducts' value=$products}
  {/if}
  <section class="featured-products gucci-home-section gucci-home-section--products clearfix" data-type="onsale">
    <header class="gucci-home-section__header">
      <h2 class="gucci-home-section__title products-section-title">{$gucciSectionTitle}</h2>
    </header>
    <div class="products gucci-plp-grid gucci-product-grid" data-gucci-product-grid>
      {foreach from=$gucciHomeProducts item="product" key="position"}
        {include
          file='catalog/_partials/miniatures/product.tpl'
          product=$product
          position=$position
          productClasses='gucci-plp-cell gucci-product-miniature'
          scope='parent'
        }
      {/foreach}
    </div>
    {if !empty($gucciAllProductsLink) && !empty($gucciSectionLinkLabel)}
      <p class="gucci-home-section__footer">
        <a class="gucci-home-section__link all-product-link" href="{$gucciAllProductsLink|escape:'htmlall':'UTF-8'}">
          {$gucciSectionLinkLabel}
        </a>
      </p>
    {/if}
  </section>
{/if}
