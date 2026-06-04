{**
 * Classic Gucci — strip prodotti (hook + fallback widget = griglia homepage)
 *
 * @param string $wrapperClass  classi sul contenitore
 * @param string $hookName      hook PrestaShop (es. displayCrossSellingShoppingCart)
 * @param string $widgetHook    hook per {widget} fallback (es. displayHome)
 * @param string $sectionTitle   titolo opzionale sopra la griglia
 *}
{if !empty($hookName) || !empty($widgetHook)}
  {if !empty($sectionTitle)}
    <header class="gucci-product-grid-section__header">
      <p class="gucci-product-grid-section__title">{$sectionTitle}</p>
    </header>
  {/if}

  <div class="gucci-product-grid-hook{if !empty($wrapperClass)} {$wrapperClass|escape:'htmlall':'UTF-8'}{/if}">
    {if !empty($hookName)}
      {capture assign='gucciProductsHook'}{hook h=$hookName}{/capture}
      {if $gucciProductsHook|trim != ''}
        {$gucciProductsHook nofilter}
      {elseif !empty($widgetHook)}
        {widget name='ps_featuredproducts' hook=$widgetHook}
      {/if}
    {elseif !empty($widgetHook)}
      {widget name='ps_featuredproducts' hook=$widgetHook}
    {/if}
  </div>
{/if}
