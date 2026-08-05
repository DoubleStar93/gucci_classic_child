{**
 * Barbara Alvisi — pagine CMS / account / contact
 *}
{extends file='parent:page.tpl'}

{block name='page_content_container'}
  <div id="content" class="page-content barbaraalvisi-page-content">
    {block name='page_content_top'}{/block}
    {block name='page_content'}
      <!-- Page content -->
    {/block}
  </div>
{/block}

{block name='page_header_container'}
  {block name='page_title' hide}
    <header class="page-header barbaraalvisi-page-header">
      <h1 class="barbaraalvisi-page-title">{$smarty.block.child}</h1>
    </header>
  {/block}
{/block}

{block name='page_footer_container'}{/block}
