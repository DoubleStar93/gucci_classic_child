{**
 * Classic Gucci — pagina ricerca
 *}
{extends file='catalog/listing/product-list.tpl'}

{block name="error_content"}
  <h4 id="product-search-no-matches" class="gucci-plp-empty-title">
    {if $language.iso_code == 'it'}Nessun risultato per la tua ricerca{else}{l s='No matches were found for your search' d='Shop.Theme.Catalog'}{/if}
  </h4>
  <p class="gucci-plp-empty-text">
    {if $language.iso_code == 'it'}Prova con altre parole chiave.{else}{l s='Please try other keywords to describe what you are looking for.' d='Shop.Theme.Catalog'}{/if}
  </p>
{/block}
