{**
 * Classic Gucci — homepage editoriale
 *}
{extends file='parent:index.tpl'}

{block name='page_content_container'}
  <section id="content" class="page-home gucci-home">
    {block name='page_content_top'}{/block}

    {block name='page_content'}
      {block name='hook_home'}
        <div class="gucci-home-modules">
          {$HOOK_HOME nofilter}
        </div>
      {/block}
    {/block}
  </section>
{/block}
