{**
 * Classic Gucci — sezione prodotti homepage (griglia editoriale)
 *
 * @param array  $products
 * @param string $sectionTitle
 * @param string $sectionType   popularproducts|newproducts|onsale|bestsellers
 * @param string $allProductsLink
 * @param string $allProductsLabel
 * @param int    $maxProducts     opzionale (default 8)
 *}
{if $products|count}
  {assign var='gucciHomeMaxProducts' value=8}
  {if isset($maxProducts) && $maxProducts > 0}
    {assign var='gucciHomeMaxProducts' value=$maxProducts}
  {/if}
  <section class="featured-products gucci-home-section gucci-home-section--products clearfix" data-type="{$sectionType|escape:'htmlall':'UTF-8'}">
    <header class="gucci-home-section__header">
      <h2 class="gucci-home-section__title products-section-title">{$sectionTitle}</h2>
    </header>

    {include
      file='catalog/_partials/productlist.tpl'
      products=$products
      productClass='gucci-plp-cell gucci-product-miniature'
      maxProducts=$gucciHomeMaxProducts
    }

    {if !empty($allProductsLink) && !empty($allProductsLabel)}
      <p class="gucci-home-section__footer">
        <a class="gucci-home-section__link all-product-link" href="{$allProductsLink|escape:'htmlall':'UTF-8'}">
          {$allProductsLabel}
        </a>
      </p>
    {/if}
  </section>
{/if}
