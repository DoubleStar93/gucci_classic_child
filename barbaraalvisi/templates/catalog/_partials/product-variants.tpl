{**
 * Barbara Alvisi — varianti prodotto (taglia/colore chip)
 *}
<div class="product-variants js-product-variants barbaraalvisi-product-variants">
  {foreach from=$groups key=id_attribute_group item=group}
    {if !empty($group.attributes)}
      <div class="clearfix product-variants-item barbaraalvisi-product-variants-item barbaraalvisi-product-variants-item--{$group.group_type|escape:'html':'UTF-8'}">
        {assign var='barbaraalvisiGroupName' value=$group.name}
        {if $language.iso_code == 'it'}
          {if $group.name == 'Size'}{assign var='barbaraalvisiGroupName' value='Taglia'}{/if}
          {if $group.name == 'Color'}{assign var='barbaraalvisiGroupName' value='Colore'}{/if}
          {if $group.name == 'Dimension'}{assign var='barbaraalvisiGroupName' value='Dimensione'}{/if}
        {/if}
        <span class="control-label barbaraalvisi-variant-label">{$barbaraalvisiGroupName}</span>

        {if $group.group_type == 'select'}
          <ul id="group_{$id_attribute_group}" class="barbaraalvisi-variant-radios barbaraalvisi-variant-sizes">
            {foreach from=$group.attributes key=id_attribute item=group_attribute}
              {assign var='barbaraalvisiAttrUnavailable' value=false}
              {if isset($group_attribute.available) && $group_attribute.available == false}
                {assign var='barbaraalvisiAttrUnavailable' value=true}
              {elseif isset($group.attributes_quantity[$id_attribute]) && $group.attributes_quantity[$id_attribute] < 1}
                {assign var='barbaraalvisiAttrUnavailable' value=true}
              {/if}
              <li class="input-container barbaraalvisi-variant-radio-item{if $barbaraalvisiAttrUnavailable} barbaraalvisi-variant--unavailable{/if}">
                <label>
                  <input
                    class="input-radio barbaraalvisi-variant-size-input"
                    type="radio"
                    data-product-attribute="{$id_attribute_group}"
                    name="group[{$id_attribute_group}]"
                    value="{$id_attribute}"
                    title="{$group_attribute.name}"
                    {if $group_attribute.selected} checked="checked"{/if}
                  >
                  <span class="radio-label barbaraalvisi-variant-radio-label barbaraalvisi-variant-size-label">{$group_attribute.name}</span>
                </label>
              </li>
            {/foreach}
          </ul>
        {elseif $group.group_type == 'color'}
          <ul id="group_{$id_attribute_group}" class="barbaraalvisi-variant-colors">
            {foreach from=$group.attributes key=id_attribute item=group_attribute}
              {assign var='barbaraalvisiAttrUnavailable' value=false}
              {if isset($group_attribute.available) && $group_attribute.available == false}
                {assign var='barbaraalvisiAttrUnavailable' value=true}
              {elseif isset($group.attributes_quantity[$id_attribute]) && $group.attributes_quantity[$id_attribute] < 1}
                {assign var='barbaraalvisiAttrUnavailable' value=true}
              {/if}
              <li class="input-container barbaraalvisi-variant-color-item{if $barbaraalvisiAttrUnavailable} barbaraalvisi-variant--unavailable{/if}">
                <label aria-label="{$group_attribute.name}">
                  <input
                    class="input-color"
                    type="radio"
                    data-product-attribute="{$id_attribute_group}"
                    name="group[{$id_attribute_group}]"
                    value="{$id_attribute}"
                    title="{$group_attribute.name}"
                    {if $group_attribute.selected} checked="checked"{/if}
                  >
                  <span
                    {if $group_attribute.texture}
                      class="color texture"
                      style="background-image: url({$group_attribute.texture})"
                    {elseif $group_attribute.html_color_code}
                      class="color"
                      style="background-color: {$group_attribute.html_color_code}"
                    {/if}
                  >
                    <span class="attribute-name sr-only">{$group_attribute.name}</span>
                  </span>
                </label>
              </li>
            {/foreach}
          </ul>
        {elseif $group.group_type == 'radio'}
          <ul id="group_{$id_attribute_group}" class="barbaraalvisi-variant-radios">
            {foreach from=$group.attributes key=id_attribute item=group_attribute}
              {assign var='barbaraalvisiAttrUnavailable' value=false}
              {if isset($group_attribute.available) && $group_attribute.available == false}
                {assign var='barbaraalvisiAttrUnavailable' value=true}
              {elseif isset($group.attributes_quantity[$id_attribute]) && $group.attributes_quantity[$id_attribute] < 1}
                {assign var='barbaraalvisiAttrUnavailable' value=true}
              {/if}
              <li class="input-container barbaraalvisi-variant-radio-item{if $barbaraalvisiAttrUnavailable} barbaraalvisi-variant--unavailable{/if}">
                <label>
                  <input
                    class="input-radio"
                    type="radio"
                    data-product-attribute="{$id_attribute_group}"
                    name="group[{$id_attribute_group}]"
                    value="{$id_attribute}"
                    title="{$group_attribute.name}"
                    {if $group_attribute.selected} checked="checked"{/if}
                  >
                  <span class="radio-label barbaraalvisi-variant-radio-label">{$group_attribute.name}</span>
                </label>
              </li>
            {/foreach}
          </ul>
        {/if}
      </div>
    {/if}
  {/foreach}
</div>
