{**
 * Classic Gucci — footer stile gucci.com (nero + accordion)
 *}
<div class="gucci-footer-before">
  <div class="container-fluid gucci-footer-before-inner">
    {block name='hook_footer_before'}
      {hook h='displayFooterBefore'}
    {/block}
  </div>
</div>

<footer class="gucci-footer footer-container">
  <div class="container-fluid gucci-footer-inner">
    <div class="gucci-footer-top">
      <section class="gucci-footer-store-locator" aria-labelledby="gucci-footer-store-title">
        <h3 id="gucci-footer-store-title" class="gucci-footer-heading">
          {if $language.iso_code == 'it'}Ricerca negozio{else}{l s='Find a store' d='Shop.Theme.Global'}{/if}
        </h3>
        <form class="gucci-footer-store-form" action="{$urls.pages.stores|default:'#'}" method="get">
          <input
            type="text"
            name="search"
            class="gucci-footer-input"
            placeholder="{if $language.iso_code == 'it'}Paese/Regione, Città{else}{l s='Country, City' d='Shop.Theme.Global'}{/if}"
            aria-label="{if $language.iso_code == 'it'}Paese/Regione, Città{else}{l s='Country, City' d='Shop.Theme.Global'}{/if}"
          >
          <button type="submit" class="gucci-footer-submit btn-unstyle">
            {if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Actions'}{/if}
          </button>
        </form>
      </section>
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
