{**
 * Barbara Alvisi — override ps_facetedsearch (etichette IT + struttura drawer)
 *}
{if $displayedFacets|count}
  <div id="search_filters" class="barbaraalvisi-facets">
    {block name='facets_title'}
      <p class="barbaraalvisi-facets-title">
        {if isset($language) && $language.iso_code == 'it'}Filtra per{else}{l s='Filter By' d='Shop.Theme.Actions'}{/if}
      </p>
    {/block}

    {block name='facets_clearall_button'}
      {if $activeFilters|count}
        <div class="barbaraalvisi-facets-clear">
          <button data-search-url="{$clear_all_link}" class="barbaraalvisi-facets-clear-btn btn-unstyle js-search-filters-clear-all">
            {if isset($language) && $language.iso_code == 'it'}Cancella tutto{else}{l s='Clear all' d='Shop.Theme.Actions'}{/if}
          </button>
        </div>
      {/if}
    {/block}

    {foreach from=$displayedFacets item="facet"}
      {assign var='barbaraalvisiFacetLabel' value=$facet.label}
      {if isset($language) && $language.iso_code == 'it'}
        {if $facet.label == 'Availability'}{assign var='barbaraalvisiFacetLabel' value='Disponibilità'}{/if}
        {if $facet.label == 'Selections'}{assign var='barbaraalvisiFacetLabel' value='Selezioni'}{/if}
        {if $facet.label == 'Price'}{assign var='barbaraalvisiFacetLabel' value='Prezzo'}{/if}
        {if $facet.label == 'Categories'}{assign var='barbaraalvisiFacetLabel' value='Categorie'}{/if}
        {if $facet.label == 'Size'}{assign var='barbaraalvisiFacetLabel' value='Taglia'}{/if}
        {if $facet.label == 'Color'}{assign var='barbaraalvisiFacetLabel' value='Colore'}{/if}
        {if $facet.label == 'Composition'}{assign var='barbaraalvisiFacetLabel' value='Composizione'}{/if}
        {if $facet.label == 'Property'}{assign var='barbaraalvisiFacetLabel' value='Caratteristiche'}{/if}
        {if $facet.label == 'Weight'}{assign var='barbaraalvisiFacetLabel' value='Peso'}{/if}
        {if $facet.label == 'Brand'}{assign var='barbaraalvisiFacetLabel' value='Marca'}{/if}
        {if $facet.label == 'Condition'}{assign var='barbaraalvisiFacetLabel' value='Condizione'}{/if}
        {if $facet.label == 'Dimension'}{assign var='barbaraalvisiFacetLabel' value='Dimensione'}{/if}
        {if $facet.label == 'Paper Type'}{assign var='barbaraalvisiFacetLabel' value='Tipo carta'}{/if}
        {if $facet.label == 'Manufacturers'}{assign var='barbaraalvisiFacetLabel' value='Marchi'}{/if}
      {/if}

      <section class="facet barbaraalvisi-facet">
        <p class="barbaraalvisi-facet-title h6 facet-title hidden-sm-up">{$barbaraalvisiFacetLabel|escape:'htmlall':'UTF-8'}</p>
        {assign var=_expand_id value=10|mt_rand:100000}
        {assign var=_collapse value=true}
        {foreach from=$facet.filters item="filter"}
          {if $filter.active}{assign var=_collapse value=false}{/if}
        {/foreach}

        <div class="title hidden-md-up" data-target="#facet_{$_expand_id}" data-toggle="collapse"{if !$_collapse} aria-expanded="true"{/if}>
          <p class="h6 facet-title">{$barbaraalvisiFacetLabel|escape:'htmlall':'UTF-8'}</p>
          <span class="navbar-toggler collapse-icons">
            <i class="material-icons add">&#xE313;</i>
            <i class="material-icons remove">&#xE316;</i>
          </span>
        </div>

        {if in_array($facet.widgetType, ['radio', 'checkbox'])}
          <div id="facet_{$_expand_id}" class="collapse{if !$_collapse} in{/if}">
            <ul class="barbaraalvisi-facet-list">
              {foreach from=$facet.filters key=filter_key item="filter"}
                {if !$filter.displayed}{continue}{/if}
                {assign var='barbaraalvisiFilterLabel' value=$filter.label}
                {if isset($language) && $language.iso_code == 'it'}
                  {if $filter.label == 'In stock'}{assign var='barbaraalvisiFilterLabel' value='In magazzino'}{/if}
                  {if $filter.label == 'Not available'}{assign var='barbaraalvisiFilterLabel' value='Non disponibile'}{/if}
                  {if $filter.label == 'New product'}{assign var='barbaraalvisiFilterLabel' value='Nuovo prodotto'}{/if}
                  {if $filter.label == 'Discounted'}{assign var='barbaraalvisiFilterLabel' value='Scontato'}{/if}
                  {if $filter.label == 'Long sleeves'}{assign var='barbaraalvisiFilterLabel' value='Maniche lunghe'}{/if}
                  {if $filter.label == 'Short sleeves'}{assign var='barbaraalvisiFilterLabel' value='Maniche corte'}{/if}
                  {if $filter.label == 'Matt paper'}{assign var='barbaraalvisiFilterLabel' value='Carta opaca'}{/if}
                  {if $filter.label == 'Recycled cardboard'}{assign var='barbaraalvisiFilterLabel' value='Cartone riciclato'}{/if}
                  {if $filter.label == 'Ceramic'}{assign var='barbaraalvisiFilterLabel' value='Ceramica'}{/if}
                  {if $filter.label == '120 pages'}{assign var='barbaraalvisiFilterLabel' value='120 pagine'}{/if}
                  {if $filter.label == 'Removable cover'}{assign var='barbaraalvisiFilterLabel' value='Copertina removibile'}{/if}
                  {if $filter.label == 'Ruled'}{assign var='barbaraalvisiFilterLabel' value='Righe'}{/if}
                  {if $filter.label == 'Plain'}{assign var='barbaraalvisiFilterLabel' value='Bianco'}{/if}
                  {if $filter.label == 'Squared'}{assign var='barbaraalvisiFilterLabel' value='Quadretti'}{/if}
                  {if $filter.label == 'Doted'}{assign var='barbaraalvisiFilterLabel' value='Puntini'}{/if}
                  {if $filter.label == 'White'}{assign var='barbaraalvisiFilterLabel' value='Bianco'}{/if}
                  {if $filter.label == 'Black'}{assign var='barbaraalvisiFilterLabel' value='Nero'}{/if}
                  {if $filter.label == 'Grey'}{assign var='barbaraalvisiFilterLabel' value='Grigio'}{/if}
                  {if $filter.label == 'Beige'}{assign var='barbaraalvisiFilterLabel' value='Beige'}{/if}
                  {if $filter.label == 'Clothes'}{assign var='barbaraalvisiFilterLabel' value='Abbigliamento'}{/if}
                  {if $filter.label == 'Accessories'}{assign var='barbaraalvisiFilterLabel' value='Accessori'}{/if}
                  {if $filter.label == 'Art'}{assign var='barbaraalvisiFilterLabel' value='Arte'}{/if}
                  {if $filter.label == 'Men'}{assign var='barbaraalvisiFilterLabel' value='Uomo'}{/if}
                  {if $filter.label == 'Women'}{assign var='barbaraalvisiFilterLabel' value='Donna'}{/if}
                  {if $filter.label == 'Stationery'}{assign var='barbaraalvisiFilterLabel' value='Cancelleria'}{/if}
                  {if $filter.label == 'Home Accessories'}{assign var='barbaraalvisiFilterLabel' value='Accessori per la casa'}{/if}
                {/if}
                <li>
                  <label class="facet-label{if $filter.active} active{/if}" for="facet_input_{$_expand_id}_{$filter_key}">
                    {if $facet.multipleSelectionAllowed}
                      <span class="custom-checkbox">
                        <input id="facet_input_{$_expand_id}_{$filter_key}" data-search-url="{$filter.nextEncodedFacetsURL}" type="checkbox"{if $filter.active} checked{/if}>
                        {if isset($filter.properties.color)}
                          <span class="color" style="background-color:{$filter.properties.color}"></span>
                        {elseif isset($filter.properties.texture)}
                          <span class="color texture" style="background-image:url({$filter.properties.texture})"></span>
                        {else}
                          <span class="ps-shown-by-js"><i class="material-icons rtl-no-flip checkbox-checked">&#xE5CA;</i></span>
                        {/if}
                      </span>
                    {else}
                      <span class="custom-radio">
                        <input id="facet_input_{$_expand_id}_{$filter_key}" data-search-url="{$filter.nextEncodedFacetsURL}" type="radio" name="filter {$facet.label}"{if $filter.active} checked{/if}>
                        <span class="ps-shown-by-js"></span>
                      </span>
                    {/if}
                    <a href="{$filter.nextEncodedFacetsURL}" class="_gray-darker search-link js-search-link" rel="nofollow">
                      {$barbaraalvisiFilterLabel|escape:'htmlall':'UTF-8'}
                      {if $filter.magnitude and $show_quantities}
                        <span class="magnitude">({$filter.magnitude})</span>
                      {/if}
                    </a>
                  </label>
                </li>
              {/foreach}
            </ul>
          </div>
        {elseif $facet.widgetType == 'dropdown'}
          <div id="facet_{$_expand_id}" class="collapse{if !$_collapse} in{/if}">
            <select class="custom-select" data-action="search-select">
              {foreach from=$facet.filters item="filter"}
                <option value="{$filter.nextEncodedFacetsURL}" {if $filter.active}selected{/if}>
                  {$filter.label|escape:'htmlall':'UTF-8'}
                  {if $filter.magnitude and $show_quantities} ({$filter.magnitude}){/if}
                </option>
              {/foreach}
            </select>
          </div>
        {elseif $facet.widgetType == 'slider'}
          <div id="facet_{$_expand_id}" class="collapse{if !$_collapse} in{/if}">
            {foreach from=$facet.filters item="filter"}
              {if isset($filter.specifications) && $filter.specifications}
              <div class="facet-slider js-facet-slider">
                <label>{$barbaraalvisiFacetLabel|escape:'htmlall':'UTF-8'}</label>
                <div class="js-slider" data-slider-min="{$filter.specifications.min}" data-slider-max="{$filter.specifications.max}" data-slider-id="{$_expand_id}" data-slider-values="{$filter.value|@json_encode}" data-slider-unit="{$filter.specifications.unit}" data-slider-label="{$filter.label}" data-slider-specifications="{$filter.specifications|@json_encode}" data-slider-encoded-url="{$filter.nextEncodedFacetsURL}"></div>
              </div>
              {/if}
            {/foreach}
          </div>
        {/if}
      </section>
    {/foreach}
  </div>
{/if}
