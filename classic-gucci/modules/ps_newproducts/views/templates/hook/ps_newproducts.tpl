{**
 * Classic Gucci — nuovi prodotti in homepage
 * @cache-bust 2026-06-18
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Nuovi arrivi'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {l s='New products' d='Modules.Newproducts.Shop' assign='gucciSectionTitle'}
    {l s='All new products' d='Modules.Newproducts.Shop' assign='gucciSectionLinkLabel'}
  {/if}
  {assign var='gucciAllProductsLink' value=''}
  {if isset($allProductsLink) && $allProductsLink}
    {assign var='gucciAllProductsLink' value=$allProductsLink}
  {/if}
  {if $products|@count > 4}
    {assign var='gucciHomeProducts' value=$products|array_slice:0:4}
  {else}
    {assign var='gucciHomeProducts' value=$products}
  {/if}
  <section class="featured-products gucci-home-section gucci-home-section--products clearfix" data-type="newproducts">
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
