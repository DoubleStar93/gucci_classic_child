{**
 * Classic Gucci — override ps_facetedsearch (etichette IT + struttura drawer)
 *}
{if $displayedFacets|count}
  <div id="search_filters" class="gucci-facets">
    {block name='facets_title'}
      <p class="gucci-facets-title">
        {if isset($language) && $language.iso_code == 'it'}Filtra per{else}{l s='Filter By' d='Shop.Theme.Actions'}{/if}
      </p>
    {/block}

    {block name='facets_clearall_button'}
      {if $activeFilters|count}
        <div class="gucci-facets-clear">
          <button data-search-url="{$clear_all_link}" class="gucci-facets-clear-btn btn-unstyle js-search-filters-clear-all">
            {if isset($language) && $language.iso_code == 'it'}Cancella tutto{else}{l s='Clear all' d='Shop.Theme.Actions'}{/if}
          </button>
        </div>
      {/if}
    {/block}

    {foreach from=$displayedFacets item="facet"}
      {assign var='gucciFacetLabel' value=$facet.label}
      {if isset($language) && $language.iso_code == 'it'}
        {if $facet.label == 'Availability'}{assign var='gucciFacetLabel' value='Disponibilità'}{/if}
        {if $facet.label == 'Selections'}{assign var='gucciFacetLabel' value='Selezioni'}{/if}
        {if $facet.label == 'Price'}{assign var='gucciFacetLabel' value='Prezzo'}{/if}
        {if $facet.label == 'Categories'}{assign var='gucciFacetLabel' value='Categorie'}{/if}
        {if $facet.label == 'Size'}{assign var='gucciFacetLabel' value='Taglia'}{/if}
        {if $facet.label == 'Color'}{assign var='gucciFacetLabel' value='Colore'}{/if}
        {if $facet.label == 'Composition'}{assign var='gucciFacetLabel' value='Composizione'}{/if}
        {if $facet.label == 'Property'}{assign var='gucciFacetLabel' value='Caratteristiche'}{/if}
        {if $facet.label == 'Weight'}{assign var='gucciFacetLabel' value='Peso'}{/if}
        {if $facet.label == 'Brand'}{assign var='gucciFacetLabel' value='Marca'}{/if}
        {if $facet.label == 'Condition'}{assign var='gucciFacetLabel' value='Condizione'}{/if}
        {if $facet.label == 'Dimension'}{assign var='gucciFacetLabel' value='Dimensione'}{/if}
        {if $facet.label == 'Paper Type'}{assign var='gucciFacetLabel' value='Tipo carta'}{/if}
        {if $facet.label == 'Manufacturers'}{assign var='gucciFacetLabel' value='Marchi'}{/if}
      {/if}

      <section class="facet gucci-facet">
        <p class="gucci-facet-title h6 facet-title hidden-sm-up">{$gucciFacetLabel|escape:'htmlall':'UTF-8'}</p>
        {assign var=_expand_id value=10|mt_rand:100000}
        {assign var=_collapse value=true}
        {foreach from=$facet.filters item="filter"}
          {if $filter.active}{assign var=_collapse value=false}{/if}
        {/foreach}

        <div class="title hidden-md-up" data-target="#facet_{$_expand_id}" data-toggle="collapse"{if !$_collapse} aria-expanded="true"{/if}>
          <p class="h6 facet-title">{$gucciFacetLabel|escape:'htmlall':'UTF-8'}</p>
          <span class="navbar-toggler collapse-icons">
            <i class="material-icons add">&#xE313;</i>
            <i class="material-icons remove">&#xE316;</i>
          </span>
        </div>

        {if in_array($facet.widgetType, ['radio', 'checkbox'])}
          <div id="facet_{$_expand_id}" class="collapse{if !$_collapse} in{/if}">
            <ul class="gucci-facet-list">
              {foreach from=$facet.filters key=filter_key item="filter"}
                {if !$filter.displayed}{continue}{/if}
                {assign var='gucciFilterLabel' value=$filter.label}
                {if isset($language) && $language.iso_code == 'it'}
                  {if $filter.label == 'In stock'}{assign var='gucciFilterLabel' value='In magazzino'}{/if}
                  {if $filter.label == 'Not available'}{assign var='gucciFilterLabel' value='Non disponibile'}{/if}
                  {if $filter.label == 'New product'}{assign var='gucciFilterLabel' value='Nuovo prodotto'}{/if}
                  {if $filter.label == 'Discounted'}{assign var='gucciFilterLabel' value='Scontato'}{/if}
                  {if $filter.label == 'Long sleeves'}{assign var='gucciFilterLabel' value='Maniche lunghe'}{/if}
                  {if $filter.label == 'Short sleeves'}{assign var='gucciFilterLabel' value='Maniche corte'}{/if}
                  {if $filter.label == 'Matt paper'}{assign var='gucciFilterLabel' value='Carta opaca'}{/if}
                  {if $filter.label == 'Recycled cardboard'}{assign var='gucciFilterLabel' value='Cartone riciclato'}{/if}
                  {if $filter.label == 'Ceramic'}{assign var='gucciFilterLabel' value='Ceramica'}{/if}
                  {if $filter.label == '120 pages'}{assign var='gucciFilterLabel' value='120 pagine'}{/if}
                  {if $filter.label == 'Removable cover'}{assign var='gucciFilterLabel' value='Copertina removibile'}{/if}
                  {if $filter.label == 'Ruled'}{assign var='gucciFilterLabel' value='Righe'}{/if}
                  {if $filter.label == 'Plain'}{assign var='gucciFilterLabel' value='Bianco'}{/if}
                  {if $filter.label == 'Squared'}{assign var='gucciFilterLabel' value='Quadretti'}{/if}
                  {if $filter.label == 'Doted'}{assign var='gucciFilterLabel' value='Puntini'}{/if}
                  {if $filter.label == 'White'}{assign var='gucciFilterLabel' value='Bianco'}{/if}
                  {if $filter.label == 'Black'}{assign var='gucciFilterLabel' value='Nero'}{/if}
                  {if $filter.label == 'Grey'}{assign var='gucciFilterLabel' value='Grigio'}{/if}
                  {if $filter.label == 'Beige'}{assign var='gucciFilterLabel' value='Beige'}{/if}
                  {if $filter.label == 'Clothes'}{assign var='gucciFilterLabel' value='Abbigliamento'}{/if}
                  {if $filter.label == 'Accessories'}{assign var='gucciFilterLabel' value='Accessori'}{/if}
                  {if $filter.label == 'Art'}{assign var='gucciFilterLabel' value='Arte'}{/if}
                  {if $filter.label == 'Men'}{assign var='gucciFilterLabel' value='Uomo'}{/if}
                  {if $filter.label == 'Women'}{assign var='gucciFilterLabel' value='Donna'}{/if}
                  {if $filter.label == 'Stationery'}{assign var='gucciFilterLabel' value='Cancelleria'}{/if}
                  {if $filter.label == 'Home Accessories'}{assign var='gucciFilterLabel' value='Accessori per la casa'}{/if}
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
                      {$gucciFilterLabel|escape:'htmlall':'UTF-8'}
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
                <label>{$gucciFacetLabel|escape:'htmlall':'UTF-8'}</label>
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
