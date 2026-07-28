{**
 * Fallback card categoria — quando il modulo non ha ancora popolato i dati.
 * Nessuna immagine tema: senza cover BO la card resta senza foto.
 *}
{assign var='gucciCatUrl' value=$link->getCategoryLink($catId)|escape:'html':'UTF-8'}
{assign var='gucciCatName' value=''}
{if $catId == 3}{assign var='gucciCatName' value='Abbigliamento'}
{elseif $catId == 6}{assign var='gucciCatName' value='Accessori'}
{elseif $catId == 9}{assign var='gucciCatName' value='Arte'}
{elseif $catId == 11}{assign var='gucciCatName' value='Camicie e bluse'}
{/if}

{if $gucciCatName != ''}
  {include file='_partials/gucci-home-category-miniature.tpl' category=[
    'id' => $catId,
    'name' => $gucciCatName,
    'url' => $gucciCatUrl,
    'image' => [
      'url' => '',
      'has_image' => false,
      'width' => 800,
      'height' => 800
    ]
  ]}
{/if}
