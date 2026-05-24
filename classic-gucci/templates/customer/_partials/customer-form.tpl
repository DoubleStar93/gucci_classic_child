{**
 * Classic Gucci — form registrazione / dati cliente
 *}
{extends file='parent:customer/_partials/customer-form.tpl'}

{block name='form_buttons'}
  <button
    class="gucci-btn gucci-btn--primary"
    data-link-action="register-new-customer"
    type="submit"
  >
    {if $language.iso_code == 'it'}Crea account{else}{l s='Save' d='Shop.Theme.Actions'}{/if}
  </button>
{/block}
