{**
 * Barbara Alvisi — note di credito
 *}
{extends file='parent:customer/order-slip.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Note di credito{else}{l s='Credit slips' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-page-content barbaraalvisi-orders-page">
    {$smarty.block.parent}
  </div>
{/block}
