{**
 * Classic Gucci — accesso negato 403
 *}
{extends file='parent:errors/forbidden.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}{$shop.name}{else}{$smarty.block.parent}{/if}
{/block}

{block name='page_content'}
  <div class="gucci-error-page gucci-page-content">
    <h1 class="gucci-error-title">
      {if $language.iso_code == 'it'}Accesso negato{else}{l s='403 Forbidden' d='Shop.Theme.Global'}{/if}
    </h1>
    <p class="gucci-error-text">
      {if $language.iso_code == 'it'}Non hai i permessi per visualizzare questa pagina.{else}{l s='You are not allowed to access this page.' d='Shop.Theme.Global'}{/if}
    </p>
    <p class="gucci-error-actions">
      <a href="{$urls.pages.index}" class="gucci-btn gucci-btn--primary">
        {if $language.iso_code == 'it'}Torna alla home{else}{l s='Back to Home' d='Shop.Theme.Global'}{/if}
      </a>
    </p>
  </div>
{/block}
