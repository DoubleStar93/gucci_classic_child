{**
 * Classic Gucci — mappa etichetta EN → IT (breadcrumb, menu, …)
 * Uso: {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$path.title scope='parent'}
 *      poi {$gucciLabelOut}
 *}
{assign var='gucciLabelOut' value=$gucciLabelIn}
{if isset($language) && $language.iso_code == 'it'}
  {if $gucciLabelIn == 'Clothes' || $gucciLabelIn == 'clothes' || $gucciLabelIn == 'abbigliamento'}{assign var='gucciLabelOut' value='Abbigliamento'}{/if}
  {if $gucciLabelIn == 'Accessories' || $gucciLabelIn == 'accessories' || $gucciLabelIn == 'accessori'}{assign var='gucciLabelOut' value='Accessori'}{/if}
  {if $gucciLabelIn == 'Art' || $gucciLabelIn == 'art' || $gucciLabelIn == 'arte'}{assign var='gucciLabelOut' value='Arte'}{/if}
  {if $gucciLabelIn == 'Men' || $gucciLabelIn == 'men' || $gucciLabelIn == 'uomo'}{assign var='gucciLabelOut' value='Uomo'}{/if}
  {if $gucciLabelIn == 'Women' || $gucciLabelIn == 'women' || $gucciLabelIn == 'donna'}{assign var='gucciLabelOut' value='Donna'}{/if}
  {if $gucciLabelIn == 'Stationery' || $gucciLabelIn == 'stationery' || $gucciLabelIn == 'cancelleria'}{assign var='gucciLabelOut' value='Cancelleria'}{/if}
  {if $gucciLabelIn == 'Home Accessories' || $gucciLabelIn == 'home accessories' || $gucciLabelIn == 'accessori per la casa'}{assign var='gucciLabelOut' value='Accessori per la casa'}{/if}
  {if $gucciLabelIn == 'Contact us'}{assign var='gucciLabelOut' value='Contattaci'}{/if}
  {if $gucciLabelIn == 'Delivery'}{assign var='gucciLabelOut' value='Spedizioni'}{/if}
  {if $gucciLabelIn == 'Legal Notice'}{assign var='gucciLabelOut' value='Note legali'}{/if}
  {if $gucciLabelIn == 'Terms and conditions of use'}{assign var='gucciLabelOut' value='Termini e condizioni'}{/if}
  {if $gucciLabelIn == 'About us'}{assign var='gucciLabelOut' value='Chi siamo'}{/if}
  {if $gucciLabelIn == 'Secure payment'}{assign var='gucciLabelOut' value='Pagamento sicuro'}{/if}
  {if $gucciLabelIn == 'My account'}{assign var='gucciLabelOut' value='Il mio account'}{/if}
  {if $gucciLabelIn == 'Sign in'}{assign var='gucciLabelOut' value='Accedi'}{/if}
  {if $gucciLabelIn == 'Create account'}{assign var='gucciLabelOut' value='Crea account'}{/if}
  {if $gucciLabelIn == 'Order history and details'}{assign var='gucciLabelOut' value='I miei ordini'}{/if}
  {if $gucciLabelIn == 'Addresses'}{assign var='gucciLabelOut' value='I miei indirizzi'}{/if}
  {if $gucciLabelIn == 'Personal info'}{assign var='gucciLabelOut' value='Informazioni personali'}{/if}
  {if $gucciLabelIn == 'Brands'}{assign var='gucciLabelOut' value='Marchi'}{/if}
  {if $gucciLabelIn == 'Search'}{assign var='gucciLabelOut' value='Cerca'}{/if}
  {if $gucciLabelIn == 'New products'}{assign var='gucciLabelOut' value='Nuovi prodotti'}{/if}
  {if $gucciLabelIn == 'Best sellers'}{assign var='gucciLabelOut' value='Più venduti'}{/if}
  {if $gucciLabelIn == 'Prices drop'}{assign var='gucciLabelOut' value='Offerte'}{/if}
  {if $gucciLabelIn == 'Sitemap'}{assign var='gucciLabelOut' value='Mappa del sito'}{/if}
  {if $gucciLabelIn == 'Stores'}{assign var='gucciLabelOut' value='Negozi'}{/if}
  {if $gucciLabelIn == 'Our company'}{assign var='gucciLabelOut' value='La nostra azienda'}{/if}
  {if $gucciLabelIn == 'Products'}{assign var='gucciLabelOut' value='Prodotti'}{/if}
  {if $gucciLabelIn == 'Your account'}{assign var='gucciLabelOut' value='Il tuo account'}{/if}
  {if $gucciLabelIn == 'Pages'}{assign var='gucciLabelOut' value='Pagine'}{/if}
  {if $gucciLabelIn == 'Offers'}{assign var='gucciLabelOut' value='Offerte'}{/if}
  {if $gucciLabelIn == 'Our stores'}{assign var='gucciLabelOut' value='I nostri negozi'}{/if}
  {if $gucciLabelIn == 'Create new account'}{assign var='gucciLabelOut' value='Crea account'}{/if}
  {if $gucciLabelIn == 'Price drop'}{assign var='gucciLabelOut' value='Prezzi ribassati'}{/if}
  {if $gucciLabelIn == 'Manufacturers'}{assign var='gucciLabelOut' value='Marchi'}{/if}
  {if $gucciLabelIn == 'home'}{assign var='gucciLabelOut' value='Home'}{/if}
  {if $gucciLabelIn == 'Home'}{assign var='gucciLabelOut' value='Home'}{/if}
  {if $gucciLabelIn == 'Relevance'}{assign var='gucciLabelOut' value='Rilevanza'}{/if}
  {if $gucciLabelIn == 'Price, low to high'}{assign var='gucciLabelOut' value='Prezzo: crescente'}{/if}
  {if $gucciLabelIn == 'Price, high to low'}{assign var='gucciLabelOut' value='Prezzo: decrescente'}{/if}
  {if $gucciLabelIn == 'Name, A to Z'}{assign var='gucciLabelOut' value='Nome: A-Z'}{/if}
  {if $gucciLabelIn == 'Name, Z to A'}{assign var='gucciLabelOut' value='Nome: Z-A'}{/if}
  {if $gucciLabelIn == 'Newest first'}{assign var='gucciLabelOut' value='Più recenti'}{/if}
{/if}
