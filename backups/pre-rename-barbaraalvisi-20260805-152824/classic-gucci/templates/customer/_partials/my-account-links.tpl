{**
 * Classic Gucci — link indietro account
 *}
{extends file='parent:customer/_partials/my-account-links.tpl'}

{block name='my_account_links'}
  <a class="gucci-account-back-link" href="{$urls.pages.my_account}">
    {if $language.iso_code == 'it'}Torna al tuo account{else}{l s='Back to your account' d='Shop.Theme.Customeraccount'}{/if}
  </a>
  <a class="gucci-account-back-link gucci-account-back-link--home" href="{$urls.pages.index}">
    {if $language.iso_code == 'it'}Home{else}{l s='Home' d='Shop.Theme.Global'}{/if}
  </a>
{/block}
