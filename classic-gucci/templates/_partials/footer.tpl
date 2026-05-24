{**
 * Classic Gucci — footer unico stile gucci.com (colonne + meta + copyright)
 *}
<div class="gucci-footer footer-container" role="contentinfo">
  <div class="gucci-footer-inner">
    <section class="gucci-footer-links-wrap" aria-label="{l s='Footer' d='Shop.Theme.Global'}">
      <div class="gucci-footer-accordions gucci-footer-columns row mx-0">
        {block name='hook_footer'}
          {hook h='displayFooter'}
        {/block}
      </div>
    </section>

    <section class="gucci-footer-meta">{block name='hook_footer_after'}{hook h='displayFooterAfter'}{/block}</section>

    <p class="gucci-footer-copyright">
      {block name='copyright_link'}
        &copy; {'Y'|date} {$shop.name}. {l s='All rights reserved.' d='Shop.Theme.Global'}
      {/block}
    </p>
  </div>
</div>
