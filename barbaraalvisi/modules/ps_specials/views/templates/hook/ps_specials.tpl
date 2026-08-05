{**
 * Barbara Alvisi — offerte speciali in homepage
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiSectionTitle' value='Offerte'}
    {assign var='barbaraalvisiSectionLinkLabel' value='Vedi tutto'}
  {else}
    {assign var='barbaraalvisiSectionTitle' value='On sale'}
    {assign var='barbaraalvisiSectionLinkLabel' value='View all'}
  {/if}
  {assign var='barbaraalvisiAllProductsLink' value=''}
  {if isset($urls.pages.prices_drop) && $urls.pages.prices_drop}
    {assign var='barbaraalvisiAllProductsLink' value=$urls.pages.prices_drop}
  {/if}
  {if $products|@count > 4}
    {assign var='barbaraalvisiHomeProducts' value=$products|array_slice:0:4}
  {else}
    {assign var='barbaraalvisiHomeProducts' value=$products}
  {/if}
  <section class="featured-products barbaraalvisi-home-section barbaraalvisi-home-section--products clearfix" data-type="onsale">
    <header class="barbaraalvisi-home-section__header">
      <h2 class="barbaraalvisi-home-section__title products-section-title">{$barbaraalvisiSectionTitle}</h2>
    </header>
    <div class="products barbaraalvisi-plp-grid barbaraalvisi-product-grid" data-barbaraalvisi-product-grid>
      {foreach from=$barbaraalvisiHomeProducts item="product" key="position"}
        {include
          file='catalog/_partials/miniatures/product.tpl'
          product=$product
          position=$position
          productClasses='barbaraalvisi-plp-cell barbaraalvisi-product-miniature'
          scope='parent'
        }
      {/foreach}
    </div>
    {if !empty($barbaraalvisiAllProductsLink) && !empty($barbaraalvisiSectionLinkLabel)}
      <p class="barbaraalvisi-home-section__footer">
        <a class="barbaraalvisi-home-section__link all-product-link" href="{$barbaraalvisiAllProductsLink|escape:'htmlall':'UTF-8'}">
          {$barbaraalvisiSectionLinkLabel}
        </a>
      </p>
    {/if}
  </section>
{/if}
