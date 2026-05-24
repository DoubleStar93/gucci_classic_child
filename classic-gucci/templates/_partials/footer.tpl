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
