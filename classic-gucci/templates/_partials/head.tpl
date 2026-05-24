{**
 * Classic Gucci — font Google (Montserrat, come gucci.com)
 *}
{extends file='parent:_partials/head.tpl'}

{block name='head_icons' prepend}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap">
  {* Path esplicito child — con use_parent_assets theme_assets punta al padre *}
  <link rel="stylesheet" href="{$urls.base_url}themes/classic-gucci/assets/css/custom.css?v=1.3.0" type="text/css" media="all">
{/block}
