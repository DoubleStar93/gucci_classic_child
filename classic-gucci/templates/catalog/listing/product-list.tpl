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
    <div id="gucci-filters-backdrop" class="gucci-filters-backdrop gucci-plp-drawer-backdrop" aria-hidden="true" hidden></div>
    <aside id="gucci-filters-drawer" class="gucci-filters-drawer gucci-plp-drawer gucci-plp-drawer--left" aria-hidden="true" aria-labelledby="gucci-filters-drawer-title">
      <div class="gucci-plp-drawer-header">
        <p id="gucci-filters-drawer-title" class="gucci-plp-drawer-title">
          {if $language.iso_code == 'it'}Filtra{else}{l s='Filter' d='Shop.Theme.Actions'}{/if}
        </p>
        {include
          file='_partials/gucci-panel-close.tpl'
          extraClass='gucci-plp-drawer-close'
          closeAttr='data-gucci-filters-close'
        }
      </div>
      <div class="gucci-plp-drawer-body gucci-filters-drawer-body">
        {$listing.rendered_facets nofilter}
      </div>
    </aside>
  {/if}

  {if !empty($listing.sort_orders)}
    <div id="gucci-sort-backdrop" class="gucci-sort-backdrop gucci-plp-drawer-backdrop" aria-hidden="true" hidden></div>
    <aside id="gucci-sort-drawer" class="gucci-sort-drawer gucci-plp-drawer gucci-plp-drawer--right" aria-hidden="true" aria-labelledby="gucci-sort-drawer-title">
      <div class="gucci-plp-drawer-header">
        <p id="gucci-sort-drawer-title" class="gucci-plp-drawer-title">
          {if $language.iso_code == 'it'}Ordina{else}{l s='Sort by' d='Shop.Theme.Global'}{/if}
        </p>
        {include
          file='_partials/gucci-panel-close.tpl'
          extraClass='gucci-plp-drawer-close'
          closeAttr='data-gucci-sort-close'
        }
      </div>
      <div class="gucci-plp-drawer-body">
        <nav class="gucci-sort-list" aria-label="{if $language.iso_code == 'it'}Ordinamento{else}{l s='Sort by' d='Shop.Theme.Global'}{/if}">
          {foreach from=$listing.sort_orders item=sort_order}
            {if $language.iso_code == 'it'}
              {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$sort_order.label scope='parent'}
              {assign var='gucciSortLabel' value=$gucciLabelOut}
            {else}
              {assign var='gucciSortLabel' value=$sort_order.label}
            {/if}
            <a
              href="{$sort_order.url|escape:'html':'UTF-8'}"
              class="gucci-sort-list__link{if $sort_order.current} is-current{/if}"
              rel="nofollow"
              {if $sort_order.current} aria-current="true"{/if}
            >
              {$gucciSortLabel|escape:'htmlall':'UTF-8'}
            </a>
          {/foreach}
        </nav>
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

{block name='content'}
  <section id="main">
    <div id="products">
      {block name='product_list_header'}{/block}

      {block name='subcategory_list'}{/block}

      {hook h="displayHeaderCategory"}

      {if $listing.products|count}
        {block name='product_list_top'}{/block}

        {block name='product_list_active_filters'}{/block}

        {block name='product_list'}{/block}

        {block name='product_list_bottom'}{/block}
      {else}
        {if isset($category) || (isset($page) && $page.page_name == 'search')}
          {include file='catalog/_partials/gucci-plp-empty-listing.tpl'}
        {else}
          {capture assign="errorContent"}
            <h4>{l s='No products available yet' d='Shop.Theme.Catalog'}</h4>
            <p>{l s='Stay tuned! More products will be shown here as they are added.' d='Shop.Theme.Catalog'}</p>
          {/capture}
          {include file='errors/not-found.tpl' errorContent=$errorContent}
        {/if}
      {/if}

      {block name='product_list_footer'}{/block}

      {hook h="displayFooterCategory"}
    </div>
  </section>
{/block}
