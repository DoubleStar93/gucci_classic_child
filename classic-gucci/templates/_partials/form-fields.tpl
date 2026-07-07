{**
 * Classic Gucci — campi form (checkbox IT su checkout/account)
 *}
{extends file='parent:_partials/form-fields.tpl'}

{block name='form_field'}
  {if $language.iso_code == 'it' && $field.name == 'customer_privacy' && (($page.page_name|default:'') == 'checkout' || ($smarty.get.controller|default:'') == 'order')}
    <input
      type="hidden"
      name="customer_privacy"
      value=""
      class="js-gucci-customer-privacy-sync"
      disabled
      aria-hidden="true"
    >
    {block name='form_field_errors'}
      {include file='_partials/form-errors.tpl' errors=$field.errors}
    {/block}
  {else}
    {$smarty.block.parent}
  {/if}
{/block}

{block name='form_field_item_checkbox'}
  {if $language.iso_code == 'it' && $field.name == 'customer_privacy' && (($page.page_name|default:'') == 'checkout' || ($smarty.get.controller|default:'') == 'order')}
    {* Campo mirror: vedi blocco form_field *}
  {else}
  <div class="col-md-{$field.width|default:12} form-group{if $field.required} required{/if}">
    <span class="custom-checkbox gucci-form-checkbox">
      <label>
        <input
          name="{$field.name}"
          type="checkbox"
          value="1"
          {if $field.required}required{/if}
        >
        <span><i class="material-icons rtl-no-flip checkbox-checked">&#xE5CA;</i></span>
        {if $language.iso_code == 'it'}
          {if $field.name == 'conditions_to_approve'}
            Accetto i <a href="{$urls.base_url}index.php?id_cms=3&amp;controller=cms&amp;id_lang={$language.id}" target="_blank" rel="noopener">termini e condizioni</a> e l'<a href="{$urls.base_url}index.php?id_cms=2&amp;controller=cms&amp;id_lang={$language.id}" target="_blank" rel="noopener">informativa sulla privacy</a>
          {elseif $field.name == 'psgdpr'}
            Accetto i <a href="{$urls.base_url}index.php?id_cms=3&amp;controller=cms&amp;id_lang={$language.id}" target="_blank" rel="noopener">termini e condizioni</a> e dichiaro di aver letto l'<a href="{$urls.base_url}index.php?id_cms=2&amp;controller=cms&amp;id_lang={$language.id}" target="_blank" rel="noopener">informativa sulla privacy</a>
          {elseif $field.name == 'customer_privacy'}
            Ho letto l'<a href="{$urls.base_url}index.php?id_cms=2&amp;controller=cms&amp;id_lang={$language.id}" target="_blank" rel="noopener">informativa sulla privacy</a> e acconsento al trattamento dei miei dati personali
          {else}
            {$field.label nofilter}
          {/if}
        {else}
          {$field.label nofilter}
        {/if}
      </label>
    </span>
    {block name='form_field_errors'}
      {include file='_partials/form-errors.tpl' errors=$field.errors}
    {/block}
  </div>
  {/if}
{/block}
