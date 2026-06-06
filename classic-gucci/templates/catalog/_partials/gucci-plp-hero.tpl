{**
 * Classic Gucci — hero categoria PLP (stesse classi/markup dello slider homepage)
 * Immagine: solo cover categoria BO confermata da PrestaShop (no URL inventati)
 *}
{include file='_partials/gucci-it-label.tpl' gucciLabelIn=$category.name scope='parent'}

{assign var='gucciCatImg' value=''}
{assign var='gucciCatImgFull' value=''}
{assign var='gucciCatImgWidth' value=1920}
{assign var='gucciCatImgHeight' value=1080}
{assign var='gucciCatHasCoverImage' value=false}
{assign var='gucciHeroPixels' value=0}
{assign var='gucciCatDescription' value=$category.description|strip_tags|trim}
{assign var='gucciCatHasTitle' value=false}
{assign var='gucciCatHasDescription' value=false}
{assign var='gucciCatHasCaption' value=false}
{if !empty($gucciLabelOut)}{assign var='gucciCatHasTitle' value=true}{/if}
{if !empty($gucciCatDescription)}{assign var='gucciCatHasDescription' value=true}{/if}
{if $gucciCatHasTitle || $gucciCatHasDescription}{assign var='gucciCatHasCaption' value=true}{/if}

{if !empty($category.cover.bySize)}
  {foreach from=$category.cover.bySize item=sizeData}
    {if !empty($sizeData.url) && !empty($sizeData.width) && !empty($sizeData.height)}
      {assign var='gucciSizePixels' value=$sizeData.width * $sizeData.height}
      {if $gucciSizePixels > $gucciHeroPixels}
        {assign var='gucciCatImg' value=$sizeData.url}
        {assign var='gucciCatImgWidth' value=$sizeData.width}
        {assign var='gucciCatImgHeight' value=$sizeData.height}
        {assign var='gucciHeroPixels' value=$gucciSizePixels}
        {assign var='gucciCatHasCoverImage' value=true}
      {/if}
    {/if}
  {/foreach}
{/if}

{if !$gucciCatHasCoverImage && !empty($category.cover.large.url)}
  {assign var='gucciCatImg' value=$category.cover.large.url}
  {if !empty($category.cover.large.width)}{assign var='gucciCatImgWidth' value=$category.cover.large.width}{/if}
  {if !empty($category.cover.large.height)}{assign var='gucciCatImgHeight' value=$category.cover.large.height}{/if}
  {assign var='gucciCatHasCoverImage' value=true}
{/if}

{if $gucciCatHasCoverImage && !empty($category.link_rewrite) && !empty($category.id)}
  {assign var='gucciCatImgFull' value=$link->getCatImageLink($category.link_rewrite, $category.id, null)}
{elseif $gucciCatHasCoverImage}
  {assign var='gucciCatImgFull' value=$gucciCatImg}
{/if}

<section class="gucci-plp-hero gucci-home-hero" aria-label="{if $gucciCatHasTitle}{$gucciLabelOut|escape:'htmlall':'UTF-8'}{else}{$category.name|escape:'htmlall':'UTF-8'}{/if}">
  <div class="gucci-pdp-gallery gucci-home-hero-slider{if !$gucciCatHasCoverImage} is-no-image{/if}">
    <div class="gucci-pdp-gallery-viewport js-gucci-pdp-gallery-viewport" tabindex="-1">
      <figure class="gucci-pdp-gallery-slide is-active" role="group" aria-label="{if $gucciCatHasTitle}{$gucciLabelOut|escape:'htmlall':'UTF-8'}{else}{$category.name|escape:'htmlall':'UTF-8'}{/if}">
        {if $gucciCatHasCoverImage}
          <img
            class="gucci-pdp-gallery-image js-gucci-gallery-image"
            src="{$gucciCatImg|escape:'html':'UTF-8'}"
            alt="{if $gucciCatHasTitle}{$gucciLabelOut|escape:'htmlall':'UTF-8'}{else}{$category.name|escape:'htmlall':'UTF-8'}{/if}"
            loading="eager"
            width="{$gucciCatImgWidth|intval}"
            height="{$gucciCatImgHeight|intval}"
            data-image-large-src="{$gucciCatImg|escape:'html':'UTF-8'}"
            data-image-full-src="{$gucciCatImgFull|escape:'html':'UTF-8'}"
            onerror="this.closest('.gucci-home-hero-slider').classList.add('is-no-image'); this.remove();"
          >
        {/if}

        {if $gucciCatHasCaption}
          <figcaption class="gucci-home-hero-caption">
            <div class="gucci-home-hero-caption__inner">
              {if $gucciCatHasTitle}
                <h1 class="gucci-home-hero-caption__title">{$gucciLabelOut|escape:'htmlall':'UTF-8'}</h1>
              {/if}
              {if $gucciCatHasDescription}
                <div class="gucci-home-hero-caption__description">{$category.description nofilter}</div>
              {/if}
            </div>
          </figcaption>
        {/if}
      </figure>
    </div>
  </div>
</section>
