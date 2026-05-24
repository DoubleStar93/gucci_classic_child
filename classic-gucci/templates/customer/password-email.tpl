{**
 * Classic Gucci — richiesta reset password
 *}
{extends file='parent:customer/password-email.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Hai dimenticato la password?{else}{l s='Forgot your password?' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="gucci-auth-page gucci-page-content">
    {$smarty.block.parent}
  </div>
{/block}

{block name='page_footer'}
  <div class="gucci-auth-alt gucci-account-back-links">
    {$smarty.block.parent}
  </div>
{/block}
