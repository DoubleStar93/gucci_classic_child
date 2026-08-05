{**
 * Barbara Alvisi — dati personali account
 *}
{extends file='parent:customer/identity.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Informazioni personali{else}{l s='Your personal information' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-auth-page barbaraalvisi-page-content">
    {$smarty.block.parent}
  </div>
{/block}
