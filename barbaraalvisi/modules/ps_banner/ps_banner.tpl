{**
 * Barbara Alvisi — banner editoriale homepage
 *}
<section class="barbaraalvisi-home-banner-wrap">
  <a class="barbaraalvisi-home-banner" href="{$banner_link|escape:'htmlall':'UTF-8'}" title="{$banner_desc|escape:'htmlall':'UTF-8'}">
    {if isset($banner_img)}
      <img
        src="{$banner_img}"
        alt="{$banner_desc|escape:'htmlall':'UTF-8'}"
        title="{$banner_desc|escape:'htmlall':'UTF-8'}"
        class="barbaraalvisi-home-banner__image"
        loading="lazy"
        width="1110"
        height="213"
      >
    {else}
      <span class="barbaraalvisi-home-banner__text">{$banner_desc|escape:'htmlall':'UTF-8'}</span>
    {/if}
  </a>
</section>
