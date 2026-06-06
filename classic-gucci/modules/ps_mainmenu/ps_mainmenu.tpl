{assign var=_counter value=0}
{function name="menu" nodes=[] depth=0 parent=null}
  {if $nodes|count}
    <ul class="top-menu gucci-top-menu" {if $depth == 0}id="top-menu"{/if} data-depth="{$depth}">
      {foreach from=$nodes item=node}
        <li class="gucci-menu-item {$node.type}{if $node.current} current{/if}{if $node.children|count} gucci-menu-item--parent{/if}" id="{$node.page_identifier}">
          {assign var=_counter value=$_counter+1}
          {if $node.children|count}
            {assign var=_expand_id value=10|mt_rand:100000}
          {/if}
          <div class="gucci-menu-row">
            {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$node.label scope='parent'}
            <a
              class="gucci-menu-link{if $depth >= 0} dropdown-item{/if}{if $depth === 1} dropdown-submenu{/if}"
              href="{$node.url}"
              data-depth="{$depth}"
              {if $node.open_in_new_window} target="_blank" rel="noopener noreferrer"{/if}
            >
              {$gucciLabelOut|escape:'htmlall':'UTF-8'}
            </a>
            {if $node.children|count}
              <button
                type="button"
                class="gucci-menu-expand btn-unstyle"
                data-target="#top_sub_menu_{$_expand_id}"
                aria-expanded="{if $depth === 0}true{else}false{/if}"
                aria-controls="top_sub_menu_{$_expand_id}"
                aria-label="{if isset($language) && $language.iso_code == 'it'}Sottocategorie{else}{l s='Subcategories' d='Shop.Theme.Global'}{/if}"
              >
                <i class="material-icons" aria-hidden="true">chevron_right</i>
              </button>
            {/if}
          </div>
          {if $node.children|count}
            <div class="sub-menu js-sub-menu gucci-sub-menu{if $depth === 0} is-open{/if}" id="top_sub_menu_{$_expand_id}"{if $depth !== 0} hidden{/if}>
              {menu nodes=$node.children depth=$node.depth parent=$node}
            </div>
          {/if}
        </li>
      {/foreach}
    </ul>
  {/if}
{/function}

<div class="menu js-top-menu gucci-drawer-menu position-static" id="_desktop_top_menu">
  {menu nodes=$menu.children}
</div>
