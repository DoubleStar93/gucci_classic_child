{**
 * Classic Gucci — contenuto rimosso (410)
 *}
{extends file='parent:errors/410.tpl'}

{block name='page_title'}
  {$shop.name|escape:'htmlall':'UTF-8'}
{/block}

{block name='page_content'}
  <div class="gucci-error-page gucci-page-content">
    <h1 class="gucci-error-title">
      {if $language.iso_code == 'it'}Contenuto non disponibile{else}{l s='410 Gone' d='Shop.Theme.Global'}{/if}
    </h1>
    <p class="gucci-error-text">
      {if $language.iso_code == 'it'}
        La pagina che stai cercando non è più disponibile.
      {else}
        {l s='The page you are looking for is no longer available.' d='Shop.Theme.Global'}
      {/if}
    </p>
    <p class="gucci-error-actions">
      <a href="{$urls.pages.index}" class="gucci-btn gucci-btn--primary">
        {if $language.iso_code == 'it'}Torna alla home{else}{l s='Back to Home' d='Shop.Theme.Global'}{/if}
      </a>
    </p>
  </div>
{/block}
