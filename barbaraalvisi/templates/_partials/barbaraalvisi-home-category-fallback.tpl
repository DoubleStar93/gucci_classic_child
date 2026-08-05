{**
 * Fallback card categoria — quando il modulo non ha ancora popolato i dati.
 * Nessuna immagine tema: senza cover BO la card resta senza foto.
 *}
{assign var='barbaraalvisiCatUrl' value=$link->getCategoryLink($catId)|escape:'html':'UTF-8'}
{assign var='barbaraalvisiCatName' value=''}
{if $catId == 3}{assign var='barbaraalvisiCatName' value='Abbigliamento'}
{elseif $catId == 6}{assign var='barbaraalvisiCatName' value='Accessori'}
{elseif $catId == 9}{assign var='barbaraalvisiCatName' value='Arte'}
{elseif $catId == 11}{assign var='barbaraalvisiCatName' value='Camicie e bluse'}
{/if}

{if $barbaraalvisiCatName != ''}
  {include file='_partials/barbaraalvisi-home-category-miniature.tpl' category=[
    'id' => $catId,
    'name' => $barbaraalvisiCatName,
    'url' => $barbaraalvisiCatUrl,
    'image' => [
      'url' => '',
      'has_image' => false,
      'width' => 800,
      'height' => 800
    ]
  ]}
{/if}
