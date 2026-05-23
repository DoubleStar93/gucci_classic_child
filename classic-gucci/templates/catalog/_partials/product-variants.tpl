{**
 * Classic Gucci — varianti prodotto (taglia/colore allineate)
 *}
<div class="product-variants js-product-variants gucci-product-variants">
  {foreach from=$groups key=id_attribute_group item=group}
    {if !empty($group.attributes)}
      <div class="clearfix product-variants-item gucci-product-variants-item gucci-product-variants-item--{$group.group_type|escape:'html':'UTF-8'}">
        <span class="control-label gucci-variant-label">{$group.name}</span>

        {if $group.group_type == 'select'}
          <select
            class="form-control form-control-select gucci-variant-select"
            id="group_{$id_attribute_group}"
            aria-label="{$group.name}"
            data-product-attribute="{$id_attribute_group}"
            name="group[{$id_attribute_group}]"
          >
            {foreach from=$group.attributes key=id_attribute item=group_attribute}
              <option value="{$id_attribute}" title="{$group_attribute.name}"{if $group_attribute.selected} selected="selected"{/if}>{$group_attribute.name}</option>
            {/foreach}
          </select>
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
