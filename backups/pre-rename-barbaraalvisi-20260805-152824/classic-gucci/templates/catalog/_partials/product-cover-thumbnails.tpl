{**
 * Classic Gucci — cover/thumbs refreshati da PrestaShop AJAX (cambio variante).
 * Deve restare `.images-container.js-images-container` perché core.js fa replaceWith
 * su quel selettore dopo `action=refresh`.
 *}
<div class="images-container js-images-container gucci-pdp-images-container">
  {include file='catalog/_partials/gucci-product-gallery.tpl' galleryMode='all'}
</div>
