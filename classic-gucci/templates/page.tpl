{**
 * Classic Gucci — pagine CMS / account / contact
 *}
{extends file='parent:page.tpl'}

{block name='page_content_container'}
  <div id="content" class="page-content gucci-page-content">
    {block name='page_content_top'}{/block}
    {block name='page_content'}
      <!-- Page content -->
    {/block}
  </div>
{/block}

{block name='page_header_container'}
  {block name='page_title' hide}
    <header class="page-header gucci-page-header">
      <h1 class="gucci-page-title">{$smarty.block.child}</h1>
    </header>
  {/block}
{/block}
