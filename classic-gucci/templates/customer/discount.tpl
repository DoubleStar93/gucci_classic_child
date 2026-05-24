{**
 * Classic Gucci — buoni sconto
 *}
{extends file='parent:customer/discount.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Buoni sconto{else}{l s='Vouchers' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="gucci-page-content gucci-discounts-page">
    {$smarty.block.parent}
  </div>
{/block}
