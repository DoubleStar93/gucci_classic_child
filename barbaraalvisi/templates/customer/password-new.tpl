{**
 * Barbara Alvisi — nuova password
 *}
{extends file='parent:customer/password-new.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Reimposta la password{else}{l s='Reset your password' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-auth-page barbaraalvisi-page-content">
    {$smarty.block.parent}
  </div>
{/block}

{block name='page_footer'}
  <div class="barbaraalvisi-auth-alt barbaraalvisi-account-back-links">
    {$smarty.block.parent}
  </div>
{/block}
