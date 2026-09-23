{**
 * Barbara Alvisi — footer unico stile luxury reference (colonne + meta + copyright)
 *}
<div class="barbaraalvisi-footer footer-container" role="contentinfo">
  <div class="barbaraalvisi-footer-inner">
    <section class="barbaraalvisi-footer-newsletter-wrap" aria-label="{l s='Newsletter' d='Shop.Theme.Global'}">
      {widget name='ps_emailsubscription'}
      <a
        class="barbaraalvisi-footer-instagram"
        href="https://www.instagram.com/barbaraalvisiofficial"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg class="barbaraalvisi-footer-instagram__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
        <span>{if $language.iso_code == 'it'}Seguici su Instagram{else}Follow us on Instagram{/if}</span>
      </a>
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
