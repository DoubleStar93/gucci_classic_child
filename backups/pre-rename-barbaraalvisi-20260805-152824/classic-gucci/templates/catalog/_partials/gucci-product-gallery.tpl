{**
 * Classic Gucci — galleria PDP: altezza fissa, img contain su panna + miniature
 * @param string $galleryMode hero|rest|all (legacy: solo "all" usato in product.tpl)
 *}
{if !isset($galleryMode)}{assign var='galleryMode' value='all'}{/if}

{assign var='gucciImageTotal' value=$product.images|count}
{if !$gucciImageTotal && $product.default_image}{assign var='gucciImageTotal' value=1}{/if}

{if $galleryMode == 'all' || $galleryMode == 'hero'}
  <div
    class="gucci-pdp-gallery js-gucci-pdp-gallery"
    data-image-total="{$gucciImageTotal}"
    {if $gucciImageTotal > 1}data-gucci-gallery-slider{/if}
  >
    <div class="gucci-pdp-gallery-viewport js-gucci-pdp-gallery-viewport" tabindex="0" aria-roledescription="carousel">
      {if $product.images|count}
        {foreach from=$product.images item=image name=gucciGallery}
          {assign var='gucciHeroImg' value=$image.bySize.large_default}
          {assign var='gucciHeroPixels' value=$gucciHeroImg.width * $gucciHeroImg.height}
          {foreach from=$image.bySize item=sizeData}
            {if !empty($sizeData.url) && !empty($sizeData.width) && !empty($sizeData.height)}
              {assign var='gucciSizePixels' value=$sizeData.width * $sizeData.height}
              {if $gucciSizePixels > $gucciHeroPixels}
                {assign var='gucciHeroImg' value=$sizeData}
                {assign var='gucciHeroPixels' value=$gucciSizePixels}
              {/if}
            {/if}
          {/foreach}
          {assign var='gucciImgUrl' value=$gucciHeroImg.url}
          {assign var='gucciImgOriginal' value=$link->getImageLink($product.link_rewrite, $image.id_image, '')}
          {assign var='gucciImgAlt' value=$product.name}
          {if !empty($image.legend)}{assign var='gucciImgAlt' value=$image.legend}{/if}
          <figure
            class="gucci-pdp-gallery-slide{if $smarty.foreach.gucciGallery.first} is-active{/if}"
            data-index="{$smarty.foreach.gucciGallery.iteration}"
            id="gucci-pdp-slide-{$smarty.foreach.gucciGallery.iteration}"
            role="group"
            aria-roledescription="slide"
            aria-label="{$smarty.foreach.gucciGallery.iteration} / {$gucciImageTotal}"
            {if !$smarty.foreach.gucciGallery.first}aria-hidden="true"{/if}
          >
            <img
              class="gucci-pdp-gallery-image js-gucci-gallery-image{if $smarty.foreach.gucciGallery.first} js-qv-product-cover{/if}"
              src="{$gucciImgUrl}"
              alt="{$gucciImgAlt|escape:'htmlall':'UTF-8'}"
              loading="{if $smarty.foreach.gucciGallery.first}eager{else}lazy{/if}"
              width="{$gucciHeroImg.width}"
              height="{$gucciHeroImg.height}"
              data-image-large-src="{$gucciHeroImg.url}"
              data-image-full-src="{$gucciImgOriginal|escape:'htmlall':'UTF-8'}"
            >
          </figure>
        {/foreach}
      {elseif $product.default_image}
        {assign var='gucciHeroImg' value=$product.default_image.bySize.large_default}
        {assign var='gucciHeroPixels' value=$gucciHeroImg.width * $gucciHeroImg.height}
        {foreach from=$product.default_image.bySize item=sizeData}
          {if !empty($sizeData.url) && !empty($sizeData.width) && !empty($sizeData.height)}
            {assign var='gucciSizePixels' value=$sizeData.width * $sizeData.height}
            {if $gucciSizePixels > $gucciHeroPixels}
              {assign var='gucciHeroImg' value=$sizeData}
              {assign var='gucciHeroPixels' value=$gucciSizePixels}
            {/if}
          {/if}
        {/foreach}
        {assign var='gucciImgUrl' value=$gucciHeroImg.url}
        {assign var='gucciImgOriginal' value=$link->getImageLink($product.link_rewrite, $product.default_image.id_image, '')}
        <figure
          class="gucci-pdp-gallery-slide is-active"
          data-index="1"
          id="gucci-pdp-slide-1"
          role="group"
          aria-roledescription="slide"
          aria-label="1 / 1"
        >
          <img
            class="gucci-pdp-gallery-image js-gucci-gallery-image js-qv-product-cover"
            src="{$gucciImgUrl}"
            alt="{$product.name|escape:'htmlall':'UTF-8'}"
            loading="eager"
            width="{$gucciHeroImg.width}"
            height="{$gucciHeroImg.height}"
            data-image-large-src="{$gucciHeroImg.url}"
            data-image-full-src="{$gucciImgOriginal|escape:'htmlall':'UTF-8'}"
          >
        </figure>
      {/if}
    </div>

    {if $gucciImageTotal > 1}
      <div class="gucci-pdp-gallery-controls">
        <nav class="gucci-pdp-gallery-thumbs" aria-label="{if $language.iso_code == 'it'}Immagini prodotto{else}{l s='Product images' d='Shop.Theme.Catalog'}{/if}">
          {foreach from=$product.images item=image name=gucciGalleryThumbs}
            {assign var='gucciThumbUrl' value=$image.bySize.small_default.url}
            {if empty($gucciThumbUrl)}{assign var='gucciThumbUrl' value=$image.bySize.home_default.url}{/if}
            <button
              type="button"
              class="gucci-pdp-gallery-thumb btn-unstyle{if $smarty.foreach.gucciGalleryThumbs.first} is-active{/if}"
              data-slide-index="{$smarty.foreach.gucciGalleryThumbs.index}"
              aria-label="{if !empty($image.legend)}{$image.legend}{else}{$product.name}{/if} — {$smarty.foreach.gucciGalleryThumbs.iteration}/{$gucciImageTotal}"
              {if $smarty.foreach.gucciGalleryThumbs.first}aria-current="true"{/if}
            >
              <img
                src="{$gucciThumbUrl}"
                alt=""
                width="{$image.bySize.small_default.width|default:$image.bySize.home_default.width}"
                height="{$image.bySize.small_default.height|default:$image.bySize.home_default.height}"
                loading="lazy"
              >
            </button>
          {/foreach}
        </nav>

        <span class="gucci-pdp-gallery-counter" aria-live="polite">
          <span class="gucci-pdp-gallery-counter-current">1</span>/<span class="gucci-pdp-gallery-counter-total">{$gucciImageTotal}</span>
        </span>
      </div>
    {/if}
  </div>
{/if}
