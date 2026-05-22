{**
 * Classic Gucci — footer a colonne stile luxury
 *}
<div class="gucci-footer-before">
  <div class="container">
    <div class="row">
      {block name='hook_footer_before'}
        {hook h='displayFooterBefore'}
      {/block}
    </div>
  </div>
</div>

<footer class="gucci-footer footer-container">
  <div class="container">
    <div class="row gucci-footer-columns">
      {block name='hook_footer'}
        {hook h='displayFooter'}
      {/block}
    </div>

    <div class="row">
      {block name='hook_footer_after'}
        {hook h='displayFooterAfter'}
      {/block}
    </div>

    <div class="row gucci-footer-copyright">
      <div class="col-md-12">
        <p>
          {block name='copyright_link'}
            &copy; {'Y'|date} {$shop.name}. {l s='All rights reserved.' d='Shop.Theme.Global'}
          {/block}
        </p>
      </div>
    </div>
  </div>
</footer>
