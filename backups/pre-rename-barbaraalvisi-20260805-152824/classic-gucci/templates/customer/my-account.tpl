{**
 * Classic Gucci — il mio account
 *}
{extends file='parent:customer/my-account.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Il mio account{else}{l s='Your account' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  {block name='display_customer_account_top'}
    {hook h='displayCustomerAccountTop'}
  {/block}

  <nav class="gucci-account-links" aria-label="{l s='Your account' d='Shop.Theme.Customeraccount'}">
    <a class="gucci-account-link" id="identity-link" href="{$urls.pages.identity}">
      {if $language.iso_code == 'it'}Informazioni personali{else}{l s='Information' d='Shop.Theme.Customeraccount'}{/if}
    </a>

    {if $customer.addresses|count}
      <a class="gucci-account-link" id="addresses-link" href="{$urls.pages.addresses}">
        {if $language.iso_code == 'it'}Indirizzi{else}{l s='Addresses' d='Shop.Theme.Customeraccount'}{/if}
      </a>
    {else}
      <a class="gucci-account-link" id="address-link" href="{$urls.pages.address}">
        {if $language.iso_code == 'it'}Aggiungi indirizzo{else}{l s='Add first address' d='Shop.Theme.Customeraccount'}{/if}
      </a>
    {/if}

    {if !$configuration.is_catalog}
      <a class="gucci-account-link" id="history-link" href="{$urls.pages.history}">
        {if $language.iso_code == 'it'}Ordini{else}{l s='Order history and details' d='Shop.Theme.Customeraccount'}{/if}
      </a>
    {/if}

    {if !$configuration.is_catalog}
      <a class="gucci-account-link" id="order-slips-link" href="{$urls.pages.order_slip}">
        {if $language.iso_code == 'it'}Note di credito{else}{l s='Credit slips' d='Shop.Theme.Customeraccount'}{/if}
      </a>
    {/if}

    {if $configuration.voucher_enabled && !$configuration.is_catalog}
      <a class="gucci-account-link" id="discounts-link" href="{$urls.pages.discount}">
        {if $language.iso_code == 'it'}Buoni sconto{else}{l s='Vouchers' d='Shop.Theme.Customeraccount'}{/if}
      </a>
    {/if}

    {if $configuration.return_enabled && !$configuration.is_catalog}
      <a class="gucci-account-link" id="returns-link" href="{$urls.pages.order_follow}">
        {if $language.iso_code == 'it'}Resi{else}{l s='Merchandise returns' d='Shop.Theme.Customeraccount'}{/if}
      </a>
    {/if}

    {block name='display_customer_account'}
      {hook h='displayCustomerAccount'}
    {/block}
  </nav>
{/block}

{block name='page_footer'}
  {block name='my_account_links'}
    <div class="gucci-account-logout">
      <a href="{$urls.actions.logout}">
        {if $language.iso_code == 'it'}Esci{else}{l s='Sign out' d='Shop.Theme.Actions'}{/if}
      </a>
    </div>
  {/block}
{/block}
