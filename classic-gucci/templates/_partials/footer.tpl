{**
 * Classic Gucci — footer stile gucci.com (nero + accordion + newsletter)
 *}
<footer class="gucci-footer footer-container">
  <div class="container-fluid gucci-footer-inner">
    <div class="gucci-footer-newsletter-wrap">
      {block name='hook_footer_before'}
        {hook h='displayFooterBefore'}
      {/block}
    </div>

    <div class="gucci-footer-accordions row gucci-footer-columns">
      {block name='hook_footer'}
        {hook h='displayFooter'}
      {/block}
    </div>

    <div class="gucci-footer-bottom">
      {block name='hook_footer_after'}
        {hook h='displayFooterAfter'}
      {/block}

      <p class="gucci-footer-copyright">
        {block name='copyright_link'}
          &copy; {'Y'|date} {$shop.name}. {l s='All rights reserved.' d='Shop.Theme.Global'}
        {/block}
      </p>
    </div>
  </div>
</footer>
