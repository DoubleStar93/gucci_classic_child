{**
 * Classic Gucci — link sitemap con etichette IT
 *}
{block name='sitemap_item'}
  <ul{if !empty($is_nested)} class="nested gucci-sitemap-nested"{else} class="gucci-sitemap-list"{/if}>
    {foreach $links as $link}
      {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$link.label scope='parent'}
      <li>
        <a
          id="{$link.id|escape:'htmlall':'UTF-8'}"
          href="{$link.url|escape:'htmlall':'UTF-8'}"
          title="{$gucciLabelOut|escape:'htmlall':'UTF-8'}"
        >
          {$gucciLabelOut|escape:'htmlall':'UTF-8'}
        </a>
        {if !empty($link.children)}
          {include file='cms/_partials/sitemap-nested-list.tpl' links=$link.children is_nested=true}
        {/if}
      </li>
    {/foreach}
  </ul>
{/block}
