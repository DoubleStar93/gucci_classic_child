{**
 * Fallback card categoria — quando l'override non ha ancora popolato i dati
 *}
{assign var='gucciCatUrl' value=$link->getCategoryLink($catId)|escape:'html':'UTF-8'}
{assign var='gucciCatImg' value=$urls.base_url|cat:'themes/classic-gucci/assets/img/home/cat-'|cat:$catId|cat:'.jpg'}
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
      'url' => $gucciCatImg,
      'has_image' => false,
      'width' => 800,
      'height' => 800
    ]
  ]}
{/if}
