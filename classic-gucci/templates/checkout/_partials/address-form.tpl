{**
 * Classic Gucci — form indirizzo checkout
 *}
{extends file='parent:checkout/_partials/address-form.tpl'}

{block name='form_buttons'}
  {if !$form_has_continue_button}
    <button class="gucci-btn gucci-btn--outline" type="submit">
      {if $language.iso_code == 'it'}Salva{else}{l s='Save' d='Shop.Theme.Actions'}{/if}
    </button>
    <a class="gucci-btn gucci-btn--outline" href="{$urls.pages.order}">
      {if $language.iso_code == 'it'}Annulla{else}{l s='Cancel' d='Shop.Theme.Actions'}{/if}
    </a>
  {else}
    <button type="submit" class="gucci-btn gucci-btn--primary continue" name="confirm-addresses" value="1">
      {if $language.iso_code == 'it'}Continua{else}{l s='Continue' d='Shop.Theme.Actions'}{/if}
    </button>
    {if $customer.addresses|count > 0}
      <a class="gucci-checkout-link" href="{$urls.pages.order}">
        {if $language.iso_code == 'it'}Annulla{else}{l s='Cancel' d='Shop.Theme.Actions'}{/if}
      </a>
    {/if}
  {/if}
{/block}
