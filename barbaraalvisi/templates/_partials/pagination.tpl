{**
 * Barbara Alvisi — paginazione PLP minimal
 *}
<nav class="pagination barbaraalvisi-pagination" aria-label="{if $language.iso_code == 'it'}Paginazione{else}{l s='Pagination' d='Shop.Theme.Global'}{/if}">
  <div class="barbaraalvisi-pagination__inner">
    <p class="barbaraalvisi-pagination__summary">
      {block name='pagination_summary'}
        {if $language.iso_code == 'it'}
          {$pagination.items_shown_from}–{$pagination.items_shown_to} di {$pagination.total_items} articoli
        {else}
          {l s='Showing %from%-%to% of %total% item(s)' d='Shop.Theme.Catalog' sprintf=['%from%' => $pagination.items_shown_from ,'%to%' => $pagination.items_shown_to, '%total%' => $pagination.total_items]}
        {/if}
      {/block}
    </p>

    {block name='pagination_page_list'}
      {if $pagination.should_be_displayed}
        <ul class="page-list barbaraalvisi-pagination__pages">
          {foreach from=$pagination.pages item="page"}
            <li{if $page.current} class="current"{/if}>
              {if $page.type === 'spacer'}
                <span class="spacer" aria-hidden="true">&hellip;</span>
              {else}
                <a
                  rel="{if $page.type === 'previous'}prev{elseif $page.type === 'next'}next{else}nofollow{/if}"
                  href="{$page.url}"
                  class="{if $page.type === 'previous'}previous {elseif $page.type === 'next'}next {/if}{['disabled' => !$page.clickable, 'js-search-link' => true]|classnames}"
                  {if !$page.clickable} aria-disabled="true" tabindex="-1"{/if}
                >
                  {if $page.type === 'previous'}
                    {if $language.iso_code == 'it'}Precedente{else}{l s='Previous' d='Shop.Theme.Actions'}{/if}
                  {elseif $page.type === 'next'}
                    {if $language.iso_code == 'it'}Successivo{else}{l s='Next' d='Shop.Theme.Actions'}{/if}
                  {else}
                    {$page.page}
                  {/if}
                </a>
              {/if}
            </li>
          {/foreach}
        </ul>
      {/if}
    {/block}
  </div>
</nav>
