{**
 * Classic Gucci — hero categoria PLP (stesse classi/markup dello slider homepage)
 * Immagine: solo cover originale BO (`img/c/{id}.jpg`) + cache-bust (CDN SiteGround)
 *}
{include file='_partials/gucci-it-label.tpl' gucciLabelIn=$category.name scope='parent'}

{assign var='gucciCatImg' value=''}
{assign var='gucciCatImgFull' value=''}
{assign var='gucciCatImgWidth' value=1080}
{assign var='gucciCatImgHeight' value=1440}
{assign var='gucciCatHasCoverImage' value=false}
{assign var='gucciCatHasTitle' value=false}
{if !empty($gucciLabelOut)}{assign var='gucciCatHasTitle' value=true}{/if}

{* Cover presente solo se PrestaShop ha verificato img/c/{id}.jpg *}
{if !empty($category.cover) && !empty($category.id) && !empty($category.link_rewrite)}
  {assign var='gucciCatImg' value=$link->getCatImageLink($category.link_rewrite, $category.id, null)}
  {* Bypass cache CDN (max-age 30g): senza ?t= resta la cover precedente *}
  {if !empty($category.date_upd)}
    {assign var='gucciCatImg' value=$gucciCatImg|cat:'?t='|cat:($category.date_upd|replace:' ':''|replace:'-':''|replace:':':'')}
  {elseif !empty($category.id)}
    {assign var='gucciCatImg' value=$gucciCatImg|cat:'?t='|cat:$category.id}
  {/if}
  {assign var='gucciCatImgFull' value=$gucciCatImg}
  {assign var='gucciCatHasCoverImage' value=true}
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
      </figure>
      {* Titolo solo per SEO/a11y — nessun riquadro overlay sulle PLP categoria *}
      {if $gucciCatHasTitle}
        <h1 class="visually-hidden">{$gucciLabelOut|escape:'htmlall':'UTF-8'}</h1>
      {/if}
    </div>
  </div>
</section>
