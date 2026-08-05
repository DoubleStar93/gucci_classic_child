{**
 * Barbara Alvisi — hero categoria PLP (stesse classi/markup dello slider homepage)
 * Immagine: solo cover originale BO (`img/c/{id}.jpg`) + cache-bust (CDN SiteGround)
 *}
{include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$category.name scope='parent'}

{assign var='barbaraalvisiCatImg' value=''}
{assign var='barbaraalvisiCatImgFull' value=''}
{assign var='barbaraalvisiCatImgWidth' value=1080}
{assign var='barbaraalvisiCatImgHeight' value=1440}
{assign var='barbaraalvisiCatHasCoverImage' value=false}
{assign var='barbaraalvisiCatHasTitle' value=false}
{if !empty($barbaraalvisiLabelOut)}{assign var='barbaraalvisiCatHasTitle' value=true}{/if}

{* Cover presente solo se PrestaShop ha verificato img/c/{id}.jpg *}
{if !empty($category.cover) && !empty($category.id) && !empty($category.link_rewrite)}
  {assign var='barbaraalvisiCatImg' value=$link->getCatImageLink($category.link_rewrite, $category.id, null)}
  {* Bypass cache CDN (max-age 30g): senza ?t= resta la cover precedente *}
  {if !empty($category.date_upd)}
    {assign var='barbaraalvisiCatImg' value=$barbaraalvisiCatImg|cat:'?t='|cat:($category.date_upd|replace:' ':''|replace:'-':''|replace:':':'')}
  {elseif !empty($category.id)}
    {assign var='barbaraalvisiCatImg' value=$barbaraalvisiCatImg|cat:'?t='|cat:$category.id}
  {/if}
  {assign var='barbaraalvisiCatImgFull' value=$barbaraalvisiCatImg}
  {assign var='barbaraalvisiCatHasCoverImage' value=true}
{/if}

<section class="barbaraalvisi-plp-hero barbaraalvisi-home-hero" aria-label="{if $barbaraalvisiCatHasTitle}{$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}{else}{$category.name|escape:'htmlall':'UTF-8'}{/if}">
  <div class="barbaraalvisi-pdp-gallery barbaraalvisi-home-hero-slider{if !$barbaraalvisiCatHasCoverImage} is-no-image{/if}">
    <div class="barbaraalvisi-pdp-gallery-viewport js-barbaraalvisi-pdp-gallery-viewport" tabindex="-1">
      <figure class="barbaraalvisi-pdp-gallery-slide is-active" role="group" aria-label="{if $barbaraalvisiCatHasTitle}{$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}{else}{$category.name|escape:'htmlall':'UTF-8'}{/if}">
        {if $barbaraalvisiCatHasCoverImage}
          <img
            class="barbaraalvisi-pdp-gallery-image js-barbaraalvisi-gallery-image"
            src="{$barbaraalvisiCatImg|escape:'html':'UTF-8'}"
            alt="{if $barbaraalvisiCatHasTitle}{$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}{else}{$category.name|escape:'htmlall':'UTF-8'}{/if}"
            loading="eager"
            width="{$barbaraalvisiCatImgWidth|intval}"
            height="{$barbaraalvisiCatImgHeight|intval}"
            data-image-large-src="{$barbaraalvisiCatImg|escape:'html':'UTF-8'}"
            data-image-full-src="{$barbaraalvisiCatImgFull|escape:'html':'UTF-8'}"
            onerror="this.closest('.barbaraalvisi-home-hero-slider').classList.add('is-no-image'); this.remove();"
          >
        {/if}
      </figure>
      {* Titolo solo per SEO/a11y — nessun riquadro overlay sulle PLP categoria *}
      {if $barbaraalvisiCatHasTitle}
        <h1 class="visually-hidden">{$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}</h1>
      {/if}
    </div>
  </div>
</section>
