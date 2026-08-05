{**
 * Barbara Alvisi — form indirizzo account
 *}
{extends file='parent:customer/_partials/address-form.tpl'}

{block name='form_buttons'}
  <button class="barbaraalvisi-btn barbaraalvisi-btn--primary" type="submit">
    {if $language.iso_code == 'it'}Salva{else}{l s='Save' d='Shop.Theme.Actions'}{/if}
  </button>
  <a class="barbaraalvisi-btn barbaraalvisi-btn--outline" href="{$urls.pages.addresses}">
    {if $language.iso_code == 'it'}Annulla{else}{l s='Cancel' d='Shop.Theme.Actions'}{/if}
  </a>
{/block}
