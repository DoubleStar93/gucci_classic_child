{**
 * Barbara Alvisi — resi merce
 *}
{extends file='parent:customer/order-follow.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Resi{else}{l s='Merchandise returns' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-page-content barbaraalvisi-orders-page">
    {$smarty.block.parent}
  </div>
{/block}
