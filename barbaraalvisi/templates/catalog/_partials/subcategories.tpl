{**
 * Barbara Alvisi — sottocategorie PLP (link orizzontali editoriali)
 *}
{if isset($subcategories) && $subcategories|count}
  <nav id="subcategories" class="barbaraalvisi-plp-subcategories" aria-label="{if $language.iso_code == 'it'}Sottocategorie{else}{l s='Subcategories' d='Shop.Theme.Catalog'}{/if}">
    <ul class="barbaraalvisi-plp-subcategories__list">
      {foreach from=$subcategories item=subcategory}
        {include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$subcategory.name scope='parent'}
        <li class="barbaraalvisi-plp-subcategories__item">
          <a
            href="{$subcategory.url|escape:'html':'UTF-8'}"
            class="barbaraalvisi-plp-subcategories__link{if !empty($subcategory.current)} is-current{/if}"
            {if !empty($subcategory.current)} aria-current="page"{/if}
          >
            {$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}
          </a>
        </li>
      {/foreach}
    </ul>
  </nav>
{/if}
