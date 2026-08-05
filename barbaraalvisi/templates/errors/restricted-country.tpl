{**
 * Barbara Alvisi — negozio non disponibile nel paese
 *}
{extends file='parent:errors/restricted-country.tpl'}

{block name='page_title'}
  {$shop.name|escape:'htmlall':'UTF-8'}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-error-page barbaraalvisi-page-content">
    <h1 class="barbaraalvisi-error-title">
      {if $language.iso_code == 'it'}Negozio non disponibile{else}{l s='403 Forbidden' d='Shop.Theme.Global'}{/if}
    </h1>
    <p class="barbaraalvisi-error-text">
      {if $language.iso_code == 'it'}
        Non è possibile accedere a questo negozio dal tuo paese. Ci scusiamo per il disagio.
      {else}
        {l s='You cannot access this store from your country. We apologize for the inconvenience.' d='Shop.Theme.Global'}
      {/if}
    </p>
  </div>
{/block}
