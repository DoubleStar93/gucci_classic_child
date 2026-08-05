{**
 * Classic Gucci — aggiungi / modifica indirizzo
 *}
{extends file='parent:customer/address.tpl'}

{block name='page_title'}
  {if $editing}
    {if $language.iso_code == 'it'}Modifica indirizzo{else}{l s='Update your address' d='Shop.Theme.Customeraccount'}{/if}
  {else}
    {if $language.iso_code == 'it'}Nuovo indirizzo{else}{l s='New address' d='Shop.Theme.Customeraccount'}{/if}
  {/if}
{/block}

{block name='page_content'}
  <div class="gucci-page-content gucci-address-form-page">
    {$smarty.block.parent}
  </div>
{/block}
