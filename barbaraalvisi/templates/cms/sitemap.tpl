{**
 * Barbara Alvisi — mappa del sito
 *}
{extends file='parent:cms/sitemap.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Mappa del sito{else}{l s='Sitemap' d='Shop.Theme.Global'}{/if}
{/block}

{block name='page_content_container'}
  <div class="barbaraalvisi-sitemap-page barbaraalvisi-page-content barbaraalvisi-cms-page">
    <div class="barbaraalvisi-sitemap-grid">
      {foreach $sitemapUrls as $group}
        {assign var='barbaraalvisiSitemapGroup' value=$group.name}
        {if $language.iso_code == 'it'}
          {if $group.name == 'Products' || $group.name == 'Our products'}{assign var='barbaraalvisiSitemapGroup' value='Prodotti'}{/if}
          {if $group.name == 'Our company'}{assign var='barbaraalvisiSitemapGroup' value='La nostra azienda'}{/if}
          {if $group.name == 'Your account'}{assign var='barbaraalvisiSitemapGroup' value='Il tuo account'}{/if}
          {if $group.name == 'Pages'}{assign var='barbaraalvisiSitemapGroup' value='Pagine'}{/if}
          {if $group.name == 'Offers' || $group.name == 'Our offers'}{assign var='barbaraalvisiSitemapGroup' value='Le nostre offerte'}{/if}
          {if $group.name == 'Categories'}{assign var='barbaraalvisiSitemapGroup' value='Categorie'}{/if}
        {/if}
        <div class="barbaraalvisi-sitemap-col">
          <h2 class="barbaraalvisi-sitemap-group-title">{$barbaraalvisiSitemapGroup|escape:'htmlall':'UTF-8'}</h2>
          {include file='cms/_partials/sitemap-nested-list.tpl' links=$group.links}
        </div>
      {/foreach}
    </div>
  </div>
{/block}
