{**
 * Barbara Alvisi — carrello vuoto (layout centrato, senza griglia a 2 colonne)
 *}
{extends file='checkout/cart.tpl'}

{block name='content'}
  <section id="main">
    <div class="barbaraalvisi-cart-page barbaraalvisi-cart-page--empty">
      <header class="barbaraalvisi-cart-header">
        <h1 class="barbaraalvisi-cart-title">
          {if $language.iso_code == 'it'}Carrello{else}{l s='Shopping Cart' d='Shop.Theme.Checkout'}{/if}
        </h1>
      </header>

      <div class="barbaraalvisi-cart-empty">
        <p class="barbaraalvisi-cart-empty-text">
          {if $language.iso_code == 'it'}Non ci sono articoli nel carrello{else}{l s='There are no more items in your cart' d='Shop.Theme.Checkout'}{/if}
        </p>
        <a class="barbaraalvisi-btn barbaraalvisi-btn--outline barbaraalvisi-cart-empty-cta" href="{$urls.pages.index}">
          {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}
        </a>
      </div>
    </div>

    {block name='display_crossselling'}
      {include
        file='_partials/barbaraalvisi-featured-products-strip.tpl'
        wrapperClass='barbaraalvisi-cart-cross-selling'
        hookName='displayCrossSellingShoppingCart'
        widgetHook='displayHome'
      }
    {/block}
  </section>
{/block}
