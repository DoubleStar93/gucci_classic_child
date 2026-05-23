{**
 * Classic Gucci — breadcrumb minimale (nascosto su home, PDP, PLP)
 *}
{if $page.page_name != 'index' && $page.page_name != 'product' && $page.page_name != 'category' && $page.page_name != 'search'}
  <nav data-depth="{$breadcrumb.count}" class="breadcrumb gucci-breadcrumb">
    <ol>
      {foreach from=$breadcrumb.links item=path name=breadcrumb}
        <li>
          {if not $smarty.foreach.breadcrumb.last}
            <a href="{$path.url}"><span>{$path.title}</span></a>
          {else}
            <span>{$path.title}</span>
          {/if}
        </li>
      {/foreach}
    </ol>
  </nav>
{/if}
