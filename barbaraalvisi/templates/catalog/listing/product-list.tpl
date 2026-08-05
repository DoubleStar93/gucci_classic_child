{**
 * Barbara Alvisi — listing prodotti
 *}
{extends file='parent:catalog/listing/product-list.tpl'}

{block name='product_list_header'}
  {if isset($category)}
    {include file='catalog/_partials/category-header.tpl' listing=$listing category=$category}
  {else}
    {if $language.iso_code == 'it'}
      {include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$listing.label scope='parent'}
      {assign var='barbaraalvisiListingTitle' value=$barbaraalvisiLabelOut}
    {else}
      {assign var='barbaraalvisiListingTitle' value=$listing.label}
    {/if}
    <div id="js-product-list-header" class="barbaraalvisi-plp-header">
      <h1 class="barbaraalvisi-plp-title">{$barbaraalvisiListingTitle|escape:'htmlall':'UTF-8'}</h1>
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
    <div id="barbaraalvisi-filters-backdrop" class="barbaraalvisi-filters-backdrop barbaraalvisi-plp-drawer-backdrop" aria-hidden="true" hidden></div>
    <aside id="barbaraalvisi-filters-drawer" class="barbaraalvisi-filters-drawer barbaraalvisi-plp-drawer barbaraalvisi-plp-drawer--left" aria-hidden="true" aria-labelledby="barbaraalvisi-filters-drawer-title">
      <div class="barbaraalvisi-plp-drawer-header">
        <p id="barbaraalvisi-filters-drawer-title" class="barbaraalvisi-plp-drawer-title">
          {if $language.iso_code == 'it'}Filtra{else}{l s='Filter' d='Shop.Theme.Actions'}{/if}
        </p>
        {include
          file='_partials/barbaraalvisi-panel-close.tpl'
          extraClass='barbaraalvisi-plp-drawer-close'
          closeAttr='data-barbaraalvisi-filters-close'
        }
      </div>
      <div class="barbaraalvisi-plp-drawer-body barbaraalvisi-filters-drawer-body">
        {$listing.rendered_facets nofilter}
      </div>
    </aside>
  {/if}

  {if !empty($listing.sort_orders)}
    <div id="barbaraalvisi-sort-backdrop" class="barbaraalvisi-sort-backdrop barbaraalvisi-plp-drawer-backdrop" aria-hidden="true" hidden></div>
    <aside id="barbaraalvisi-sort-drawer" class="barbaraalvisi-sort-drawer barbaraalvisi-plp-drawer barbaraalvisi-plp-drawer--right" aria-hidden="true" aria-labelledby="barbaraalvisi-sort-drawer-title">
      <div class="barbaraalvisi-plp-drawer-header">
        <p id="barbaraalvisi-sort-drawer-title" class="barbaraalvisi-plp-drawer-title">
          {if $language.iso_code == 'it'}Ordina{else}{l s='Sort by' d='Shop.Theme.Global'}{/if}
        </p>
        {include
          file='_partials/barbaraalvisi-panel-close.tpl'
          extraClass='barbaraalvisi-plp-drawer-close'
          closeAttr='data-barbaraalvisi-sort-close'
        }
      </div>
      <div class="barbaraalvisi-plp-drawer-body">
        <nav class="barbaraalvisi-sort-list" aria-label="{if $language.iso_code == 'it'}Ordinamento{else}{l s='Sort by' d='Shop.Theme.Global'}{/if}">
          {foreach from=$listing.sort_orders item=sort_order}
            {if $language.iso_code == 'it'}
              {include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$sort_order.label scope='parent'}
              {assign var='barbaraalvisiSortLabel' value=$barbaraalvisiLabelOut}
            {else}
              {assign var='barbaraalvisiSortLabel' value=$sort_order.label}
            {/if}
            <a
              href="{$sort_order.url|escape:'html':'UTF-8'}"
              class="barbaraalvisi-sort-list__link{if $sort_order.current} is-current{/if}"
              rel="nofollow"
              {if $sort_order.current} aria-current="true"{/if}
            >
              {$barbaraalvisiSortLabel|escape:'htmlall':'UTF-8'}
            </a>
          {/foreach}
        </nav>
      </div>
    </aside>
  {/if}
{/block}

{block name='product_list_active_filters'}
  <div class="barbaraalvisi-plp-active-filters">
    {$listing.rendered_active_filters nofilter}
  </div>
{/block}

{block name='product_list'}
  {include file='catalog/_partials/products.tpl' listing=$listing productClass='barbaraalvisi-plp-cell barbaraalvisi-product-miniature'}
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
        {if isset($category) || (isset($page) && ($page.page_name == 'search' || $page.page_name == 'best-sales' || $page.page_name == 'new-products' || $page.page_name == 'prices-drop'))}
          {include file='catalog/_partials/barbaraalvisi-plp-empty-listing.tpl'}
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
