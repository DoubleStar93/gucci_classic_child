{**
 * Barbara Alvisi — servizi nel buybox PDP (stile luxury reference)
 *}
<div class="barbaraalvisi-pdp-buybox-services">
  <div class="barbaraalvisi-pdp-accordion barbaraalvisi-pdp-accordion--buybox">
    <button
      type="button"
      class="barbaraalvisi-pdp-accordion-trigger barbaraalvisi-pdp-accordion-trigger--services"
      aria-expanded="false"
      aria-controls="barbaraalvisi-pdp-panel-buybox-services"
      data-barbaraalvisi-accordion-trigger
    >
      {if $language.iso_code == 'it'}Servizi{else}{l s='Services' d='Shop.Theme.Global'}{/if}
    </button>
    <div id="barbaraalvisi-pdp-panel-buybox-services" class="barbaraalvisi-pdp-accordion-panel" hidden>
      <ul class="barbaraalvisi-pdp-services-list">
        <li>{if $language.iso_code == 'it'}Spedizione e ritiro in negozio gratuiti{else}{l s='Free shipping' d='Shop.Theme.Checkout'}{/if}</li>
        <li>{if $language.iso_code == 'it'}Cambi e resi gratuiti{else}{l s='Free returns' d='Shop.Theme.Customeraccount'}{/if}</li>
        <li>{if $language.iso_code == 'it'}Pagamenti sicuri{else}{l s='Secure payment' d='Shop.Theme.Global'}{/if}</li>
        <li>{if $language.iso_code == 'it'}Packaging distintivo{else}{l s='Distinctive packaging' d='Shop.Theme.Global'}{/if}</li>
      </ul>
    </div>
  </div>

  <p class="barbaraalvisi-pdp-services-summary">
    {if $language.iso_code == 'it'}
      Spedizione e ritiro in negozio gratuiti, Cambi e resi gratuiti, Pagamenti sicuri e Packaging distintivo
    {else}
      {l s='Free shipping and returns, secure payments and distinctive packaging.' d='Shop.Theme.Global'}
    {/if}
  </p>
</div>
