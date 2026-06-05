{**
 * Classic Gucci — footer unico stile gucci.com (colonne + meta + copyright)
 *}
<div class="gucci-footer footer-container" role="contentinfo">
  <div class="gucci-footer-inner">
    <section class="gucci-footer-newsletter-wrap" aria-label="{l s='Newsletter' d='Shop.Theme.Global'}">
      {widget name='ps_emailsubscription'}
    </section>

    <section class="gucci-footer-links-wrap" aria-label="{l s='Footer' d='Shop.Theme.Global'}">
      <div class="gucci-footer-accordions gucci-footer-columns row mx-0">
        {block name='hook_footer'}
          {hook h='displayFooter'}
        {/block}
        <div class="col-12 gucci-footer-col gucci-footer-accordion gucci-footer-col--legal">
          <button
            type="button"
            class="gucci-footer-accordion-trigger"
            aria-expanded="false"
            aria-controls="gucci-footer-panel-legal"
            data-gucci-accordion-trigger
          >
            {if $language.iso_code == 'it'}Note legali{else}{l s='Legal' d='Shop.Theme.Global'}{/if}
          </button>
          <div id="gucci-footer-panel-legal" class="gucci-footer-accordion-panel" hidden>
            <ul class="gucci-footer-links">
              <li>
                <a
                  href="https://www.iubenda.com/privacy-policy/59544586"
                  class="gucci-footer-legal-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="{if $language.iso_code == 'it'}Informativa privacy{else}Privacy Policy{/if}"
                >
                  {if $language.iso_code == 'it'}Informativa privacy{else}Privacy Policy{/if}
                </a>
              </li>
              <li>
                <a
                  href="https://www.iubenda.com/privacy-policy/59544586/cookie-policy"
                  class="gucci-footer-legal-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="{if $language.iso_code == 'it'}Cookie policy{else}Cookie Policy{/if}"
                >
                  {if $language.iso_code == 'it'}Cookie policy{else}Cookie Policy{/if}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="gucci-footer-meta">
      <div class="gucci-footer-meta-row">
        {widget name='ps_languageselector'}
        {widget name='ps_currencyselector'}
        {widget name='ps_socialfollow'}
      </div>
    </section>

    <p class="gucci-footer-copyright">
      {block name='copyright_link'}
        &copy; {'Y'|date} {$shop.name}.
        {if $language.iso_code == 'it'}
          Tutti i diritti riservati.
        {else}
          {l s='All rights reserved.' d='Shop.Theme.Global'}
        {/if}
      {/block}
    </p>
  </div>
</div>
