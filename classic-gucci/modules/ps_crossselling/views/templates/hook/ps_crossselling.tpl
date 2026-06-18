{**
 * Classic Gucci — cross-selling PDP
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciCrossSellingTitle' value='Chi ha acquistato questo prodotto ha comprato anche'}
  {else}
    {l s='Customers who bought this product also bought:' d='Modules.Crossselling.Shop' assign='gucciCrossSellingTitle'}
  {/if}
  {if $products|@count > 8}
    {assign var='gucciGridProducts' value=$products|array_slice:0:8}
  {else}
    {assign var='gucciGridProducts' value=$products}
  {/if}
  <section class="gucci-product-grid-section gucci-pdp-cross-selling clearfix">
    <header class="gucci-product-grid-section__header">
      <p class="gucci-product-grid-section__title gucci-pdp-cross-selling-title">
        {$gucciCrossSellingTitle}
      </p>
    </header>
    <div class="products gucci-plp-grid gucci-product-grid" data-gucci-product-grid>
      {foreach from=$gucciGridProducts item="product" key="position"}
        {include
          file='catalog/_partials/miniatures/product.tpl'
          product=$product
          position=$position
          productClasses='gucci-plp-cell gucci-product-miniature'
          scope='parent'
        }
      {/foreach}
    </div>
  </section>
{/if}
