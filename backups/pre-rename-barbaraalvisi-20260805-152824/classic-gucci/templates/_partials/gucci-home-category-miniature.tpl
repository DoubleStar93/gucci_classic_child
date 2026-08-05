{**
 * Card categoria homepage — griglia prodotti + pulsante overlay
 *}
{assign var='gucciCatImgSrc' value=$category.image.url|default:''}

<div class="js-product product gucci-plp-cell gucci-product-miniature gucci-home-category-card{if empty($category.image.has_image)} is-no-image{/if}">
  <article class="product-miniature" data-id-category="{$category.id|intval}">
    <div class="thumbnail-container">
      <div class="thumbnail-top">
        <a href="{$category.url|escape:'html':'UTF-8'}" class="thumbnail product-thumbnail" tabindex="-1" aria-hidden="true">
          <picture>
            {if !empty($category.image.has_image) && $gucciCatImgSrc != ''}
              <img
                class="gucci-home-category-card__img"
                src="{$gucciCatImgSrc|escape:'html':'UTF-8'}"
                alt=""
                loading="lazy"
                width="{$category.image.width|intval}"
                height="{$category.image.height|intval}"
              >
            {/if}
          </picture>
        </a>

        <div class="gucci-home-category-card__overlay">
          <a
            href="{$category.url|escape:'html':'UTF-8'}"
            class="gucci-home-category-card__btn btn"
          >
            {$category.name|upper|escape:'htmlall':'UTF-8'}
          </a>
        </div>
      </div>
    </div>
  </article>
</div>
