{**
 * Classic Gucci — 404 URL (PageNotFoundController)
 * Niente section.page-not-found Classic: evita overflow/max-width del bundle CCC.
 *}
{extends file='page.tpl'}

{block name="breadcrumb"}{/block}

{block name='page_header_container'}{/block}

{block name='page_content'}
  {include file='errors/_partials/gucci-404-body.tpl'}
{/block}
