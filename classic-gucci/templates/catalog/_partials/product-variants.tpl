{**
 * Classic Gucci — varianti prodotto (taglia/colore chip)
 *}
<div class="product-variants js-product-variants gucci-product-variants">
  {foreach from=$groups key=id_attribute_group item=group}
    {if !empty($group.attributes)}
      <div class="clearfix product-variants-item gucci-product-variants-item gucci-product-variants-item--{$group.group_type|escape:'html':'UTF-8'}">
        {assign var='gucciGroupName' value=$group.name}
        {if $language.iso_code == 'it'}
          {if $group.name == 'Size'}{assign var='gucciGroupName' value='Taglia'}{/if}
          {if $group.name == 'Color'}{assign var='gucciGroupName' value='Colore'}{/if}
          {if $group.name == 'Dimension'}{assign var='gucciGroupName' value='Dimensione'}{/if}
        {/if}
        <span class="control-label gucci-variant-label">{$gucciGroupName}</span>

        {if $group.group_type == 'select'}
          <ul id="group_{$id_attribute_group}" class="gucci-variant-radios gucci-variant-sizes">
            {foreach from=$group.attributes key=id_attribute item=group_attribute}
              <li class="input-container gucci-variant-radio-item">
                <label>
                  <input
                    class="input-radio gucci-variant-size-input"
                    type="radio"
                    data-product-attribute="{$id_attribute_group}"
                    name="group[{$id_attribute_group}]"
                    value="{$id_attribute}"
                    title="{$group_attribute.name}"
                    {if $group_attribute.selected} checked="checked"{/if}
                  >
                  <span class="radio-label gucci-variant-radio-label gucci-variant-size-label">{$group_attribute.name}</span>
                </label>
              </li>
            {/foreach}
          </ul>
        {elseif $group.group_type == 'color'}
          <ul id="group_{$id_attribute_group}" class="gucci-variant-colors">
            {foreach from=$group.attributes key=id_attribute item=group_attribute}
              <li class="input-container gucci-variant-color-item">
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
          <ul id="group_{$id_attribute_group}" class="gucci-variant-radios">
            {foreach from=$group.attributes key=id_attribute item=group_attribute}
              <li class="input-container gucci-variant-radio-item">
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
                  <span class="radio-label gucci-variant-radio-label">{$group_attribute.name}</span>
                </label>
              </li>
            {/foreach}
          </ul>
        {/if}
      </div>
    {/if}
  {/foreach}
</div>
