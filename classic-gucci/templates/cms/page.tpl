{**
 * Classic Gucci — pagine CMS (Delivery, Legal, About, …)
 *}
{extends file='parent:cms/page.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it' && isset($cms.meta_title)}
    {if $cms.meta_title == 'Delivery'}
      Spedizioni
    {elseif $cms.meta_title == 'Legal Notice'}
      Note legali
    {elseif $cms.meta_title == 'Terms and conditions of use'}
      Termini e condizioni
    {elseif $cms.meta_title == 'About us'}
      Chi siamo
    {elseif $cms.meta_title == 'Secure payment'}
      Pagamento sicuro
    {else}
      {$cms.meta_title}
    {/if}
  {else}
    {$smarty.block.parent}
  {/if}
{/block}

{block name='page_content_container'}
  <section id="content" class="page-content page-cms page-cms-{$cms.id|intval} gucci-cms-page">
    <div class="gucci-cms-page-inner">
      {block name='cms_content'}
        {assign var='gucciCmsKey' value=''}
        {if $language.iso_code == 'it'}
          {if $cms.meta_title == 'Delivery' || $cms.id == 1}{assign var='gucciCmsKey' value='delivery'}{/if}
          {if $cms.meta_title == 'Legal Notice' || $cms.id == 2}{assign var='gucciCmsKey' value='legal'}{/if}
          {if $cms.meta_title == 'Terms and conditions of use' || $cms.id == 3}{assign var='gucciCmsKey' value='terms'}{/if}
          {if $cms.meta_title == 'About us' || $cms.id == 4}{assign var='gucciCmsKey' value='about'}{/if}
          {if $cms.meta_title == 'Secure payment' || $cms.id == 5}{assign var='gucciCmsKey' value='payment'}{/if}
        {/if}

        {if $gucciCmsKey}
          {include file='cms/_partials/gucci-cms-content-it.tpl'}
        {else}
          {$cms.content nofilter}
        {/if}
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
