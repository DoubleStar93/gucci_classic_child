{**
 * Barbara Alvisi — account icon + drawer
 *}
<div id="_desktop_user_info" class="barbaraalvisi-account">
  <div class="user-info">
    <button
      type="button"
      id="barbaraalvisi-account-toggle"
      class="barbaraalvisi-account-toggle btn-unstyle"
      aria-label="{if $logged}{if $language.iso_code == 'it'}Il mio account{else}{l s='My account' d='Shop.Theme.Customeraccount'}{/if}{else}{if $language.iso_code == 'it'}Accedi{else}{l s='Sign in' d='Shop.Theme.Actions'}{/if}{/if}"
      aria-expanded="false"
      aria-controls="barbaraalvisi-account-drawer"
    >
      <i class="material-icons" aria-hidden="true">person_outline</i>
    </button>
  </div>
</div>
