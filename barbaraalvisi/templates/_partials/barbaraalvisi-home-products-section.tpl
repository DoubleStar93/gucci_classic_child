{**
 * Barbara Alvisi — sezione prodotti homepage (griglia editoriale)
 *
 * @param array  $products
 * @param string $sectionTitle
 * @param string $sectionType   popularproducts|newproducts|onsale|bestsellers
 * @param string $allProductsLink
 * @param string $allProductsLabel
 * @param int    $maxProducts     opzionale (default 8)
 *}
{if $products|count}
  {assign var='barbaraalvisiHomeMaxProducts' value=8}
  {if isset($maxProducts) && $maxProducts > 0}
    {assign var='barbaraalvisiHomeMaxProducts' value=$maxProducts}
  {/if}
  <section class="featured-products barbaraalvisi-home-section barbaraalvisi-home-section--products clearfix" data-type="{$sectionType|escape:'htmlall':'UTF-8'}">
    <header class="barbaraalvisi-home-section__header">
      <h2 class="barbaraalvisi-home-section__title products-section-title">{$sectionTitle}</h2>
    </header>

    {include
      file='catalog/_partials/productlist.tpl'
      products=$products
      productClass='barbaraalvisi-plp-cell barbaraalvisi-product-miniature'
      maxProducts=$barbaraalvisiHomeMaxProducts
    }

    {if !empty($allProductsLink) && !empty($allProductsLabel)}
      <p class="barbaraalvisi-home-section__footer">
        <a class="barbaraalvisi-home-section__link all-product-link" href="{$allProductsLink|escape:'htmlall':'UTF-8'}">
          {$allProductsLabel}
        </a>
      </p>
    {/if}
  </section>
{/if}
