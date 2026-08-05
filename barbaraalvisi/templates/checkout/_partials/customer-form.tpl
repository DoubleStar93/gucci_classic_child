{**
 * Barbara Alvisi — form cliente checkout (guest)
 *}
{extends file='parent:checkout/_partials/customer-form.tpl'}

{block name='form_buttons'}
  <div class="barbaraalvisi-checkout-form-actions">
  <button
    type="submit"
    class="barbaraalvisi-btn barbaraalvisi-btn--primary continue btn btn-primary"
    name="continue"
    data-link-action="register-new-customer"
  >
    {if $language.iso_code == 'it'}Continua{else}{l s='Continue' d='Shop.Theme.Actions'}{/if}
  </button>
  </div>
{/block}
