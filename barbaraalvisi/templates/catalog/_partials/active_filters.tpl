{**
 * Barbara Alvisi — chip filtri attivi
 *}
<section
  id="js-active-search-filters"
  class="barbaraalvisi-active-filters{if !$activeFilters|count} barbaraalvisi-active-filters--empty{/if}"
>
  {if $activeFilters|count}
    <ul class="barbaraalvisi-active-filters__list">
      {foreach from=$activeFilters item="filter"}
        {assign var='barbaraalvisiFacetLabel' value=$filter.facetLabel}
        {assign var='barbaraalvisiFilterLabel' value=$filter.label}
        {if isset($language) && $language.iso_code == 'it'}
          {if $filter.facetLabel == 'Availability'}{assign var='barbaraalvisiFacetLabel' value='Disponibilità'}{/if}
          {if $filter.facetLabel == 'Selections'}{assign var='barbaraalvisiFacetLabel' value='Selezioni'}{/if}
          {if $filter.facetLabel == 'Price'}{assign var='barbaraalvisiFacetLabel' value='Prezzo'}{/if}
          {if $filter.facetLabel == 'Categories'}{assign var='barbaraalvisiFacetLabel' value='Categorie'}{/if}
          {if $filter.facetLabel == 'Size'}{assign var='barbaraalvisiFacetLabel' value='Taglia'}{/if}
          {if $filter.facetLabel == 'Color'}{assign var='barbaraalvisiFacetLabel' value='Colore'}{/if}
          {if $filter.facetLabel == 'Composition'}{assign var='barbaraalvisiFacetLabel' value='Composizione'}{/if}
          {if $filter.facetLabel == 'Property'}{assign var='barbaraalvisiFacetLabel' value='Caratteristiche'}{/if}
          {if $filter.facetLabel == 'Weight'}{assign var='barbaraalvisiFacetLabel' value='Peso'}{/if}
          {if $filter.facetLabel == 'Brand'}{assign var='barbaraalvisiFacetLabel' value='Marca'}{/if}
          {if $filter.label == 'In stock'}{assign var='barbaraalvisiFilterLabel' value='In magazzino'}{/if}
          {if $filter.label == 'Not available'}{assign var='barbaraalvisiFilterLabel' value='Non disponibile'}{/if}
          {if $filter.label == 'New product'}{assign var='barbaraalvisiFilterLabel' value='Nuovo prodotto'}{/if}
          {if $filter.label == 'Discounted'}{assign var='barbaraalvisiFilterLabel' value='Scontato'}{/if}
        {/if}
        <li class="barbaraalvisi-active-filters__item">
          <span class="barbaraalvisi-active-filters__chip">
            <span class="barbaraalvisi-active-filters__facet">{$barbaraalvisiFacetLabel|escape:'htmlall':'UTF-8'}</span>
            <span class="barbaraalvisi-active-filters__value">{$barbaraalvisiFilterLabel|escape:'htmlall':'UTF-8'}</span>
            <a
              class="barbaraalvisi-active-filters__remove js-search-link"
              href="{$filter.nextEncodedFacetsURL}"
              rel="nofollow"
              aria-label="{if isset($language) && $language.iso_code == 'it'}Rimuovi {$barbaraalvisiFilterLabel|escape:'htmlall':'UTF-8'}{else}{l s='Remove' d='Shop.Theme.Actions'} {$barbaraalvisiFilterLabel|escape:'htmlall':'UTF-8'}{/if}"
            >
              <i class="material-icons" aria-hidden="true">close</i>
            </a>
          </span>
        </li>
      {/foreach}
    </ul>
  {/if}
</section>
