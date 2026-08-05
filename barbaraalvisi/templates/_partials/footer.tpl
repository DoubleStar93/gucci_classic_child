{**
 * Barbara Alvisi — footer unico stile luxury reference (colonne + meta + copyright)
 *}
<div class="barbaraalvisi-footer footer-container" role="contentinfo">
  <div class="barbaraalvisi-footer-inner">
    <section class="barbaraalvisi-footer-newsletter-wrap" aria-label="{l s='Newsletter' d='Shop.Theme.Global'}">
      {widget name='ps_emailsubscription'}
    </section>

    <section class="barbaraalvisi-footer-links-wrap" aria-label="{l s='Footer' d='Shop.Theme.Global'}">
      <div class="barbaraalvisi-footer-accordions barbaraalvisi-footer-columns row mx-0">
        {block name='hook_footer'}
          {hook h='displayFooter'}
        {/block}
      </div>
    </section>

    <section class="barbaraalvisi-footer-meta">
      <div class="barbaraalvisi-footer-meta-row">
        {widget name='ps_languageselector'}
        {widget name='ps_socialfollow'}
        <p class="barbaraalvisi-footer-copyright">
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
    </section>
  </div>
</div>
