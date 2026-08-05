{**
 * Barbara Alvisi — link sitemap con etichette IT
 *}
{block name='sitemap_item'}
  <ul{if !empty($is_nested)} class="nested barbaraalvisi-sitemap-nested"{else} class="barbaraalvisi-sitemap-list"{/if}>
    {foreach $links as $link}
      {include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$link.label scope='parent'}
      <li>
        <a
          id="{$link.id|escape:'htmlall':'UTF-8'}"
          href="{$link.url|escape:'htmlall':'UTF-8'}"
          title="{$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}"
        >
          {$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}
        </a>
        {if !empty($link.children)}
          {include file='cms/_partials/sitemap-nested-list.tpl' links=$link.children is_nested=true}
        {/if}
      </li>
    {/foreach}
  </ul>
{/block}
