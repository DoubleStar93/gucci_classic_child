{**
 * Classic Gucci — paginazione PLP minimal
 *}
<nav class="pagination gucci-pagination">
  <div class="col-md-4">
    {block name='pagination_summary'}
      {if $language.iso_code == 'it'}
        {$pagination.items_shown_from}–{$pagination.items_shown_to} di {$pagination.total_items} articoli
      {else}
        {l s='Showing %from%-%to% of %total% item(s)' d='Shop.Theme.Catalog' sprintf=['%from%' => $pagination.items_shown_from ,'%to%' => $pagination.items_shown_to, '%total%' => $pagination.total_items]}
      {/if}
    {/block}
  </div>

  <div class="col-md-6 offset-md-2 pr-0">
    {block name='pagination_page_list'}
      {if $pagination.should_be_displayed}
        <ul class="page-list clearfix text-sm-center">
          {foreach from=$pagination.pages item="page"}
            <li{if $page.current} class="current"{/if}>
              {if $page.type === 'spacer'}
                <span class="spacer">&hellip;</span>
              {else}
                <a
                  rel="{if $page.type === 'previous'}prev{elseif $page.type === 'next'}next{else}nofollow{/if}"
                  href="{$page.url}"
                  class="{if $page.type === 'previous'}previous {elseif $page.type === 'next'}next {/if}{['disabled' => !$page.clickable, 'js-search-link' => true]|classnames}"
                >
                  {if $page.type === 'previous'}
                    <i class="material-icons" aria-hidden="true">&#xE314;</i>
                    {if $language.iso_code == 'it'}Precedente{else}{l s='Previous' d='Shop.Theme.Actions'}{/if}
                  {elseif $page.type === 'next'}
                    {if $language.iso_code == 'it'}Successivo{else}{l s='Next' d='Shop.Theme.Actions'}{/if}
                    <i class="material-icons" aria-hidden="true">&#xE315;</i>
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
