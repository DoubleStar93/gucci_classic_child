{assign var=_counter value=0}
{function name="menu" nodes=[] depth=0 parent=null}
  {if $nodes|count}
    <ul class="top-menu barbaraalvisi-top-menu" {if $depth == 0}id="top-menu"{/if} data-depth="{$depth}">
      {foreach from=$nodes item=node}
        <li class="barbaraalvisi-menu-item {$node.type}{if $node.current} current{/if}{if $node.children|count} barbaraalvisi-menu-item--parent{/if}" id="{$node.page_identifier}">
          {assign var=_counter value=$_counter+1}
          {if $node.children|count}
            {assign var=_expand_id value=10|mt_rand:100000}
          {/if}
          <div class="barbaraalvisi-menu-row">
            {include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$node.label scope='parent'}
            <a
              class="barbaraalvisi-menu-link{if $depth >= 0} dropdown-item{/if}{if $depth === 1} dropdown-submenu{/if}"
              href="{$node.url}"
              data-depth="{$depth}"
              {if $node.open_in_new_window} target="_blank" rel="noopener noreferrer"{/if}
            >
              {$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}
            </a>
            {if $node.children|count}
              <button
                type="button"
                class="barbaraalvisi-menu-expand btn-unstyle"
                data-target="#top_sub_menu_{$_expand_id}"
                aria-expanded="false"
                aria-controls="top_sub_menu_{$_expand_id}"
                aria-label="{if isset($language) && $language.iso_code == 'it'}Sottocategorie{else}{l s='Subcategories' d='Shop.Theme.Global'}{/if}"
              >
                <i class="material-icons" aria-hidden="true">chevron_right</i>
              </button>
            {/if}
          </div>
          {if $node.children|count}
            <div class="sub-menu js-sub-menu barbaraalvisi-sub-menu" id="top_sub_menu_{$_expand_id}" hidden>
              {menu nodes=$node.children depth=$node.depth parent=$node}
            </div>
          {/if}
        </li>
      {/foreach}
    </ul>
  {/if}
{/function}

{assign var='barbaraalvisiMenuNodes' value=$menu.children}
{if isset($barbaraalvisi_menu_nodes) && $barbaraalvisi_menu_nodes|@count}
  {assign var='barbaraalvisiMenuNodes' value=$barbaraalvisi_menu_nodes}
{/if}

<div class="menu js-top-menu barbaraalvisi-drawer-menu position-static" id="_desktop_top_menu">
  {menu nodes=$barbaraalvisiMenuNodes}
</div>
