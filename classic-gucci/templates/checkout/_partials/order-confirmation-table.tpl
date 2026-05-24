{**
 * Classic Gucci — tabella riepilogo conferma ordine (etichette IT)
 *}
{extends file='parent:checkout/_partials/order-confirmation-table.tpl'}

{block name='order_items_table_head'}
  <thead>
    <tr>
      <th colspan="2">
        {if $language.iso_code == 'it'}Articoli{else}{l s='Order items' d='Shop.Theme.Checkout'}{/if}
      </th>
      <th>
        {if $language.iso_code == 'it'}Prezzo{else}{l s='Unit price' d='Shop.Theme.Checkout'}{/if}
      </th>
      <th>
        {if $language.iso_code == 'it'}Qtà{else}{l s='Quantity' d='Shop.Theme.Checkout'}{/if}
      </th>
      <th>
        {if $language.iso_code == 'it'}Totale{else}{l s='Total products' d='Shop.Theme.Checkout'}{/if}
      </th>
    </tr>
  </thead>
{/block}
