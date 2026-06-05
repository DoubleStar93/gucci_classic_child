{**
 * Classic Gucci — sottocategorie PLP (link orizzontali editoriali)
 *}
{if isset($subcategories) && $subcategories|count}
  <nav id="subcategories" class="gucci-plp-subcategories" aria-label="{if $language.iso_code == 'it'}Sottocategorie{else}{l s='Subcategories' d='Shop.Theme.Catalog'}{/if}">
    <ul class="gucci-plp-subcategories__list">
      {foreach from=$subcategories item=subcategory}
        {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$subcategory.name scope='parent'}
        <li class="gucci-plp-subcategories__item">
          <a
            href="{$subcategory.url|escape:'html':'UTF-8'}"
            class="gucci-plp-subcategories__link{if !empty($subcategory.current)} is-current{/if}"
            {if !empty($subcategory.current)} aria-current="page"{/if}
          >
            {$gucciLabelOut|escape:'htmlall':'UTF-8'}
          </a>
        </li>
      {/foreach}
    </ul>
  </nav>
{/if}
