{**
 * Barbara Alvisi — override miniature prodotto
 * Layout minimalista: nome in evidenza, prezzo piccolo sotto, senza etichette invadenti.
 * Hover (desktop): mostra la seconda foto se disponibile.
 *}
{block name='product_miniature_item'}
{assign var='barbaraalvisiHoverImage' value=false}
{if $product.cover && isset($product.images) && $product.images|count > 1}
  {foreach from=$product.images item=barbaraalvisiImage}
    {if !$barbaraalvisiHoverImage && isset($barbaraalvisiImage.id_image) && $barbaraalvisiImage.id_image != $product.cover.id_image}
      {assign var='barbaraalvisiHoverImage' value=$barbaraalvisiImage}
    {/if}
  {/foreach}
{/if}
<div class="js-product product barbaraalvisi-product-miniature{if !empty($productClasses)} {$productClasses}{/if}{if $barbaraalvisiHoverImage} has-barbaraalvisi-hover-image{/if}">
  <article class="product-miniature js-product-miniature" data-id-product="{$product.id_product}" data-id-product-attribute="{$product.id_product_attribute}">
    <div class="thumbnail-container">
      <div class="thumbnail-top">
        {block name='product_thumbnail'}
          {if $product.cover}
            {* large_default (800px): home_default (250px) risultava sfocato sulle celle full-bleed / Retina *}
            <a href="{$product.url}" class="thumbnail product-thumbnail{if $barbaraalvisiHoverImage} barbaraalvisi-thumb-swap{/if}">
              <picture class="barbaraalvisi-thumb-swap__primary">
                {if !empty($product.cover.bySize.large_default.sources.avif)}<source srcset="{$product.cover.bySize.large_default.sources.avif}" type="image/avif">{/if}
                {if !empty($product.cover.bySize.large_default.sources.webp)}<source srcset="{$product.cover.bySize.large_default.sources.webp}" type="image/webp">{/if}
                <img
                  src="{$product.cover.bySize.large_default.url}"
                  alt="{if !empty($product.cover.legend)}{$product.cover.legend}{else}{$product.name|truncate:30:'...'}{/if}"
                  loading="lazy"
                  data-full-size-image-url="{$product.cover.large.url}"
                  width="{$product.cover.bySize.large_default.width}"
                  height="{$product.cover.bySize.large_default.height}"
                />
              </picture>
              {if $barbaraalvisiHoverImage}
                <picture class="barbaraalvisi-thumb-swap__secondary" aria-hidden="true">
                  {if !empty($barbaraalvisiHoverImage.bySize.large_default.sources.avif)}<source srcset="{$barbaraalvisiHoverImage.bySize.large_default.sources.avif}" type="image/avif">{/if}
                  {if !empty($barbaraalvisiHoverImage.bySize.large_default.sources.webp)}<source srcset="{$barbaraalvisiHoverImage.bySize.large_default.sources.webp}" type="image/webp">{/if}
                  <img
                    src="{$barbaraalvisiHoverImage.bySize.large_default.url}"
                    alt=""
                    loading="lazy"
                    width="{$barbaraalvisiHoverImage.bySize.large_default.width}"
                    height="{$barbaraalvisiHoverImage.bySize.large_default.height}"
                  />
                </picture>
              {/if}
            </a>
          {else}
            <a href="{$product.url}" class="thumbnail product-thumbnail">
              <picture>
                {if !empty($urls.no_picture_image.bySize.large_default.sources.avif)}<source srcset="{$urls.no_picture_image.bySize.large_default.sources.avif}" type="image/avif">{/if}
                {if !empty($urls.no_picture_image.bySize.large_default.sources.webp)}<source srcset="{$urls.no_picture_image.bySize.large_default.sources.webp}" type="image/webp">{/if}
                <img
                  src="{$urls.no_picture_image.bySize.large_default.url}"
                  loading="lazy"
                  width="{$urls.no_picture_image.bySize.large_default.width}"
                  height="{$urls.no_picture_image.bySize.large_default.height}"
                />
              </picture>
            </a>
          {/if}
        {/block}
      </div>

      <div class="product-description">
        {block name='product_name'}
          <h3 class="h3 product-title"><a href="{$product.url}" content="{$product.url}">{$product.name|truncate:55:'...'}</a></h3>
        {/block}

        {block name='product_price_and_shipping'}
          {if $product.show_price}
            <div class="product-price-and-shipping">
              {hook h='displayProductPriceBlock' product=$product type="before_price"}

              <span class="price barbaraalvisi-price" aria-label="{if $language.iso_code == 'it'}Prezzo{else}{l s='Price' d='Shop.Theme.Catalog'}{/if}">
                {capture name='custom_price'}{hook h='displayProductPriceBlock' product=$product type='custom_price' hook_origin='products_list'}{/capture}
                {if '' !== $smarty.capture.custom_price}
                  {$smarty.capture.custom_price nofilter}
                {else}
                  {$product.price}
                {/if}
              </span>

              {hook h='displayProductPriceBlock' product=$product type='unit_price'}
              {hook h='displayProductPriceBlock' product=$product type='weight'}
            </div>
          {/if}
        {/block}

        {block name='product_reviews'}{/block}
      </div>
    </div>
  </article>
</div>
{/block}
