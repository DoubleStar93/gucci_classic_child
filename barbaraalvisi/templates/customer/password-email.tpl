{**
 * Barbara Alvisi — richiesta reset password
 *}
{extends file='parent:customer/password-email.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Hai dimenticato la password?{else}{l s='Forgot your password?' d='Shop.Theme.Customeraccount'}{/if}
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
