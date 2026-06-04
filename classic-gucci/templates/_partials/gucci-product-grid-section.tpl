{**
 * Classic Gucci — sezione griglia prodotti (stessa logica homepage)
 *
 * @param array  $products
 * @param string $sectionTitle
 * @param string $sectionClass   classi extra sulla section
 * @param string $titleClass     classi extra sul titolo
 *}
{if $products|count}
  <section class="gucci-product-grid-section{if !empty($sectionClass)} {$sectionClass|escape:'htmlall':'UTF-8'}{/if} clearfix">
    {if !empty($sectionTitle)}
      <header class="gucci-product-grid-section__header">
        <p class="gucci-product-grid-section__title{if !empty($titleClass)} {$titleClass|escape:'htmlall':'UTF-8'}{/if}">
          {$sectionTitle}
        </p>
      </header>
    {/if}

    {include
      file='catalog/_partials/productlist.tpl'
      products=$products
      productClass='gucci-plp-cell gucci-product-miniature'
      maxProducts=8
    }
  </section>
{/if}
