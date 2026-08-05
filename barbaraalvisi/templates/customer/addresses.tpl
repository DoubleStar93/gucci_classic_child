{**
 * Barbara Alvisi — indirizzi account
 *}
{extends file='parent:customer/addresses.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}I miei indirizzi{else}{l s='Your addresses' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-page-content barbaraalvisi-addresses-page">
    {$smarty.block.parent}
  </div>
{/block}
