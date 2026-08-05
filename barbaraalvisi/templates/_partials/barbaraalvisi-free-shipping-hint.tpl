{**
 * Messaggio soglia spedizione gratuita — importo inline con spazi espliciti.
 *}
{if isset($barbaraalvisi_free_shipping_show) && $barbaraalvisi_free_shipping_show && $barbaraalvisi_free_shipping_remaining_value|count_characters > 0}
  <div class="barbaraalvisi-free-shipping-hint" aria-live="polite">
    {if $language.iso_code == 'it'}
      <p class="barbaraalvisi-free-shipping-hint__text">
        SPEDIZIONE GRATUITA SE AGGIUNGI ALTRI <span class="barbaraalvisi-free-shipping-hint__amount">{$barbaraalvisi_free_shipping_remaining_value}</span> DI SPESA AL CARRELLO.
      </p>
    {else}
      <p class="barbaraalvisi-free-shipping-hint__text">
        {l s='Free shipping if you add another' d='Shop.Theme.Checkout'} <span class="barbaraalvisi-free-shipping-hint__amount">{$barbaraalvisi_free_shipping_remaining_value}</span> {l s='of spending to your cart.' d='Shop.Theme.Checkout'}
      </p>
    {/if}
  </div>
{/if}
