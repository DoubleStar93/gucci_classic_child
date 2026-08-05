{**
 * Barbara Alvisi — homepage hero slider (stessa UX galleria PDP)
 *}
{if $homeslider.slides}
  {assign var='barbaraalvisiSlideTotal' value=$homeslider.slides|count}

  <section class="barbaraalvisi-home-hero">
    <div
      class="barbaraalvisi-pdp-gallery barbaraalvisi-home-hero-slider js-barbaraalvisi-pdp-gallery"
      id="barbaraalvisi-home-slider"
      data-image-total="{$barbaraalvisiSlideTotal}"
      {if $barbaraalvisiSlideTotal > 1}data-barbaraalvisi-gallery-slider{/if}
    >
      <div class="barbaraalvisi-pdp-gallery-viewport js-barbaraalvisi-pdp-gallery-viewport" tabindex="0" aria-roledescription="carousel">
        {foreach from=$homeslider.slides item=slide name=barbaraalvisiHomeSlider}
          {assign var='barbaraalvisiSlideAlt' value=''}
          {if !empty($slide.legend)}{assign var='barbaraalvisiSlideAlt' value=$slide.legend}{elseif !empty($slide.title)}{assign var='barbaraalvisiSlideAlt' value=$slide.title}{/if}
          {assign var='barbaraalvisiSlideWidth' value=1920}
          {assign var='barbaraalvisiSlideHeight' value=1080}
          {if !empty($slide.sizes[0]) && !empty($slide.sizes[1])}
            {assign var='barbaraalvisiSlideWidth' value=$slide.sizes[0]}
            {assign var='barbaraalvisiSlideHeight' value=$slide.sizes[1]}
          {/if}
          {assign var='barbaraalvisiSlideSrc' value=$slide.image_url}
          {if !empty($slide.image)}{assign var='barbaraalvisiSlideSrc' value="{$slide.image_url}?v={$slide.image|escape:'url'}"}{/if}

          <figure
            class="barbaraalvisi-pdp-gallery-slide{if $smarty.foreach.barbaraalvisiHomeSlider.first} is-active{/if}"
            data-index="{$smarty.foreach.barbaraalvisiHomeSlider.iteration}"
            id="barbaraalvisi-home-slide-{$smarty.foreach.barbaraalvisiHomeSlider.iteration}"
            role="group"
            aria-roledescription="slide"
            aria-label="{$smarty.foreach.barbaraalvisiHomeSlider.iteration} / {$barbaraalvisiSlideTotal}"
            {if !$smarty.foreach.barbaraalvisiHomeSlider.first}aria-hidden="true"{/if}
          >
            <img
              class="barbaraalvisi-pdp-gallery-image js-barbaraalvisi-gallery-image"
              src="{$barbaraalvisiSlideSrc}"
              alt="{$barbaraalvisiSlideAlt|escape:'htmlall':'UTF-8'}"
              loading="{if $smarty.foreach.barbaraalvisiHomeSlider.first}eager{else}lazy{/if}"
              width="{$barbaraalvisiSlideWidth}"
              height="{$barbaraalvisiSlideHeight}"
              data-image-large-src="{$barbaraalvisiSlideSrc}"
              data-image-full-src="{$barbaraalvisiSlideSrc}"
            >

            {if !empty($slide.legend) || !empty($slide.title) || !empty($slide.description) || !empty($slide.url)}
              <figcaption class="barbaraalvisi-home-hero-caption">
                <div class="barbaraalvisi-home-hero-caption__inner">
                  {if !empty($slide.legend)}
                    <p class="barbaraalvisi-home-hero-caption__legend">{$slide.legend|escape:'htmlall':'UTF-8'}</p>
                  {/if}
                  {if !empty($slide.title)}
                    <h2 class="barbaraalvisi-home-hero-caption__title">{$slide.title|escape:'htmlall':'UTF-8'}</h2>
                  {/if}
                  {if !empty($slide.description)}
                    <div class="barbaraalvisi-home-hero-caption__description">{$slide.description nofilter}</div>
                  {/if}
                  {if !empty($slide.url)}
                    <a class="barbaraalvisi-home-hero-caption__cta" href="{$slide.url|escape:'htmlall':'UTF-8'}">
                      {if $language.iso_code == 'it'}Scopri{else}{l s='Discover' d='Shop.Theme.Global'}{/if}
                    </a>
                  {/if}
                </div>
              </figcaption>
            {/if}
          </figure>
        {/foreach}
      </div>

      {if $barbaraalvisiSlideTotal > 1}
        <div class="barbaraalvisi-pdp-gallery-controls">
          <nav class="barbaraalvisi-pdp-gallery-thumbs" aria-label="{if $language.iso_code == 'it'}Immagini homepage{else}{l s='Homepage images' d='Shop.Theme.Global'}{/if}">
            {foreach from=$homeslider.slides item=slide name=barbaraalvisiHomeSliderThumbs}
              {assign var='barbaraalvisiThumbAlt' value=''}
              {if !empty($slide.legend)}{assign var='barbaraalvisiThumbAlt' value=$slide.legend}{elseif !empty($slide.title)}{assign var='barbaraalvisiThumbAlt' value=$slide.title}{/if}
              {assign var='barbaraalvisiThumbWidth' value=80}
              {assign var='barbaraalvisiThumbHeight' value=80}
              {if !empty($slide.sizes[0]) && !empty($slide.sizes[1])}
                {assign var='barbaraalvisiThumbWidth' value=$slide.sizes[0]}
                {assign var='barbaraalvisiThumbHeight' value=$slide.sizes[1]}
              {/if}
              {assign var='barbaraalvisiThumbSrc' value=$slide.image_url}
              {if !empty($slide.image)}{assign var='barbaraalvisiThumbSrc' value="{$slide.image_url}?v={$slide.image|escape:'url'}"}{/if}

              <button
                type="button"
                class="barbaraalvisi-pdp-gallery-thumb btn-unstyle{if $smarty.foreach.barbaraalvisiHomeSliderThumbs.first} is-active{/if}"
                data-slide-index="{$smarty.foreach.barbaraalvisiHomeSliderThumbs.index}"
                aria-label="{$barbaraalvisiThumbAlt|escape:'htmlall':'UTF-8'} — {$smarty.foreach.barbaraalvisiHomeSliderThumbs.iteration}/{$barbaraalvisiSlideTotal}"
                {if $smarty.foreach.barbaraalvisiHomeSliderThumbs.first}aria-current="true"{/if}
              >
                <img
                  src="{$barbaraalvisiThumbSrc}"
                  alt=""
                  width="{$barbaraalvisiThumbWidth}"
                  height="{$barbaraalvisiThumbHeight}"
                  loading="lazy"
                >
              </button>
            {/foreach}
          </nav>

          <span class="barbaraalvisi-pdp-gallery-counter" aria-live="polite">
            <span class="barbaraalvisi-pdp-gallery-counter-current">1</span>/<span class="barbaraalvisi-pdp-gallery-counter-total">{$barbaraalvisiSlideTotal}</span>
          </span>
        </div>
      {/if}
    </div>
  </section>
{else}
  <section class="barbaraalvisi-home-hero barbaraalvisi-home-hero--empty" aria-hidden="true">
    <div class="barbaraalvisi-home-hero-empty" role="presentation"></div>
  </section>
{/if}
