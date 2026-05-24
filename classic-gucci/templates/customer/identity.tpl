{**
 * Classic Gucci — dati personali account
 *}
{extends file='parent:customer/identity.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Informazioni personali{else}{l s='Your personal information' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="gucci-auth-page gucci-page-content">
    {$smarty.block.parent}
  </div>
{/block}
