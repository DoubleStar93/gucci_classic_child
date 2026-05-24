{**
 * Classic Gucci — homepage hero slider (stessa UX galleria PDP)
 *}
{if $homeslider.slides}
  {assign var='gucciSlideTotal' value=$homeslider.slides|count}
  {assign var='gucciHeroRatioW' value=1110}
  {assign var='gucciHeroRatioH' value=340}
  {foreach from=$homeslider.slides item=slide name=gucciRatioInit}
    {if $smarty.foreach.gucciRatioInit.first && !empty($slide.sizes[0]) && !empty($slide.sizes[1])}
      {assign var='gucciHeroRatioW' value=$slide.sizes[0]}
      {assign var='gucciHeroRatioH' value=$slide.sizes[1]}
    {/if}
  {/foreach}

  <section class="gucci-home-hero">
    <div
      class="gucci-pdp-gallery gucci-home-hero-slider js-gucci-pdp-gallery"
      id="gucci-home-slider"
      style="--gucci-home-hero-ratio: {$gucciHeroRatioW} / {$gucciHeroRatioH};"
      data-image-total="{$gucciSlideTotal}"
      {if $gucciSlideTotal > 1}data-gucci-gallery-slider{/if}
    >
      <div class="gucci-pdp-gallery-viewport js-gucci-pdp-gallery-viewport" tabindex="0" aria-roledescription="carousel">
        {foreach from=$homeslider.slides item=slide name=gucciHomeSlider}
          {assign var='gucciSlideAlt' value=''}
          {if !empty($slide.legend)}{assign var='gucciSlideAlt' value=$slide.legend}{elseif !empty($slide.title)}{assign var='gucciSlideAlt' value=$slide.title}{/if}
          {assign var='gucciSlideWidth' value=1920}
          {assign var='gucciSlideHeight' value=1080}
          {if !empty($slide.sizes[0]) && !empty($slide.sizes[1])}
            {assign var='gucciSlideWidth' value=$slide.sizes[0]}
            {assign var='gucciSlideHeight' value=$slide.sizes[1]}
          {/if}
          {assign var='gucciSlideSrc' value=$slide.image_url}
          {if !empty($slide.image)}{assign var='gucciSlideSrc' value="{$slide.image_url}?v={$slide.image|escape:'url'}"}{/if}

          <figure
            class="gucci-pdp-gallery-slide{if $smarty.foreach.gucciHomeSlider.first} is-active{/if}"
            data-index="{$smarty.foreach.gucciHomeSlider.iteration}"
            id="gucci-home-slide-{$smarty.foreach.gucciHomeSlider.iteration}"
            role="group"
            aria-roledescription="slide"
            aria-label="{$smarty.foreach.gucciHomeSlider.iteration} / {$gucciSlideTotal}"
            {if !$smarty.foreach.gucciHomeSlider.first}aria-hidden="true"{/if}
          >
            {if !empty($slide.url)}
              <a href="{$slide.url|escape:'htmlall':'UTF-8'}" class="gucci-home-hero-slide-link" tabindex="-1" aria-hidden="true">
            {/if}
            <img
              class="gucci-pdp-gallery-image js-gucci-gallery-image"
              src="{$gucciSlideSrc}"
              alt="{$gucciSlideAlt|escape:'htmlall':'UTF-8'}"
              loading="{if $smarty.foreach.gucciHomeSlider.first}eager{else}lazy{/if}"
              width="{$gucciSlideWidth}"
              height="{$gucciSlideHeight}"
              data-image-large-src="{$gucciSlideSrc}"
              data-image-full-src="{$gucciSlideSrc}"
            >
            {if !empty($slide.url)}
              </a>
            {/if}
          </figure>
        {/foreach}
      </div>

      {if $gucciSlideTotal > 1}
        <div class="gucci-pdp-gallery-controls">
          <nav class="gucci-pdp-gallery-thumbs" aria-label="{if $language.iso_code == 'it'}Immagini homepage{else}{l s='Homepage images' d='Shop.Theme.Global'}{/if}">
            {foreach from=$homeslider.slides item=slide name=gucciHomeSliderThumbs}
              {assign var='gucciThumbAlt' value=''}
              {if !empty($slide.legend)}{assign var='gucciThumbAlt' value=$slide.legend}{elseif !empty($slide.title)}{assign var='gucciThumbAlt' value=$slide.title}{/if}
              {assign var='gucciThumbWidth' value=80}
              {assign var='gucciThumbHeight' value=80}
              {if !empty($slide.sizes[0]) && !empty($slide.sizes[1])}
                {assign var='gucciThumbWidth' value=$slide.sizes[0]}
                {assign var='gucciThumbHeight' value=$slide.sizes[1]}
              {/if}
              {assign var='gucciThumbSrc' value=$slide.image_url}
              {if !empty($slide.image)}{assign var='gucciThumbSrc' value="{$slide.image_url}?v={$slide.image|escape:'url'}"}{/if}

              <button
                type="button"
                class="gucci-pdp-gallery-thumb btn-unstyle{if $smarty.foreach.gucciHomeSliderThumbs.first} is-active{/if}"
                data-slide-index="{$smarty.foreach.gucciHomeSliderThumbs.index}"
                aria-label="{$gucciThumbAlt|escape:'htmlall':'UTF-8'} — {$smarty.foreach.gucciHomeSliderThumbs.iteration}/{$gucciSlideTotal}"
                {if $smarty.foreach.gucciHomeSliderThumbs.first}aria-current="true"{/if}
              >
                <img
                  src="{$gucciThumbSrc}"
                  alt=""
                  width="{$gucciThumbWidth}"
                  height="{$gucciThumbHeight}"
                  loading="lazy"
                >
              </button>
            {/foreach}
          </nav>

          <span class="gucci-pdp-gallery-counter" aria-live="polite">
            <span class="gucci-pdp-gallery-counter-current">1</span>/<span class="gucci-pdp-gallery-counter-total">{$gucciSlideTotal}</span>
          </span>
        </div>
      {/if}
    </div>
  </section>
{else}
  <section class="gucci-home-hero gucci-home-hero--empty" aria-hidden="true">
    <div class="gucci-home-hero-empty" role="presentation"></div>
  </section>
{/if}
