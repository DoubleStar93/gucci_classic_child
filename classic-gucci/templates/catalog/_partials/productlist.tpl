{**
 * Classic Gucci — griglia prodotti unificata
 * Home, PLP, ricerca, offerte, marca, PDP correlati — gucci-plp-grid
 *
 * @param int $maxProducts  opzionale: limita (es. 8 come homepage); PLP non lo passa
 *}
{if isset($maxProducts) && $maxProducts > 0 && $products|@count > $maxProducts}
  {assign var='products' value=$products|array_slice:0:$maxProducts}
{/if}
<div class="products gucci-plp-grid gucci-product-grid{if !empty($cssClass)} {$cssClass|escape:'htmlall':'UTF-8'}{/if}" data-gucci-product-grid>
  {foreach from=$products item="product" key="position"}
    {include
      file='catalog/_partials/miniatures/product.tpl'
      product=$product
      position=$position
      productClasses=$productClass
    }
  {/foreach}
</div>
