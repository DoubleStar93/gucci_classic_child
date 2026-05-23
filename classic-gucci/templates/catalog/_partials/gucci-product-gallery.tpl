{**
 * Classic Gucci — galleria prodotto stile gucci.com
 * @param string $galleryMode hero|rest|all
 *}
{if !isset($galleryMode)}{assign var='galleryMode' value='all'}{/if}

{assign var='gucciImageTotal' value=$product.images|count}
{if !$gucciImageTotal && $product.default_image}{assign var='gucciImageTotal' value=1}{/if}

{if $galleryMode == 'hero'}
  <div class="gucci-pdp-hero js-gucci-pdp-gallery" data-image-total="{$gucciImageTotal}">
    {if $product.images|count}
      {assign var='gucciHeroImage' value=$product.images[0]}
      <figure class="gucci-pdp-gallery-slide gucci-pdp-gallery-slide--hero is-active" data-index="1">
        <picture>
          {if !empty($gucciHeroImage.bySize.large_default.sources.avif)}<source srcset="{$gucciHeroImage.bySize.large_default.sources.avif}" type="image/avif">{/if}
          {if !empty($gucciHeroImage.bySize.large_default.sources.webp)}<source srcset="{$gucciHeroImage.bySize.large_default.sources.webp}" type="image/webp">{/if}
          <img
            class="gucci-pdp-gallery-image js-gucci-gallery-image js-qv-product-cover"
            src="{$gucciHeroImage.bySize.large_default.url}"
            alt="{if !empty($gucciHeroImage.legend)}{$gucciHeroImage.legend}{else}{$product.name}{/if}"
            loading="eager"
            width="{$gucciHeroImage.bySize.large_default.width}"
            height="{$gucciHeroImage.bySize.large_default.height}"
            data-image-large-src="{$gucciHeroImage.bySize.large_default.url}"
          >
        </picture>
      </figure>
    {elseif $product.default_image}
      <figure class="gucci-pdp-gallery-slide gucci-pdp-gallery-slide--hero is-active" data-index="1">
        <picture>
          {if !empty($product.default_image.bySize.large_default.sources.avif)}<source srcset="{$product.default_image.bySize.large_default.sources.avif}" type="image/avif">{/if}
          {if !empty($product.default_image.bySize.large_default.sources.webp)}<source srcset="{$product.default_image.bySize.large_default.sources.webp}" type="image/webp">{/if}
          <img
            class="gucci-pdp-gallery-image js-gucci-gallery-image js-qv-product-cover"
            src="{$product.default_image.bySize.large_default.url}"
            alt="{$product.name}"
            loading="eager"
            width="{$product.default_image.bySize.large_default.width}"
            height="{$product.default_image.bySize.large_default.height}"
          >
        </picture>
      </figure>
    {/if}

    {if $gucciImageTotal > 1}
      <span class="gucci-pdp-gallery-counter" aria-live="polite">
        <span class="gucci-pdp-gallery-counter-current">1</span>/<span class="gucci-pdp-gallery-counter-total">{$gucciImageTotal}</span>
      </span>
    {/if}
  </div>
{elseif $galleryMode == 'rest'}
  {if $product.images|count > 1}
    <div class="gucci-pdp-gallery gucci-pdp-gallery--rest js-gucci-pdp-gallery-rest" data-image-total="{$gucciImageTotal}">
      {foreach from=$product.images item=image name=gucciGalleryRest}
        {if !$smarty.foreach.gucciGalleryRest.first}
          <figure class="gucci-pdp-gallery-slide" data-index="{$smarty.foreach.gucciGalleryRest.iteration}">
            <picture>
              {if !empty($image.bySize.large_default.sources.avif)}<source srcset="{$image.bySize.large_default.sources.avif}" type="image/avif">{/if}
              {if !empty($image.bySize.large_default.sources.webp)}<source srcset="{$image.bySize.large_default.sources.webp}" type="image/webp">{/if}
              <img
                class="gucci-pdp-gallery-image js-gucci-gallery-image"
                src="{$image.bySize.large_default.url}"
                alt="{if !empty($image.legend)}{$image.legend}{else}{$product.name}{/if}"
                loading="lazy"
                width="{$image.bySize.large_default.width}"
                height="{$image.bySize.large_default.height}"
                data-image-large-src="{$image.bySize.large_default.url}"
              >
            </picture>
          </figure>
        {/if}
      {/foreach}
    </div>
  {/if}
{else}
  <div class="gucci-pdp-gallery js-gucci-pdp-gallery" data-image-total="{$gucciImageTotal}">
    {if $product.images|count}
      {foreach from=$product.images item=image name=gucciGallery}
        <figure class="gucci-pdp-gallery-slide{if $smarty.foreach.gucciGallery.first} is-active{/if}" data-index="{$smarty.foreach.gucciGallery.iteration}">
          <picture>
            {if !empty($image.bySize.large_default.sources.avif)}<source srcset="{$image.bySize.large_default.sources.avif}" type="image/avif">{/if}
            {if !empty($image.bySize.large_default.sources.webp)}<source srcset="{$image.bySize.large_default.sources.webp}" type="image/webp">{/if}
            <img
              class="gucci-pdp-gallery-image js-gucci-gallery-image{if $smarty.foreach.gucciGallery.first} js-qv-product-cover{/if}"
              src="{$image.bySize.large_default.url}"
              alt="{if !empty($image.legend)}{$image.legend}{else}{$product.name}{/if}"
              loading="{if $smarty.foreach.gucciGallery.first}eager{else}lazy{/if}"
              width="{$image.bySize.large_default.width}"
              height="{$image.bySize.large_default.height}"
              data-image-large-src="{$image.bySize.large_default.url}"
            >
          </picture>
        </figure>
      {/foreach}
    {elseif $product.default_image}
      <figure class="gucci-pdp-gallery-slide is-active" data-index="1">
        <picture>
          {if !empty($product.default_image.bySize.large_default.sources.avif)}<source srcset="{$product.default_image.bySize.large_default.sources.avif}" type="image/avif">{/if}
          {if !empty($product.default_image.bySize.large_default.sources.webp)}<source srcset="{$product.default_image.bySize.large_default.sources.webp}" type="image/webp">{/if}
          <img
            class="gucci-pdp-gallery-image js-gucci-gallery-image js-qv-product-cover"
            src="{$product.default_image.bySize.large_default.url}"
            alt="{$product.name}"
            loading="eager"
            width="{$product.default_image.bySize.large_default.width}"
            height="{$product.default_image.bySize.large_default.height}"
          >
        </picture>
      </figure>
    {/if}

    {if $gucciImageTotal > 1}
      <span class="gucci-pdp-gallery-counter" aria-live="polite">
        <span class="gucci-pdp-gallery-counter-current">1</span>/<span class="gucci-pdp-gallery-counter-total">{$gucciImageTotal}</span>
      </span>
    {/if}
  </div>
{/if}
