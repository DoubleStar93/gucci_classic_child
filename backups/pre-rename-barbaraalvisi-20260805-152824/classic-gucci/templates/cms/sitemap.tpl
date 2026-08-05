{**
 * Classic Gucci — mappa del sito
 *}
{extends file='parent:cms/sitemap.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Mappa del sito{else}{l s='Sitemap' d='Shop.Theme.Global'}{/if}
{/block}

{block name='page_content_container'}
  <div class="gucci-sitemap-page gucci-page-content gucci-cms-page">
    <div class="gucci-sitemap-grid">
      {foreach $sitemapUrls as $group}
        {assign var='gucciSitemapGroup' value=$group.name}
        {if $language.iso_code == 'it'}
          {if $group.name == 'Products' || $group.name == 'Our products'}{assign var='gucciSitemapGroup' value='Prodotti'}{/if}
          {if $group.name == 'Our company'}{assign var='gucciSitemapGroup' value='La nostra azienda'}{/if}
          {if $group.name == 'Your account'}{assign var='gucciSitemapGroup' value='Il tuo account'}{/if}
          {if $group.name == 'Pages'}{assign var='gucciSitemapGroup' value='Pagine'}{/if}
          {if $group.name == 'Offers' || $group.name == 'Our offers'}{assign var='gucciSitemapGroup' value='Le nostre offerte'}{/if}
          {if $group.name == 'Categories'}{assign var='gucciSitemapGroup' value='Categorie'}{/if}
        {/if}
        <div class="gucci-sitemap-col">
          <h2 class="gucci-sitemap-group-title">{$gucciSitemapGroup|escape:'htmlall':'UTF-8'}</h2>
          {include file='cms/_partials/sitemap-nested-list.tpl' links=$group.links}
        </div>
      {/foreach}
    </div>
  </div>
{/block}
