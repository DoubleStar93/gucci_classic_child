{**
 * Classic Gucci — pagina manutenzione
 *}
{extends file='parent:errors/maintenance.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Torniamo presto{else}{l s='We\'ll be back soon.' d='Shop.Theme.Global'}{/if}
{/block}

{block name='page_content'}
  <div class="gucci-maintenance-content">
    {$maintenance_text nofilter}
  </div>
{/block}
