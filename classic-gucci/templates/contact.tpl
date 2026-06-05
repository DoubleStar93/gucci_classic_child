{**
 * Classic Gucci — contatti full width, form luxury
 *}
{extends file='parent:contact.tpl'}

{block name='page_header_container'}{/block}

{block name='left_column'}{/block}
{block name='right_column'}{/block}

{block name='page_content'}
  <header class="page-header gucci-page-header gucci-contact-header">
    <h1 class="gucci-page-title">
      {if $language.iso_code == 'it'}Contattaci{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
    </h1>
  </header>

  <div class="gucci-contact-page">
    {hook h='displayContactContent'}
  </div>
{/block}
