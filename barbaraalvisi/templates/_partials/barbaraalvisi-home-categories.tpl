{**
 * Barbara Alvisi — griglia 4 categorie (stile card prodotto)
 * Dati: modulo barbaraalvisi_homecategories (hook displayHome) → $barbaraalvisi_home_top_categories
 *}
{assign var='barbaraalvisiHasHomeCategories' value=!empty($barbaraalvisi_home_top_categories) && $barbaraalvisi_home_top_categories|count}
{assign var='barbaraalvisiFallbackCatIds' value=[3, 6, 9, 11]}

{if $barbaraalvisiHasHomeCategories || $barbaraalvisiFallbackCatIds|count}
  <section
    class="barbaraalvisi-home-categories barbaraalvisi-home-section barbaraalvisi-home-section--products"
    aria-label="{if $language.iso_code == 'it'}Categorie{else}{l s='Categories' d='Shop.Theme.Catalog'}{/if}"
  >
    <div class="products barbaraalvisi-plp-grid barbaraalvisi-product-grid barbaraalvisi-home-categories-grid" data-barbaraalvisi-product-grid>
      {if $barbaraalvisiHasHomeCategories}
        {foreach from=$barbaraalvisi_home_top_categories item=category}
          {include file='_partials/barbaraalvisi-home-category-miniature.tpl' category=$category}
        {/foreach}
      {else}
        {foreach from=$barbaraalvisiFallbackCatIds item=catId}
          {include file='_partials/barbaraalvisi-home-category-fallback.tpl' catId=$catId}
        {/foreach}
      {/if}
    </div>
  </section>
{/if}
