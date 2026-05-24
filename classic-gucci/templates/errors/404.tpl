{**
 * Classic Gucci — catalogo vuoto (404 prodotti)
 *}
{extends file='parent:errors/404.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Nessun prodotto{else}{$smarty.block.parent}{/if}
{/block}

{capture assign='errorContent'}
  {if $language.iso_code == 'it'}
    <h4 class="gucci-error-title">Nessun prodotto disponibile</h4>
    <p class="gucci-error-text">Torna presto: aggiungeremo nuovi articoli al catalogo.</p>
    <p class="gucci-error-actions">
      <a href="{$urls.pages.index}" class="gucci-btn gucci-btn--primary">Torna alla home</a>
    </p>
  {else}
    <h4>{l s='No products available yet' d='Shop.Theme.Catalog'}</h4>
    <p>{l s='Stay tuned! More products will be shown here as they are added.' d='Shop.Theme.Catalog'}</p>
  {/if}
{/capture}
