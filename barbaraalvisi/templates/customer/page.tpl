{**
 * Barbara Alvisi — layout pagine account (notifiche + link indietro)
 *}
{extends file='parent:customer/page.tpl'}

{block name='page_content_top'}
  <div class="barbaraalvisi-customer-page-top">
    {$smarty.block.parent}
  </div>
{/block}

{block name='my_account_links'}
  <nav class="barbaraalvisi-account-back-links" aria-label="{l s='Your account' d='Shop.Theme.Customeraccount'}">
    {$smarty.block.parent}
  </nav>
{/block}
