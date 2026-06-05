{**
 * Classic Gucci — hero categoria PLP (editoriale, stile homepage)
 * Immagine: themes/classic-gucci/assets/img/home/cat-{id}.jpg
 *}
{include file='_partials/gucci-it-label.tpl' gucciLabelIn=$category.name scope='parent'}
{assign var='gucciCatImg' value=$urls.base_url|cat:'themes/classic-gucci/assets/img/home/cat-'|cat:$category.id|cat:'.jpg'}

<section class="gucci-plp-hero" aria-label="{$gucciLabelOut|escape:'htmlall':'UTF-8'}">
  <div class="gucci-plp-hero__media" aria-hidden="true">
    <img
      class="gucci-plp-hero__img"
      src="{$gucciCatImg|escape:'html':'UTF-8'}"
      alt=""
      loading="eager"
      width="1600"
      height="900"
      onerror="this.closest('.gucci-plp-hero').classList.add('is-no-image')"
    >
  </div>

  <div class="gucci-plp-hero__content">
    <h1 class="gucci-plp-hero__title">{$gucciLabelOut|escape:'htmlall':'UTF-8'}</h1>

    {if !empty($category.description)}
      <div class="gucci-plp-hero__description">{$category.description nofilter}</div>
    {/if}
  </div>
</section>
