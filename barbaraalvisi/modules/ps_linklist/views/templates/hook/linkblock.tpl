{**
 * Barbara Alvisi — link footer in accordion stile luxury reference
 *}
{foreach $linkBlocks as $linkBlock}
  {assign var='barbaraalvisiFooterTitle' value=$linkBlock.title}
  {if $language.iso_code == 'it'}
    {if $linkBlock.title == 'Products'}{assign var='barbaraalvisiFooterTitle' value='Prodotti'}{/if}
    {if $linkBlock.title == 'Our company'}{assign var='barbaraalvisiFooterTitle' value='La nostra azienda'}{/if}
    {if $linkBlock.title == 'My account'}{assign var='barbaraalvisiFooterTitle' value='Il mio account'}{/if}
    {if $linkBlock.title == 'Information'}{assign var='barbaraalvisiFooterTitle' value='Informazioni'}{/if}
    {if $linkBlock.title == 'Your account'}{assign var='barbaraalvisiFooterTitle' value='Il mio account'}{/if}
    {if $linkBlock.title == 'Legal' || $linkBlock.title == 'Note Legali'}{assign var='barbaraalvisiFooterTitle' value='Note legali'}{/if}
  {/if}
  <div class="col-12 barbaraalvisi-footer-col barbaraalvisi-footer-accordion">
    <button
      type="button"
      class="barbaraalvisi-footer-accordion-trigger"
      aria-expanded="false"
      aria-controls="barbaraalvisi-footer-panel-{$linkBlock.id}"
      data-barbaraalvisi-footer-accordion-trigger
    >
      {$barbaraalvisiFooterTitle|escape:'htmlall':'UTF-8'}
    </button>
    <div id="barbaraalvisi-footer-panel-{$linkBlock.id}" class="barbaraalvisi-footer-accordion-panel" hidden>
      <ul class="barbaraalvisi-footer-links">
        {foreach $linkBlock.links as $link}
          {assign var='barbaraalvisiLinkTitle' value=$link.title}
          {if $language.iso_code == 'it'}
            {if $link.title == 'Delivery'}{assign var='barbaraalvisiLinkTitle' value='Spedizioni'}{/if}
            {if $link.title == 'Legal Notice'}{assign var='barbaraalvisiLinkTitle' value='Note legali'}{/if}
            {if $link.title == 'Terms and conditions of use'}{assign var='barbaraalvisiLinkTitle' value='Termini e condizioni'}{/if}
            {if $link.title == 'About us'}{assign var='barbaraalvisiLinkTitle' value='Chi siamo'}{/if}
            {if $link.title == 'Secure payment'}{assign var='barbaraalvisiLinkTitle' value='Pagamento sicuro'}{/if}
            {if $link.title == 'Contact us'}{assign var='barbaraalvisiLinkTitle' value='Contattaci'}{/if}
            {if $link.title == 'Sitemap'}{assign var='barbaraalvisiLinkTitle' value='Mappa del sito'}{/if}
            {if $link.title == 'Stores'}{assign var='barbaraalvisiLinkTitle' value='Negozi'}{/if}
            {if $link.title == 'New products'}{assign var='barbaraalvisiLinkTitle' value='Nuovi prodotti'}{/if}
            {if $link.title == 'Best sellers'}{assign var='barbaraalvisiLinkTitle' value='Più venduti'}{/if}
            {if $link.title == 'Prices drop' || $link.title == 'Specials'}{assign var='barbaraalvisiLinkTitle' value='Offerte'}{/if}
            {if $link.title == 'Sign in'}{assign var='barbaraalvisiLinkTitle' value='Accedi'}{/if}
            {if $link.title == 'Create account'}{assign var='barbaraalvisiLinkTitle' value='Crea account'}{/if}
            {if $link.title == 'My account'}{assign var='barbaraalvisiLinkTitle' value='Il mio account'}{/if}
            {if $link.title == 'Orders'}{assign var='barbaraalvisiLinkTitle' value='I miei ordini'}{/if}
            {if $link.title == 'Addresses'}{assign var='barbaraalvisiLinkTitle' value='I miei indirizzi'}{/if}
            {if $link.title == 'Personal info'}{assign var='barbaraalvisiLinkTitle' value='Informazioni personali'}{/if}
            {if $link.title == 'Order tracking'}{assign var='barbaraalvisiLinkTitle' value='Tracciamento ordine'}{/if}
            {if $link.title == 'Privacy Policy'}{assign var='barbaraalvisiLinkTitle' value='Informativa privacy'}{/if}
            {if $link.title == 'Cookie Policy'}{assign var='barbaraalvisiLinkTitle' value='Cookie policy'}{/if}
          {/if}
          <li>
            <a
              id="{$link.id}-{$linkBlock.id}"
              class="{$link.class}"
              href="{$link.url}"
              title="{$link.description}"
              {if !empty($link.target)} target="{$link.target}" {/if}
            >
              {$barbaraalvisiLinkTitle|escape:'htmlall':'UTF-8'}
            </a>
          </li>
        {/foreach}
      </ul>
    </div>
  </div>
{/foreach}
