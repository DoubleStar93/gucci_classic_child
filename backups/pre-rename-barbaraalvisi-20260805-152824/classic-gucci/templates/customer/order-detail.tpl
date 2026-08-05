{**
 * Classic Gucci — dettaglio ordine
 *}
{extends file='parent:customer/order-detail.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Ordine{else}{l s='Order details' d='Shop.Theme.Customeraccount'}{/if}
  {if isset($order.details.reference)}
    {$order.details.reference}
  {/if}
{/block}

{block name='page_content'}
  <div class="gucci-order-detail-page gucci-page-content">
    {$smarty.block.parent}
  </div>
{/block}
