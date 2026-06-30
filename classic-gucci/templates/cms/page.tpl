{**
 * Classic Gucci — pagine CMS (contenuto da back office PrestaShop)
 *}
{extends file='parent:cms/page.tpl'}

{block name='page_content_container'}
  <section id="content" class="page-content page-cms page-cms-{$cms.id|intval} gucci-cms-page">
    <div class="gucci-cms-page-inner">
      {block name='cms_content'}
        {$cms.content nofilter}
      {/block}

      {block name='hook_cms_dispute_information'}
        {hook h='displayCMSDisputeInformation'}
      {/block}

      {block name='hook_cms_print_button'}
        {hook h='displayCMSPrintButton'}
      {/block}
    </div>
  </section>
{/block}
