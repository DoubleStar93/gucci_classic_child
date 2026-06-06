{**
 * Classic Gucci — stato vuoto PLP (categoria / ricerca senza risultati)
 *}
<div class="gucci-plp-empty">
  {block name='gucci_plp_empty_title'}
    <h4 class="gucci-plp-empty-title">
      {if isset($gucciPlpEmptyTitle) && $gucciPlpEmptyTitle|trim}
        {$gucciPlpEmptyTitle|escape:'htmlall':'UTF-8'}
      {elseif $language.iso_code == 'it'}
        Non ci sono ancora prodotti disponibili
      {else}
        {l s='No products available yet' d='Shop.Theme.Catalog'}
      {/if}
    </h4>
  {/block}

  {block name='gucci_plp_empty_text'}
    <p class="gucci-plp-empty-text">
      {if isset($gucciPlpEmptyText) && $gucciPlpEmptyText|trim}
        {$gucciPlpEmptyText|escape:'htmlall':'UTF-8'}
      {elseif $language.iso_code == 'it'}
        Resta in contatto: nuovi articoli verranno aggiunti a breve.
      {else}
        {l s='Stay tuned! More products will be shown here as they are added.' d='Shop.Theme.Catalog'}
      {/if}
    </p>
  {/block}

  {block name='gucci_plp_empty_actions'}
    <p class="gucci-plp-empty-actions">
      <a href="{$urls.pages.index}" class="gucci-btn gucci-btn--primary">
        {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}
      </a>
    </p>
  {/block}
</div>
