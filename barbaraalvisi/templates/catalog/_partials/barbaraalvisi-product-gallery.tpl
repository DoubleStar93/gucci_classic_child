{**
 * Barbara Alvisi — galleria PDP: altezza fissa, img contain su panna + miniature
 * @param string $galleryMode hero|rest|all (legacy: solo "all" usato in product.tpl)
 *}
{if !isset($galleryMode)}{assign var='galleryMode' value='all'}{/if}

{assign var='barbaraalvisiImageTotal' value=$product.images|count}
{if !$barbaraalvisiImageTotal && $product.default_image}{assign var='barbaraalvisiImageTotal' value=1}{/if}

{if $galleryMode == 'all' || $galleryMode == 'hero'}
  <div
    class="barbaraalvisi-pdp-gallery js-barbaraalvisi-pdp-gallery"
    data-image-total="{$barbaraalvisiImageTotal}"
    {if $barbaraalvisiImageTotal > 1}data-barbaraalvisi-gallery-slider{/if}
  >
    <div class="barbaraalvisi-pdp-gallery-viewport js-barbaraalvisi-pdp-gallery-viewport" tabindex="0" aria-roledescription="carousel">
      {if $product.images|count}
        {foreach from=$product.images item=image name=barbaraalvisiGallery}
          {assign var='barbaraalvisiHeroImg' value=$image.bySize.large_default}
          {assign var='barbaraalvisiHeroPixels' value=$barbaraalvisiHeroImg.width * $barbaraalvisiHeroImg.height}
          {foreach from=$image.bySize item=sizeData}
            {if !empty($sizeData.url) && !empty($sizeData.width) && !empty($sizeData.height)}
              {assign var='barbaraalvisiSizePixels' value=$sizeData.width * $sizeData.height}
              {if $barbaraalvisiSizePixels > $barbaraalvisiHeroPixels}
                {assign var='barbaraalvisiHeroImg' value=$sizeData}
                {assign var='barbaraalvisiHeroPixels' value=$barbaraalvisiSizePixels}
              {/if}
            {/if}
          {/foreach}
          {assign var='barbaraalvisiImgUrl' value=$barbaraalvisiHeroImg.url}
          {assign var='barbaraalvisiImgOriginal' value=$link->getImageLink($product.link_rewrite, $image.id_image, '')}
          {assign var='barbaraalvisiImgAlt' value=$product.name}
          {if !empty($image.legend)}{assign var='barbaraalvisiImgAlt' value=$image.legend}{/if}
          <figure
            class="barbaraalvisi-pdp-gallery-slide{if $smarty.foreach.barbaraalvisiGallery.first} is-active{/if}"
            data-index="{$smarty.foreach.barbaraalvisiGallery.iteration}"
            id="barbaraalvisi-pdp-slide-{$smarty.foreach.barbaraalvisiGallery.iteration}"
            role="group"
            aria-roledescription="slide"
            aria-label="{$smarty.foreach.barbaraalvisiGallery.iteration} / {$barbaraalvisiImageTotal}"
            {if !$smarty.foreach.barbaraalvisiGallery.first}aria-hidden="true"{/if}
          >
            <img
              class="barbaraalvisi-pdp-gallery-image js-barbaraalvisi-gallery-image{if $smarty.foreach.barbaraalvisiGallery.first} js-qv-product-cover{/if}"
              src="{$barbaraalvisiImgUrl}"
              alt="{$barbaraalvisiImgAlt|escape:'htmlall':'UTF-8'}"
              loading="{if $smarty.foreach.barbaraalvisiGallery.first}eager{else}lazy{/if}"
              width="{$barbaraalvisiHeroImg.width}"
              height="{$barbaraalvisiHeroImg.height}"
              data-image-large-src="{$barbaraalvisiHeroImg.url}"
              data-image-full-src="{$barbaraalvisiImgOriginal|escape:'htmlall':'UTF-8'}"
            >
          </figure>
        {/foreach}
      {elseif $product.default_image}
        {assign var='barbaraalvisiHeroImg' value=$product.default_image.bySize.large_default}
        {assign var='barbaraalvisiHeroPixels' value=$barbaraalvisiHeroImg.width * $barbaraalvisiHeroImg.height}
        {foreach from=$product.default_image.bySize item=sizeData}
          {if !empty($sizeData.url) && !empty($sizeData.width) && !empty($sizeData.height)}
            {assign var='barbaraalvisiSizePixels' value=$sizeData.width * $sizeData.height}
            {if $barbaraalvisiSizePixels > $barbaraalvisiHeroPixels}
              {assign var='barbaraalvisiHeroImg' value=$sizeData}
              {assign var='barbaraalvisiHeroPixels' value=$barbaraalvisiSizePixels}
            {/if}
          {/if}
        {/foreach}
        {assign var='barbaraalvisiImgUrl' value=$barbaraalvisiHeroImg.url}
        {assign var='barbaraalvisiImgOriginal' value=$link->getImageLink($product.link_rewrite, $product.default_image.id_image, '')}
        <figure
          class="barbaraalvisi-pdp-gallery-slide is-active"
          data-index="1"
          id="barbaraalvisi-pdp-slide-1"
          role="group"
          aria-roledescription="slide"
          aria-label="1 / 1"
        >
          <img
            class="barbaraalvisi-pdp-gallery-image js-barbaraalvisi-gallery-image js-qv-product-cover"
            src="{$barbaraalvisiImgUrl}"
            alt="{$product.name|escape:'htmlall':'UTF-8'}"
            loading="eager"
            width="{$barbaraalvisiHeroImg.width}"
            height="{$barbaraalvisiHeroImg.height}"
            data-image-large-src="{$barbaraalvisiHeroImg.url}"
            data-image-full-src="{$barbaraalvisiImgOriginal|escape:'htmlall':'UTF-8'}"
          >
        </figure>
      {/if}
    </div>

    {if $barbaraalvisiImageTotal > 1}
      <div class="barbaraalvisi-pdp-gallery-controls">
        <nav class="barbaraalvisi-pdp-gallery-thumbs" aria-label="{if $language.iso_code == 'it'}Immagini prodotto{else}{l s='Product images' d='Shop.Theme.Catalog'}{/if}">
          {foreach from=$product.images item=image name=barbaraalvisiGalleryThumbs}
            {assign var='barbaraalvisiThumbUrl' value=$image.bySize.small_default.url}
            {if empty($barbaraalvisiThumbUrl)}{assign var='barbaraalvisiThumbUrl' value=$image.bySize.home_default.url}{/if}
            <button
              type="button"
              class="barbaraalvisi-pdp-gallery-thumb btn-unstyle{if $smarty.foreach.barbaraalvisiGalleryThumbs.first} is-active{/if}"
              data-slide-index="{$smarty.foreach.barbaraalvisiGalleryThumbs.index}"
              aria-label="{if !empty($image.legend)}{$image.legend}{else}{$product.name}{/if} — {$smarty.foreach.barbaraalvisiGalleryThumbs.iteration}/{$barbaraalvisiImageTotal}"
              {if $smarty.foreach.barbaraalvisiGalleryThumbs.first}aria-current="true"{/if}
            >
              <img
                src="{$barbaraalvisiThumbUrl}"
                alt=""
                width="{$image.bySize.small_default.width|default:$image.bySize.home_default.width}"
                height="{$image.bySize.small_default.height|default:$image.bySize.home_default.height}"
                loading="lazy"
              >
            </button>
          {/foreach}
        </nav>

        <span class="barbaraalvisi-pdp-gallery-counter" aria-live="polite">
          <span class="barbaraalvisi-pdp-gallery-counter-current">1</span>/<span class="barbaraalvisi-pdp-gallery-counter-total">{$barbaraalvisiImageTotal}</span>
        </span>
      </div>
    {/if}
  </div>
{/if}
