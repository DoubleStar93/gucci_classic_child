{**
 * Classic Gucci — pagina 404
 *}
{extends file='parent:errors/not-found.tpl'}

{block name="error_content"}
  <h4 class="gucci-error-title">
    {if $language.iso_code == 'it'}Pagina non trovata{else}{l s='This page could not be found' d='Shop.Theme.Global'}{/if}
  </h4>
  <p class="gucci-error-text">
    {if $language.iso_code == 'it'}Cerca nel nostro catalogo: potresti trovare quello che cerchi.{else}{l s='Try to search our catalog, you may find what you are looking for!' d='Shop.Theme.Global'}{/if}
  </p>
{/block}
