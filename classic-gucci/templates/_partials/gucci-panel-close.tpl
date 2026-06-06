{**
 * Classic Gucci — pulsante Chiudi testuale (drawer / modali)
 *
 * @param string $extraClass classi aggiuntive sul button
 * @param string $closeAttr    attributi HTML (es. data-gucci-search-close o data-dismiss="modal")
 *}
<button
  type="button"
  class="gucci-panel-close btn-unstyle{if !empty($extraClass)} {$extraClass|escape:'htmlall':'UTF-8'}{/if}"
  aria-label="{if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}"
  {if !empty($closeAttr)}{$closeAttr}{/if}
>
  {if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}
</button>
