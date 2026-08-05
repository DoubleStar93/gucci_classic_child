{**
 * Classic Gucci — indirizzi account
 *}
{extends file='parent:customer/addresses.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}I miei indirizzi{else}{l s='Your addresses' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="gucci-page-content gucci-addresses-page">
    {$smarty.block.parent}
  </div>
{/block}
