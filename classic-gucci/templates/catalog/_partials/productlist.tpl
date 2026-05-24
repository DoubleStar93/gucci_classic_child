{**
 * Classic Gucci — griglia prodotti (home + listing)
 * Quadrata, full-bleed, zero gap — classe gucci-plp-grid
 *}
<div class="products gucci-plp-grid{if !empty($cssClass)} {$cssClass|escape:'htmlall':'UTF-8'}{/if}">
  {foreach from=$products item="product" key="position"}
    {include
      file='catalog/_partials/miniatures/product.tpl'
      product=$product
      position=$position
      productClasses=$productClass
    }
  {/foreach}
</div>
