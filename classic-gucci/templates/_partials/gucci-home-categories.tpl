{**
 * Classic Gucci — griglia categorie editoriale (2 colonne) sotto hero / prima banner
 *
 * ID categorie demo PrestaShop — aggiornare se cambiano in BO
 * Immagini opzionali: themes/classic-gucci/assets/img/home/cat-{id}.jpg
 *}
{assign var='gucciHomeCats' value=[
  ['id' => 3, 'label_it' => 'Abbigliamento', 'label_en' => 'Clothes'],
  ['id' => 6, 'label_it' => 'Accessori', 'label_en' => 'Accessories'],
  ['id' => 9, 'label_it' => 'Arte', 'label_en' => 'Art']
]}

<section class="gucci-home-categories gucci-home-editorial" aria-label="{if $language.iso_code == 'it'}Categorie{else}{l s='Categories' d='Shop.Theme.Catalog'}{/if}">
  <h2 class="gucci-home-editorial__title">
    {if $language.iso_code == 'it'}Esplora{else}Explore{/if}
  </h2>

  <div class="gucci-home-editorial-grid">
    {foreach from=$gucciHomeCats item=cat}
      {assign var='gucciCatImg' value=$urls.base_url|cat:'themes/classic-gucci/assets/img/home/cat-'|cat:$cat.id|cat:'.jpg'}
      <a
        class="gucci-home-editorial-cell"
        href="{$link->getCategoryLink($cat.id)|escape:'html':'UTF-8'}"
        title="{if $language.iso_code == 'it'}{$cat.label_it}{else}{$cat.label_en}{/if}"
        data-category-id="{$cat.id|intval}"
      >
        <span class="gucci-home-editorial-cell__media" aria-hidden="true">
          <img
            class="gucci-home-editorial-cell__img"
            src="{$gucciCatImg|escape:'html':'UTF-8'}"
            alt=""
            loading="lazy"
            width="800"
            height="1000"
            onerror="this.closest('.gucci-home-editorial-cell').classList.add('is-no-image')"
          >
        </span>
        <span class="gucci-home-editorial-cell__content">
          <span class="gucci-home-editorial-cell__label">
            {if $language.iso_code == 'it'}{$cat.label_it}{else}{$cat.label_en}{/if}
          </span>
          <span class="gucci-home-editorial-cell__cta">
            {if $language.iso_code == 'it'}Scopri{else}{l s='Discover' d='Shop.Theme.Actions'}{/if}
          </span>
        </span>
      </a>
    {/foreach}
  </div>
</section>
