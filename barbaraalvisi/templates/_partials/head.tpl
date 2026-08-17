{**
 * Barbara Alvisi — font Google (Jost + Cormorant Garamond, ≈ luxury sans/Serif)
 * custom.css v2.2.4 newsletter inline
 *}
{extends file='parent:_partials/head.tpl'}

{* Staging: blocca indicizzazione su tutte le pagine *}
{block name='head_seo' prepend}
  <meta name="robots" content="noindex, nofollow" />
{/block}

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
      {include file='_partials/barbaraalvisi-it-label.tpl' barbaraalvisiLabelIn=$category.name scope='parent'}
      {$barbaraalvisiLabelOut|escape:'htmlall':'UTF-8'}
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

{block name='head_seo' append}
  <script>
    (function () {
      var hideBarbaraalvisiPageLoader = function () {
        document.documentElement.classList.remove('barbaraalvisi-is-loading');
        if (document.body) {
          document.body.classList.remove('barbaraalvisi-is-loading');
        }
        var loader = document.getElementById('barbaraalvisi-page-loader');
        if (loader) {
          loader.classList.add('is-hidden');
        }
      };

      window.barbaraalvisiHidePageLoader = hideBarbaraalvisiPageLoader;
      {if ($page.page_name|default:'') == 'checkout'}
      hideBarbaraalvisiPageLoader();
      {else}
      document.documentElement.classList.add('barbaraalvisi-is-loading');
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideBarbaraalvisiPageLoader, { once: true });
      } else {
        hideBarbaraalvisiPageLoader();
      }
      {/if}

      window.addEventListener('load', hideBarbaraalvisiPageLoader, { once: true });
      window.addEventListener('pageshow', hideBarbaraalvisiPageLoader);
      setTimeout(hideBarbaraalvisiPageLoader, 2500);
    }());
  </script>
  <style id="barbaraalvisi-page-loader-critical">
    html.barbaraalvisi-is-loading,
    html.barbaraalvisi-is-loading body {
      overflow: hidden;
    }

    .barbaraalvisi-page-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      opacity: 1;
      visibility: visible;
      transition: opacity 0.35s ease, visibility 0.35s ease;
    }

    .barbaraalvisi-page-loader.is-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .barbaraalvisi-page-loader__mark {
      display: block;
      width: clamp(4.5rem, 14vw, 6.25rem);
      height: auto;
      animation: barbaraalvisi-loader-pulse 1.8s ease-in-out infinite;
    }

    @keyframes barbaraalvisi-loader-pulse {
      0%,
      100% {
        opacity: 0.5;
        transform: scale(0.94);
      }

      50% {
        opacity: 1;
        transform: scale(1);
      }
    }
  </style>
{/block}

{block name='head_icons' prepend}
  <link rel="preload" as="image" href="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/charger.png" type="image/png">
  <link rel="icon" type="image/png" sizes="512x512" href="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/favicon/favicon-512.png">
  <link rel="icon" type="image/png" sizes="32x32" href="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/favicon/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/favicon/favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/favicon/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap">
{/block}

{* Dopo il bundle CCC — unica sorgente token/tipografia (custom.css) *}
{block name='stylesheets' append}
  <link rel="stylesheet" href="{$urls.base_url}themes/barbaraalvisi/assets/css/custom.css?v=2.23.5" type="text/css" media="all">
  <link rel="stylesheet" href="{$urls.base_url}themes/barbaraalvisi/assets/css/home-overrides.css?v=1.0.5" type="text/css" media="all">
{/block}

{* Iubenda — Cookie Solution (banner consenso) *}
{block name='hook_header' append}
  <script type="text/javascript" src="https://embeds.iubenda.com/widgets/7d16301f-f4fb-41ee-9457-e32abc153672.js"></script>
{/block}
