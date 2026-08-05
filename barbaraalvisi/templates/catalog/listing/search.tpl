{**
 * Barbara Alvisi — pagina ricerca
 *}
{extends file='catalog/listing/product-list.tpl'}

{block name='product_list_header'}
  {assign var='barbaraalvisiSearchQuery' value=$smarty.get.s|default:''|strip_tags}
  <div id="js-product-list-header" class="barbaraalvisi-plp-header">
    <h1 class="barbaraalvisi-plp-title">
      {if $language.iso_code == 'it'}
        {if $barbaraalvisiSearchQuery}
          Risultati per «{$barbaraalvisiSearchQuery|escape:'htmlall':'UTF-8'}»
        {else}
          Cerca nel catalogo
        {/if}
      {else}
        {$listing.label}
      {/if}
    </h1>
    {if $listing.pagination.total_items > 0}
      <p class="barbaraalvisi-plp-header-count">
        {$listing.pagination.total_items}
        {if $language.iso_code == 'it'}
          {if $listing.pagination.total_items == 1}articolo{else}articoli{/if}
        {else}
          {if $listing.pagination.total_items == 1}{l s='product' d='Shop.Theme.Catalog'}{else}{l s='products' d='Shop.Theme.Catalog'}{/if}
        {/if}
      </p>
    {/if}
  </div>
{/block}

{block name="error_content"}
  <h4 id="product-search-no-matches" class="barbaraalvisi-plp-empty-title">
    {if $language.iso_code == 'it'}Nessun risultato per la tua ricerca{else}{l s='No matches were found for your search' d='Shop.Theme.Catalog'}{/if}
  </h4>
  <p class="barbaraalvisi-plp-empty-text">
    {if $language.iso_code == 'it'}Prova con altre parole chiave.{else}{l s='Please try other keywords to describe what you are looking for.' d='Shop.Theme.Catalog'}{/if}
  </p>
{/block}
