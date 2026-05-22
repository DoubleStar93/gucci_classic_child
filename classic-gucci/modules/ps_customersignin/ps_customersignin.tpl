{**
 * Classic Gucci — account icona minimal
 *}
<div id="_desktop_user_info" class="gucci-account">
  <div class="user-info">
    {if $logged}
      <a
        class="account"
        href="{$urls.pages.my_account}"
        title="{l s='View my customer account' d='Shop.Theme.Customeraccount'}"
        rel="nofollow"
        aria-label="{l s='My account' d='Shop.Theme.Customeraccount'}"
      >
        <i class="material-icons" aria-hidden="true">person_outline</i>
      </a>
    {else}
      <a
        href="{$urls.pages.authentication}?back={$urls.current_url|urlencode}"
        title="{l s='Log in to your customer account' d='Shop.Theme.Customeraccount'}"
        rel="nofollow"
        aria-label="{l s='Sign in' d='Shop.Theme.Actions'}"
      >
        <i class="material-icons" aria-hidden="true">person_outline</i>
      </a>
    {/if}
  </div>
</div>
