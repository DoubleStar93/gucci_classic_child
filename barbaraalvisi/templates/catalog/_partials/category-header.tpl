{**
 * Barbara Alvisi — header categoria PLP
 *}
<div id="js-product-list-header" class="barbaraalvisi-plp-header">
  {if $listing.pagination.items_shown_from == 1}
    {include file='catalog/_partials/barbaraalvisi-plp-hero.tpl' category=$category}
  {else}
    <div class="barbaraalvisi-plp-header-compact">
      {include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$category.name scope='parent'}
      <h1 class="barbaraalvisi-plp-title">{$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}</h1>
    </div>
  {/if}
</div>
