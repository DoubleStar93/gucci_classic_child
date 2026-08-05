{**
 * Barbara Alvisi — mappa etichetta EN → IT (breadcrumb, menu, …)
 * Uso: {include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$path.title scope='parent'}
 *      poi {$barbaraalvisiLabelOut}
 *}
{assign var='barbaraalvisiLabelOut' value=$barbaraalvisiLabelIn}
{if isset($language) && $language.iso_code == 'it'}
  {if $barbaraalvisiLabelIn == 'Clothes' || $barbaraalvisiLabelIn == 'clothes' || $barbaraalvisiLabelIn == 'abbigliamento'}{assign var='barbaraalvisiLabelOut' value='Abbigliamento'}{/if}
  {if $barbaraalvisiLabelIn == 'Accessories' || $barbaraalvisiLabelIn == 'accessories' || $barbaraalvisiLabelIn == 'accessori'}{assign var='barbaraalvisiLabelOut' value='Accessori'}{/if}
  {if $barbaraalvisiLabelIn == 'Art' || $barbaraalvisiLabelIn == 'art' || $barbaraalvisiLabelIn == 'arte'}{assign var='barbaraalvisiLabelOut' value='Arte'}{/if}
  {if $barbaraalvisiLabelIn == 'Men' || $barbaraalvisiLabelIn == 'men' || $barbaraalvisiLabelIn == 'uomo'}{assign var='barbaraalvisiLabelOut' value='Uomo'}{/if}
  {if $barbaraalvisiLabelIn == 'Women' || $barbaraalvisiLabelIn == 'women' || $barbaraalvisiLabelIn == 'donna'}{assign var='barbaraalvisiLabelOut' value='Donna'}{/if}
  {if $barbaraalvisiLabelIn == 'Stationery' || $barbaraalvisiLabelIn == 'stationery' || $barbaraalvisiLabelIn == 'cancelleria'}{assign var='barbaraalvisiLabelOut' value='Cancelleria'}{/if}
  {if $barbaraalvisiLabelIn == 'Home Accessories' || $barbaraalvisiLabelIn == 'home accessories' || $barbaraalvisiLabelIn == 'accessori per la casa'}{assign var='barbaraalvisiLabelOut' value='Accessori per la casa'}{/if}
  {if $barbaraalvisiLabelIn == 'Contact us'}{assign var='barbaraalvisiLabelOut' value='Contattaci'}{/if}
  {if $barbaraalvisiLabelIn == 'Delivery'}{assign var='barbaraalvisiLabelOut' value='Spedizioni'}{/if}
  {if $barbaraalvisiLabelIn == 'Legal Notice'}{assign var='barbaraalvisiLabelOut' value='Note legali'}{/if}
  {if $barbaraalvisiLabelIn == 'Terms and conditions of use'}{assign var='barbaraalvisiLabelOut' value='Termini e condizioni'}{/if}
  {if $barbaraalvisiLabelIn == 'About us'}{assign var='barbaraalvisiLabelOut' value='Chi siamo'}{/if}
  {if $barbaraalvisiLabelIn == 'Secure payment'}{assign var='barbaraalvisiLabelOut' value='Pagamento sicuro'}{/if}
  {if $barbaraalvisiLabelIn == 'My account'}{assign var='barbaraalvisiLabelOut' value='Il mio account'}{/if}
  {if $barbaraalvisiLabelIn == 'Sign in'}{assign var='barbaraalvisiLabelOut' value='Accedi'}{/if}
  {if $barbaraalvisiLabelIn == 'Create account'}{assign var='barbaraalvisiLabelOut' value='Crea account'}{/if}
  {if $barbaraalvisiLabelIn == 'Order history and details'}{assign var='barbaraalvisiLabelOut' value='I miei ordini'}{/if}
  {if $barbaraalvisiLabelIn == 'Addresses'}{assign var='barbaraalvisiLabelOut' value='I miei indirizzi'}{/if}
  {if $barbaraalvisiLabelIn == 'Personal info'}{assign var='barbaraalvisiLabelOut' value='Informazioni personali'}{/if}
  {if $barbaraalvisiLabelIn == 'Brands'}{assign var='barbaraalvisiLabelOut' value='Marchi'}{/if}
  {if $barbaraalvisiLabelIn == 'Search'}{assign var='barbaraalvisiLabelOut' value='Cerca'}{/if}
  {if $barbaraalvisiLabelIn == 'New products'}{assign var='barbaraalvisiLabelOut' value='Nuovi prodotti'}{/if}
  {if $barbaraalvisiLabelIn == 'Best sellers'}{assign var='barbaraalvisiLabelOut' value='Più venduti'}{/if}
  {if $barbaraalvisiLabelIn == 'Prices drop'}{assign var='barbaraalvisiLabelOut' value='Offerte'}{/if}
  {if $barbaraalvisiLabelIn == 'Sitemap'}{assign var='barbaraalvisiLabelOut' value='Mappa del sito'}{/if}
  {if $barbaraalvisiLabelIn == 'Stores'}{assign var='barbaraalvisiLabelOut' value='Negozi'}{/if}
  {if $barbaraalvisiLabelIn == 'Our company'}{assign var='barbaraalvisiLabelOut' value='La nostra azienda'}{/if}
  {if $barbaraalvisiLabelIn == 'Products'}{assign var='barbaraalvisiLabelOut' value='Prodotti'}{/if}
  {if $barbaraalvisiLabelIn == 'Your account'}{assign var='barbaraalvisiLabelOut' value='Il tuo account'}{/if}
  {if $barbaraalvisiLabelIn == 'Pages'}{assign var='barbaraalvisiLabelOut' value='Pagine'}{/if}
  {if $barbaraalvisiLabelIn == 'Offers'}{assign var='barbaraalvisiLabelOut' value='Offerte'}{/if}
  {if $barbaraalvisiLabelIn == 'Our stores'}{assign var='barbaraalvisiLabelOut' value='I nostri negozi'}{/if}
  {if $barbaraalvisiLabelIn == 'Create new account'}{assign var='barbaraalvisiLabelOut' value='Crea account'}{/if}
  {if $barbaraalvisiLabelIn == 'Price drop'}{assign var='barbaraalvisiLabelOut' value='Prezzi ribassati'}{/if}
  {if $barbaraalvisiLabelIn == 'Manufacturers'}{assign var='barbaraalvisiLabelOut' value='Marchi'}{/if}
  {if $barbaraalvisiLabelIn == 'home'}{assign var='barbaraalvisiLabelOut' value='Home'}{/if}
  {if $barbaraalvisiLabelIn == 'Home'}{assign var='barbaraalvisiLabelOut' value='Home'}{/if}
  {if $barbaraalvisiLabelIn == 'Relevance'}{assign var='barbaraalvisiLabelOut' value='Rilevanza'}{/if}
  {if $barbaraalvisiLabelIn == 'Price, low to high'}{assign var='barbaraalvisiLabelOut' value='Prezzo: crescente'}{/if}
  {if $barbaraalvisiLabelIn == 'Price, high to low'}{assign var='barbaraalvisiLabelOut' value='Prezzo: decrescente'}{/if}
  {if $barbaraalvisiLabelIn == 'Name, A to Z'}{assign var='barbaraalvisiLabelOut' value='Nome: A-Z'}{/if}
  {if $barbaraalvisiLabelIn == 'Name, Z to A'}{assign var='barbaraalvisiLabelOut' value='Nome: Z-A'}{/if}
  {if $barbaraalvisiLabelIn == 'Newest first'}{assign var='barbaraalvisiLabelOut' value='Più recenti'}{/if}
{/if}
