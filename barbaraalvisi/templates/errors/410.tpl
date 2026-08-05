{**
 * Barbara Alvisi — contenuto rimosso (410)
 *}
{extends file='parent:errors/410.tpl'}

{block name='page_title'}
  {$shop.name|escape:'htmlall':'UTF-8'}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-error-page barbaraalvisi-page-content">
    <h1 class="barbaraalvisi-error-title">
      {if $language.iso_code == 'it'}Contenuto non disponibile{else}{l s='410 Gone' d='Shop.Theme.Global'}{/if}
    </h1>
    <p class="barbaraalvisi-error-text">
      {if $language.iso_code == 'it'}
        La pagina che stai cercando non è più disponibile.
      {else}
        {l s='The page you are looking for is no longer available.' d='Shop.Theme.Global'}
      {/if}
    </p>
    <p class="barbaraalvisi-error-actions">
      <a href="{$urls.pages.index}" class="barbaraalvisi-btn barbaraalvisi-btn--primary">
        {if $language.iso_code == 'it'}Torna alla home{else}{l s='Back to Home' d='Shop.Theme.Global'}{/if}
      </a>
    </p>
  </div>
{/block}
