{**
 * Classic Gucci — link footer in accordion stile gucci.com
 *}
{foreach $linkBlocks as $linkBlock}
  {assign var='gucciFooterTitle' value=$linkBlock.title}
  {if $language.iso_code == 'it'}
    {if $linkBlock.title == 'Products'}{assign var='gucciFooterTitle' value='Prodotti'}{/if}
    {if $linkBlock.title == 'Our company'}{assign var='gucciFooterTitle' value='La nostra azienda'}{/if}
    {if $linkBlock.title == 'My account'}{assign var='gucciFooterTitle' value='Il mio account'}{/if}
    {if $linkBlock.title == 'Information'}{assign var='gucciFooterTitle' value='Informazioni'}{/if}
    {if $linkBlock.title == 'Your account'}{assign var='gucciFooterTitle' value='Il mio account'}{/if}
    {if $linkBlock.title == 'Legal' || $linkBlock.title == 'Note Legali'}{assign var='gucciFooterTitle' value='Note legali'}{/if}
  {/if}
  <div class="col-12 gucci-footer-col gucci-footer-accordion">
    <button
      type="button"
      class="gucci-footer-accordion-trigger"
      aria-expanded="false"
      aria-controls="gucci-footer-panel-{$linkBlock.id}"
      data-gucci-footer-accordion-trigger
    >
      {$gucciFooterTitle|escape:'htmlall':'UTF-8'}
    </button>
    <div id="gucci-footer-panel-{$linkBlock.id}" class="gucci-footer-accordion-panel" hidden>
      <ul class="gucci-footer-links">
        {foreach $linkBlock.links as $link}
          {assign var='gucciLinkTitle' value=$link.title}
          {if $language.iso_code == 'it'}
            {if $link.title == 'Delivery'}{assign var='gucciLinkTitle' value='Spedizioni'}{/if}
            {if $link.title == 'Legal Notice'}{assign var='gucciLinkTitle' value='Note legali'}{/if}
            {if $link.title == 'Terms and conditions of use'}{assign var='gucciLinkTitle' value='Termini e condizioni'}{/if}
            {if $link.title == 'About us'}{assign var='gucciLinkTitle' value='Chi siamo'}{/if}
            {if $link.title == 'Secure payment'}{assign var='gucciLinkTitle' value='Pagamento sicuro'}{/if}
            {if $link.title == 'Contact us'}{assign var='gucciLinkTitle' value='Contattaci'}{/if}
            {if $link.title == 'Sitemap'}{assign var='gucciLinkTitle' value='Mappa del sito'}{/if}
            {if $link.title == 'Stores'}{assign var='gucciLinkTitle' value='Negozi'}{/if}
            {if $link.title == 'New products'}{assign var='gucciLinkTitle' value='Nuovi prodotti'}{/if}
            {if $link.title == 'Best sellers'}{assign var='gucciLinkTitle' value='Più venduti'}{/if}
            {if $link.title == 'Prices drop' || $link.title == 'Specials'}{assign var='gucciLinkTitle' value='Offerte'}{/if}
            {if $link.title == 'Sign in'}{assign var='gucciLinkTitle' value='Accedi'}{/if}
            {if $link.title == 'Create account'}{assign var='gucciLinkTitle' value='Crea account'}{/if}
            {if $link.title == 'My account'}{assign var='gucciLinkTitle' value='Il mio account'}{/if}
            {if $link.title == 'Orders'}{assign var='gucciLinkTitle' value='I miei ordini'}{/if}
            {if $link.title == 'Addresses'}{assign var='gucciLinkTitle' value='I miei indirizzi'}{/if}
            {if $link.title == 'Personal info'}{assign var='gucciLinkTitle' value='Informazioni personali'}{/if}
            {if $link.title == 'Order tracking'}{assign var='gucciLinkTitle' value='Tracciamento ordine'}{/if}
            {if $link.title == 'Privacy Policy'}{assign var='gucciLinkTitle' value='Informativa privacy'}{/if}
            {if $link.title == 'Cookie Policy'}{assign var='gucciLinkTitle' value='Cookie policy'}{/if}
          {/if}
          <li>
            <a
              id="{$link.id}-{$linkBlock.id}"
              class="{$link.class}"
              href="{$link.url}"
              title="{$link.description}"
              {if !empty($link.target)} target="{$link.target}" {/if}
            >
              {$gucciLinkTitle|escape:'htmlall':'UTF-8'}
            </a>
          </li>
        {/foreach}
      </ul>
    </div>
  </div>
{/foreach}
