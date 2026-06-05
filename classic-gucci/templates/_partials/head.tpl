{**
 * Classic Gucci — font Google (Jost + Cormorant Garamond, ≈ Gucci Sans/Serif)
 * custom.css v2.2.0 contact form readability
 *}
{extends file='parent:_partials/head.tpl'}

{block name='head_seo_title'}
  {if isset($language) && $language.iso_code == 'it'}
    {if $page.page_name == 'cms' && isset($cms.meta_title)}
      {if $cms.meta_title == 'Delivery' || $cms.id == 1}Spedizioni
      {elseif $cms.meta_title == 'Legal Notice' || $cms.id == 2}Note legali
      {elseif $cms.meta_title == 'Terms and conditions of use' || $cms.id == 3}Termini e condizioni
      {elseif $cms.meta_title == 'About us' || $cms.id == 4}Chi siamo
      {elseif $cms.meta_title == 'Secure payment' || $cms.id == 5}Pagamento sicuro
      {else}{$page.meta.title|escape:'htmlall':'UTF-8'}
      {/if}
    {elseif $page.page_name == 'sitemap'}Mappa del sito
    {elseif $page.page_name == 'contact'}Contattaci
    {elseif $page.page_name == 'stores'}Negozi
    {elseif $page.page_name == 'order-confirmation'}Conferma ordine
    {elseif $page.page_name == 'cart' && $language.iso_code == 'it'}Carrello
    {elseif $page.page_name == 'checkout' && $language.iso_code == 'it'}Cassa
    {elseif $page.page_name == 'index'}Home
    {elseif $page.page_name == 'category' && isset($category.name)}
      {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$category.name scope='parent'}
      {$gucciLabelOut|escape:'htmlall':'UTF-8'}
    {elseif $page.page_name == 'search'}Cerca
    {elseif $page.page_name == 'new-products'}Nuovi prodotti
    {elseif $page.page_name == 'best-sales'}Più venduti
    {elseif $page.page_name == 'prices-drop'}Offerte
    {else}{$page.meta.title|escape:'htmlall':'UTF-8'}
    {/if}
  {else}
    {$page.meta.title|escape:'htmlall':'UTF-8'}
  {/if}
{/block}

{block name='head_icons' prepend}
  <link rel="icon" type="image/png" sizes="512x512" href="{$urls.base_url}themes/classic-gucci/assets/img/brand/favicon/favicon-512.png">
  <link rel="icon" type="image/png" sizes="32x32" href="{$urls.base_url}themes/classic-gucci/assets/img/brand/favicon/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="{$urls.base_url}themes/classic-gucci/assets/img/brand/favicon/favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="{$urls.base_url}themes/classic-gucci/assets/img/brand/favicon/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap">
{/block}

{* Dopo il bundle CCC — unica sorgente token/tipografia *}
{block name='stylesheets' append}
  <link rel="stylesheet" href="{$urls.base_url}themes/classic-gucci/assets/css/custom.css?v=2.2.1" type="text/css" media="all">
{/block}

{* Iubenda — Cookie Solution (banner consenso) *}
{block name='hook_header' append}
  <script type="text/javascript" src="https://embeds.iubenda.com/widgets/7d16301f-f4fb-41ee-9457-e32abc153672.js"></script>
{/block}
