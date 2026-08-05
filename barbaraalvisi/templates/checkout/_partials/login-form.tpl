{**
 * Barbara Alvisi — login nel checkout
 *}
{extends file='parent:checkout/_partials/login-form.tpl'}

{block name='form_buttons'}
  <button
    id="submit-login"
    class="barbaraalvisi-btn barbaraalvisi-btn--primary"
    data-link-action="sign-in"
    type="submit"
  >
    {if $language.iso_code == 'it'}Accedi{else}{l s='Sign in' d='Shop.Theme.Actions'}{/if}
  </button>
{/block}
