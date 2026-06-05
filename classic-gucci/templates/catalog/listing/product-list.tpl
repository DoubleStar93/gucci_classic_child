{**
 * Classic Gucci — listing prodotti
 *}
{extends file='parent:catalog/listing/product-list.tpl'}

{block name='product_list_header'}
  {if isset($category)}
    {include file='catalog/_partials/category-header.tpl' listing=$listing category=$category}
  {else}
    {if $language.iso_code == 'it'}
      {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$listing.label scope='parent'}
      {assign var='gucciListingTitle' value=$gucciLabelOut}
    {else}
      {assign var='gucciListingTitle' value=$listing.label}
    {/if}
    <div id="js-product-list-header" class="gucci-plp-header">
      <h1 class="gucci-plp-title">{$gucciListingTitle|escape:'htmlall':'UTF-8'}</h1>
    </div>
  {/if}
{/block}

{block name='subcategory_list'}
  {if isset($subcategories) && $subcategories|count}
    {include file='catalog/_partials/subcategories.tpl' subcategories=$subcategories}
  {/if}
{/block}

{block name='product_list_top'}
  {include file='catalog/_partials/products-top.tpl' listing=$listing}
  {if !empty($listing.rendered_facets)}
    <div id="gucci-filters-backdrop" class="gucci-filters-backdrop" aria-hidden="true" hidden></div>
    <aside id="gucci-filters-drawer" class="gucci-filters-drawer" aria-hidden="true" aria-labelledby="gucci-filters-drawer-title">
      <div class="gucci-filters-drawer-header">
        <p id="gucci-filters-drawer-title" class="gucci-filters-drawer-title">
          {if $language.iso_code == 'it'}Filtra{else}{l s='Filter' d='Shop.Theme.Actions'}{/if}
        </p>
        <button
          type="button"
          class="gucci-filters-drawer-close gucci-drawer-close-circle btn-unstyle"
          data-gucci-filters-close
          aria-label="{if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}"
        >
          <i class="material-icons" aria-hidden="true">close</i>
        </button>
      </div>
      <div class="gucci-filters-drawer-body">
        {$listing.rendered_facets nofilter}
      </div>
    </aside>
  {/if}
{/block}

{block name='product_list_active_filters'}
  <div class="gucci-plp-active-filters">
    {$listing.rendered_active_filters nofilter}
  </div>
{/block}

{block name='product_list'}
  {include file='catalog/_partials/products.tpl' listing=$listing productClass='gucci-plp-cell gucci-product-miniature'}
{/block}

{block name='product_list_bottom'}{/block}
