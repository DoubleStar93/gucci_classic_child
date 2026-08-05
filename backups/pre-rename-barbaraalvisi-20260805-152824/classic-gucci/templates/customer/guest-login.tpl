{**
 * Classic Gucci — tracciamento ordine ospite (form)
 *}
{extends file='parent:customer/guest-login.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Traccia il tuo ordine{else}{l s='Guest Order Tracking' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="gucci-auth-page gucci-page-content gucci-guest-login-page">
    {$smarty.block.parent}
  </div>
{/block}
