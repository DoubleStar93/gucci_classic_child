{**
 * Barbara Alvisi — buoni sconto
 *}
{extends file='parent:customer/discount.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Buoni sconto{else}{l s='Vouchers' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-page-content barbaraalvisi-discounts-page">
    {$smarty.block.parent}
  </div>
{/block}
