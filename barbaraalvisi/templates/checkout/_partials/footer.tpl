{**
 * Barbara Alvisi — footer checkout (sostituisce copyright PrestaShop default)
 *}
<div class="barbaraalvisi-checkout-footer" role="contentinfo">
  <div class="barbaraalvisi-checkout-footer__inner">
    {if $tos_cms != false}
      <div class="barbaraalvisi-checkout-footer__terms">
        {$tos_cms nofilter}
      </div>
    {/if}
    <p class="barbaraalvisi-checkout-footer__copyright">
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
