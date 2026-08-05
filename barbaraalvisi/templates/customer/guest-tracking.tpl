{**
 * Barbara Alvisi — tracciamento ordine ospite
 *}
{extends file='parent:customer/guest-tracking.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Traccia il tuo ordine{else}{l s='Guest Tracking' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-guest-tracking-page barbaraalvisi-page-content">
    {$smarty.block.parent}
  </div>
{/block}
