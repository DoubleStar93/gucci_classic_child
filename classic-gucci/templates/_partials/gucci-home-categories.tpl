{**
 * Classic Gucci — griglia 4 categorie (stile card prodotto)
 * Dati: IndexController override → $gucci_home_top_categories
 *}
{assign var='gucciHasHomeCategories' value=!empty($gucci_home_top_categories) && $gucci_home_top_categories|count}
{assign var='gucciFallbackCatIds' value=[3, 6, 9, 11]}

{if $gucciHasHomeCategories || $gucciFallbackCatIds|count}
  <section
    class="gucci-home-categories gucci-home-section gucci-home-section--products"
    aria-label="{if $language.iso_code == 'it'}Categorie{else}{l s='Categories' d='Shop.Theme.Catalog'}{/if}"
  >
    <div class="products gucci-plp-grid gucci-product-grid gucci-home-categories-grid" data-gucci-product-grid>
      {if $gucciHasHomeCategories}
        {foreach from=$gucci_home_top_categories item=category}
          {include file='_partials/gucci-home-category-miniature.tpl' category=$category}
        {/foreach}
      {else}
        {foreach from=$gucciFallbackCatIds item=catId}
          {include file='_partials/gucci-home-category-fallback.tpl' catId=$catId}
        {/foreach}
      {/if}
    </div>
  </section>
{/if}
