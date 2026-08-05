{**
 * Classic Gucci — pagina Contattaci (colonna singola)
 *}
{extends file='parent:contact.tpl'}

{block name='page_header_container'}{/block}

{block name='left_column'}{/block}
{block name='right_column'}{/block}

{block name='page_content'}
  <div class="gucci-contact-page">
    <header class="gucci-contact-header">
      <p class="gucci-contact-eyebrow" aria-hidden="true">
        {if $language.iso_code == 'it'}Assistenza{else}{l s='Customer care' d='Shop.Theme.Global'}{/if}
      </p>
      <h1 class="gucci-page-title gucci-contact-title">
        {if $language.iso_code == 'it'}Contattaci{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
      </h1>
      <p class="gucci-contact-lead">
        {if $language.iso_code == 'it'}
          Scrivici per assistenza su ordini, prodotti o informazioni generali. Ti risponderemo il prima possibile.
        {else}
          {l s='Contact us for assistance with orders, products or general enquiries.' d='Shop.Theme.Global'}
        {/if}
      </p>
    </header>

    <div class="gucci-contact-form-wrap">
      {hook h='displayContactContent'}
    </div>
  </div>
{/block}
