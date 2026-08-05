{**
 * Barbara Alvisi — accesso negato 403
 *}
{extends file='parent:errors/forbidden.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}{$shop.name}{else}{$smarty.block.parent}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-error-page barbaraalvisi-page-content">
    <h1 class="barbaraalvisi-error-title">
      {if $language.iso_code == 'it'}Accesso negato{else}{l s='403 Forbidden' d='Shop.Theme.Global'}{/if}
    </h1>
    <p class="barbaraalvisi-error-text">
      {if $language.iso_code == 'it'}Non hai i permessi per visualizzare questa pagina.{else}{l s='You are not allowed to access this page.' d='Shop.Theme.Global'}{/if}
    </p>
    <p class="barbaraalvisi-error-actions">
      <a href="{$urls.pages.index}" class="barbaraalvisi-btn barbaraalvisi-btn--primary">
        {if $language.iso_code == 'it'}Torna alla home{else}{l s='Back to Home' d='Shop.Theme.Global'}{/if}
      </a>
    </p>
  </div>
{/block}
