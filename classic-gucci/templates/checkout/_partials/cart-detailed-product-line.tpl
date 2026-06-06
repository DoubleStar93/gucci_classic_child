{**
 * Classic Gucci — riga prodotto nel carrello (IT + rimuovi icona)
 *}
<div class="product-line-grid">
  <div class="product-line-grid-left col-md-3 col-xs-4">
    <span class="product-image media-middle">
      {if $product.default_image}
        <picture>
          {if !empty($product.default_image.bySize.cart_default.sources.avif)}<source srcset="{$product.default_image.bySize.cart_default.sources.avif}" type="image/avif">{/if}
          {if !empty($product.default_image.bySize.cart_default.sources.webp)}<source srcset="{$product.default_image.bySize.cart_default.sources.webp}" type="image/webp">{/if}
          <img src="{$product.default_image.bySize.cart_default.url}" alt="{$product.name|escape:'quotes'}" loading="lazy">
        </picture>
      {else}
        <picture>
          {if !empty($urls.no_picture_image.bySize.cart_default.sources.avif)}<source srcset="{$urls.no_picture_image.bySize.cart_default.sources.avif}" type="image/avif">{/if}
          {if !empty($urls.no_picture_image.bySize.cart_default.sources.webp)}<source srcset="{$urls.no_picture_image.bySize.cart_default.sources.webp}" type="image/webp">{/if}
          <img src="{$urls.no_picture_image.bySize.cart_default.url}" loading="lazy" alt="{$product.name|escape:'quotes'}">
        </picture>
      {/if}
    </span>
  </div>

  <div class="product-line-grid-body col-md-4 col-xs-8">
    <div class="product-line-info">
      <a class="label" href="{$product.url}" data-id_customization="{$product.id_customization|intval}">{$product.name}</a>
    </div>

    <div class="product-line-info product-price h5 {if $product.has_discount}has-discount{/if}">
      {if $product.has_discount}
        <div class="product-discount">
          <span class="regular-price">{$product.regular_price}</span>
          {if $product.discount_type === 'percentage'}
            <span class="discount discount-percentage">-{$product.discount_percentage_absolute}</span>
          {else}
            <span class="discount discount-amount">-{$product.discount_to_display}</span>
          {/if}
        </div>
      {/if}
      <div class="current-price">
        <span class="price">{$product.price}</span>
        {if $product.unit_price_full}
          <div class="unit-price-cart">{$product.unit_price_full}</div>
        {/if}
      </div>
      {hook h='displayProductPriceBlock' product=$product type="unit_price"}
    </div>

    <br>

    {foreach from=$product.attributes key="attribute" item="value"}
      {assign var='gucciAttrLabel' value=$attribute}
      {assign var='gucciAttrValue' value=$value}
      {if $language.iso_code == 'it'}
        {if $attribute == 'Size'}{assign var='gucciAttrLabel' value='Taglia'}{/if}
        {if $attribute == 'Color'}{assign var='gucciAttrLabel' value='Colore'}{/if}
        {if $attribute == 'Dimension'}{assign var='gucciAttrLabel' value='Dimensione'}{/if}
        {if $value == 'White'}{assign var='gucciAttrValue' value='Bianco'}{/if}
        {if $value == 'Black'}{assign var='gucciAttrValue' value='Nero'}{/if}
      {/if}
      <div class="product-line-info {$attribute|lower}">
        <span class="label">{$gucciAttrLabel}:</span>
        <span class="value">{$gucciAttrValue}</span>
      </div>
    {/foreach}

    {if is_array($product.customizations) && $product.customizations|count}
      <br>
      {block name='cart_detailed_product_line_customization'}
        {foreach from=$product.customizations item="customization"}
          <a href="#" data-toggle="modal" data-target="#product-customizations-modal-{$customization.id_customization}">
            {if $language.iso_code == 'it'}Personalizzazione prodotto{else}{l s='Product customization' d='Shop.Theme.Catalog'}{/if}
          </a>
          <div class="modal fade customization-modal js-customization-modal" id="product-customizations-modal-{$customization.id_customization}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  {include
                    file='_partials/gucci-panel-close.tpl'
                    extraClass='gucci-modal-close'
                    closeAttr='data-dismiss="modal"'
                  }
                  <h4 class="modal-title">
                    {if $language.iso_code == 'it'}Personalizzazione prodotto{else}{l s='Product customization' d='Shop.Theme.Catalog'}{/if}
                  </h4>
                </div>
                <div class="modal-body">
                  {foreach from=$customization.fields item="field"}
                    <div class="product-customization-line row">
                      <div class="col-sm-3 col-xs-4 label">{$field.label}</div>
                      <div class="col-sm-9 col-xs-8 value">
                        {if $field.type == 'text'}
                          {if (int)$field.id_module}{$field.text nofilter}{else}{$field.text}{/if}
                        {elseif $field.type == 'image'}
                          <img src="{$field.image.small.url}" loading="lazy" alt="">
                        {/if}
                      </div>
                    </div>
                  {/foreach}
                </div>
              </div>
            </div>
          </div>
        {/foreach}
      {/block}
    {/if}
    {hook h='displayCartExtraProductInfo' product=$product}
  </div>

  <div class="product-line-grid-right product-line-actions col-md-5 col-xs-12">
    <div class="row">
      <div class="col-xs-4 hidden-md-up"></div>
      <div class="col-md-10 col-xs-6">
        <div class="row">
          <div class="col-md-6 col-xs-6 qty">
            {if !empty($product.is_gift)}
              <span class="gift-quantity">{$product.quantity}</span>
            {else}
              <input
                class="js-cart-line-product-quantity"
                data-down-url="{$product.down_quantity_url}"
                data-up-url="{$product.up_quantity_url}"
                data-update-url="{$product.update_quantity_url}"
                data-product-id="{$product.id_product}"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                value="{$product.quantity}"
                name="product-quantity-spin"
                aria-label="{if $language.iso_code == 'it'}Quantità: {$product.name|escape:'htmlall':'UTF-8'}{else}{l s='%productName% product quantity field' sprintf=['%productName%' => $product.name] d='Shop.Theme.Checkout'}{/if}"
              />
            {/if}
          </div>
          <div class="col-md-6 col-xs-2 price">
            <span class="product-price">
              <strong>
                {if !empty($product.is_gift)}
                  <span class="gift">{if $language.iso_code == 'it'}Omaggio{else}{l s='Gift' d='Shop.Theme.Checkout'}{/if}</span>
                {else}
                  {$product.total}
                {/if}
              </strong>
            </span>
          </div>
        </div>
      </div>
      <div class="col-md-2 col-xs-2 text-xs-right">
        <div class="cart-line-product-actions">
          {if empty($product.is_gift)}
            <a
              class="remove-from-cart"
              rel="nofollow"
              href="{$product.remove_from_cart_url}"
              data-link-action="delete-from-cart"
              data-id-product="{$product.id_product|escape:'javascript'}"
              data-id-product-attribute="{$product.id_product_attribute|escape:'javascript'}"
              data-id-customization="{$product.id_customization|default|escape:'javascript'}"
              aria-label="{if $language.iso_code == 'it'}Rimuovi{else}{l s='Remove' d='Shop.Theme.Actions'}{/if}"
              title="{if $language.iso_code == 'it'}Rimuovi{else}{l s='Remove' d='Shop.Theme.Actions'}{/if}"
            >
              <i class="material-icons float-xs-left" aria-hidden="true">close</i>
            </a>
          {/if}

          {block name='hook_cart_extra_product_actions'}
            {hook h='displayCartExtraProductActions' product=$product}
          {/block}
        </div>
      </div>
    </div>
  </div>

  <div class="clearfix"></div>
</div>
