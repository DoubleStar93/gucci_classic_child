{**
 * Barbara Alvisi — card marchio
 *}
{extends file='parent:catalog/_partials/miniatures/brand.tpl'}

{block name='brand_miniature_item'}
  <article class="barbaraalvisi-brand-card brand">
    <a href="{$brand.url}" class="barbaraalvisi-brand-card__link" title="{$brand.name|escape:'htmlall':'UTF-8'}">
      {if $brand.image}
        <div class="barbaraalvisi-brand-card__media">
          <picture>
            {if !empty($brand.image.bySize.small_default.sources.avif)}
              <source srcset="{$brand.image.bySize.small_default.sources.avif}" type="image/avif">
            {/if}
            {if !empty($brand.image.bySize.small_default.sources.webp)}
              <source srcset="{$brand.image.bySize.small_default.sources.webp}" type="image/webp">
            {/if}
            <img
              src="{$brand.image.bySize.small_default.url}"
              alt="{$brand.name|escape:'htmlall':'UTF-8'}"
              loading="lazy"
              width="{$brand.image.bySize.small_default.width}"
              height="{$brand.image.bySize.small_default.height}"
            >
          </picture>
        </div>
      {/if}
      <div class="barbaraalvisi-brand-card__body">
        <h2 class="barbaraalvisi-brand-card__name">{$brand.name|escape:'htmlall':'UTF-8'}</h2>
        <p class="barbaraalvisi-brand-card__count">
          {if $brand.nb_products > 1}
            {if $language.iso_code == 'it'}
              {$brand.nb_products} articoli
            {else}
              {l s='%number% products' d='Shop.Theme.Catalog' sprintf=['%number%' => $brand.nb_products]}
            {/if}
          {elseif $brand.nb_products == 1}
            {if $language.iso_code == 'it'}1 articolo{else}{l s='%number% product' d='Shop.Theme.Catalog' sprintf=['%number%' => 1]}{/if}
          {else}
            {if $language.iso_code == 'it'}Nessun prodotto{else}{l s='No products' d='Shop.Theme.Catalog'}{/if}
          {/if}
        </p>
        <span class="barbaraalvisi-brand-card__cta">
          {if $language.iso_code == 'it'}Scopri{else}{l s='View products' d='Shop.Theme.Actions'}{/if}
        </span>
      </div>
    </a>
  </article>
{/block}
