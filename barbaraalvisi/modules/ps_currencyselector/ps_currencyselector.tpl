{**
 * Barbara Alvisi — selettore valuta footer
 *}
{if $currencies|count > 1}
  <div
    class="barbaraalvisi-footer-locale currency-selector"
    id="_footer_currency_selector"
    aria-label="{if $language.iso_code == 'it'}Valuta{else}{l s='Currency' d='Shop.Theme.Global'}{/if}"
  >
    <ul class="barbaraalvisi-footer-locale-list">
      {foreach from=$currencies item=currency}
        <li>
          <a
            href="{$currency.url}"
            class="barbaraalvisi-footer-locale-link{if $currency.id == $current_currency.id} is-active{/if}"
          >
            {$currency.iso_code}{if $currency.sign !== $currency.iso_code} {$currency.sign}{/if}
          </a>
        </li>
      {/foreach}
    </ul>
  </div>
{/if}
