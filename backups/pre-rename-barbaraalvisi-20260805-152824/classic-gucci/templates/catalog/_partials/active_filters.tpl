{**
 * Classic Gucci — chip filtri attivi
 *}
<section
  id="js-active-search-filters"
  class="gucci-active-filters{if !$activeFilters|count} gucci-active-filters--empty{/if}"
>
  {if $activeFilters|count}
    <ul class="gucci-active-filters__list">
      {foreach from=$activeFilters item="filter"}
        {assign var='gucciFacetLabel' value=$filter.facetLabel}
        {assign var='gucciFilterLabel' value=$filter.label}
        {if isset($language) && $language.iso_code == 'it'}
          {if $filter.facetLabel == 'Availability'}{assign var='gucciFacetLabel' value='Disponibilità'}{/if}
          {if $filter.facetLabel == 'Selections'}{assign var='gucciFacetLabel' value='Selezioni'}{/if}
          {if $filter.facetLabel == 'Price'}{assign var='gucciFacetLabel' value='Prezzo'}{/if}
          {if $filter.facetLabel == 'Categories'}{assign var='gucciFacetLabel' value='Categorie'}{/if}
          {if $filter.facetLabel == 'Size'}{assign var='gucciFacetLabel' value='Taglia'}{/if}
          {if $filter.facetLabel == 'Color'}{assign var='gucciFacetLabel' value='Colore'}{/if}
          {if $filter.facetLabel == 'Composition'}{assign var='gucciFacetLabel' value='Composizione'}{/if}
          {if $filter.facetLabel == 'Property'}{assign var='gucciFacetLabel' value='Caratteristiche'}{/if}
          {if $filter.facetLabel == 'Weight'}{assign var='gucciFacetLabel' value='Peso'}{/if}
          {if $filter.facetLabel == 'Brand'}{assign var='gucciFacetLabel' value='Marca'}{/if}
          {if $filter.label == 'In stock'}{assign var='gucciFilterLabel' value='In magazzino'}{/if}
          {if $filter.label == 'Not available'}{assign var='gucciFilterLabel' value='Non disponibile'}{/if}
          {if $filter.label == 'New product'}{assign var='gucciFilterLabel' value='Nuovo prodotto'}{/if}
          {if $filter.label == 'Discounted'}{assign var='gucciFilterLabel' value='Scontato'}{/if}
        {/if}
        <li class="gucci-active-filters__item">
          <span class="gucci-active-filters__chip">
            <span class="gucci-active-filters__facet">{$gucciFacetLabel|escape:'htmlall':'UTF-8'}</span>
            <span class="gucci-active-filters__value">{$gucciFilterLabel|escape:'htmlall':'UTF-8'}</span>
            <a
              class="gucci-active-filters__remove js-search-link"
              href="{$filter.nextEncodedFacetsURL}"
              rel="nofollow"
              aria-label="{if isset($language) && $language.iso_code == 'it'}Rimuovi {$gucciFilterLabel|escape:'htmlall':'UTF-8'}{else}{l s='Remove' d='Shop.Theme.Actions'} {$gucciFilterLabel|escape:'htmlall':'UTF-8'}{/if}"
            >
              <i class="material-icons" aria-hidden="true">close</i>
            </a>
          </span>
        </li>
      {/foreach}
    </ul>
  {/if}
</section>
