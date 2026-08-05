{**
 * Barbara Alvisi — elenco marchi
 *}
{extends file='parent:catalog/manufacturers.tpl'}

{block name='brand_header'}
  <header class="barbaraalvisi-plp-header barbaraalvisi-brands-header">
    <h1 class="barbaraalvisi-plp-title">
      {if $language.iso_code == 'it'}Marchi{else}{l s='Brands' d='Shop.Theme.Catalog'}{/if}
    </h1>
  </header>
{/block}

{block name='brand_miniature'}
  <div class="barbaraalvisi-brands-grid">
    {foreach from=$brands item=brand}
      {include file='catalog/_partials/miniatures/brand.tpl' brand=$brand}
    {/foreach}
  </div>
{/block}
