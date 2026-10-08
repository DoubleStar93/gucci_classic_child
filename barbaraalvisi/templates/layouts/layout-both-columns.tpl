{**
 * Barbara Alvisi — layout base full-bleed (no container Bootstrap 960px)
 *}
{include file='_partials/helpers.tpl'}

<!doctype html>
<html lang="{$language.locale}">

  <head>
    {block name='head'}
      {include file='_partials/head.tpl'}
    {/block}
  </head>

  <body id="{$page.page_name}" class="{$page.body_classes|classnames} barbaraalvisi-body{if $page.page_name != 'checkout'} barbaraalvisi-is-loading{/if}">

    {include file='_partials/barbaraalvisi-page-loader.tpl'}

    {block name='hook_after_body_opening_tag'}
      {hook h='displayAfterBodyOpeningTag'}
    {/block}

    <main>
      {block name='product_activation'}
        {include file='catalog/_partials/product-activation.tpl'}
      {/block}

      <header id="header">
        {block name='header'}
          {include file='_partials/header.tpl'}
        {/block}
      </header>

      <section id="wrapper">
        {block name='notifications'}
          {include file='_partials/notifications.tpl'}
        {/block}

        {hook h="displayWrapperTop"}
        <div class="container-fluid barbaraalvisi-page-container px-0">
          {block name='breadcrumb'}
            {include file='_partials/breadcrumb.tpl'}
          {/block}

          <div class="row barbaraalvisi-page-row mx-0">
            {block name="left_column"}
              <div id="left-column" class="col-xs-12 col-md-4 col-lg-3">
                {if $page.page_name == 'product'}
                  {hook h='displayLeftColumnProduct' product=$product category=$category}
                {else}
                  {hook h="displayLeftColumn"}
                {/if}
              </div>
            {/block}

            {block name="content_wrapper"}
              <div id="content-wrapper" class="js-content-wrapper col-xs-12">
                {hook h="displayContentWrapperTop"}
                {block name="content"}
                  <p>Hello world! This is HTML5 Boilerplate.</p>
                {/block}
                {hook h="displayContentWrapperBottom"}
              </div>
            {/block}

            {block name="right_column"}
              <div id="right-column" class="col-xs-12 col-md-4 col-lg-3">
                {if $page.page_name == 'product'}
                  {hook h='displayRightColumnProduct'}
                {else}
                  {hook h="displayRightColumn"}
                {/if}
              </div>
            {/block}
          </div>
        </div>
        {hook h="displayWrapperBottom"}
      </section>

      <footer id="footer" class="js-footer">
        {block name="footer"}
          {include file="_partials/footer.tpl"}
        {/block}
      </footer>

    </main>

    {block name='javascript_bottom'}
      {include file="_partials/password-policy-template.tpl"}
      {* ps_productcomments: stub variabili — template modale vuoto, JS resta nel bundle CCC *}
      <script>
        var productCommentPostErrorMessage = '{l s='Sorry, your review cannot be posted.' d='Modules.Productcomments.Shop' js=1}';
        var productCommentMandatoryMessage = '{l s='Please choose a rating for your review.' d='Modules.Productcomments.Shop' js=1}';
        var ratingChosen = false;
      </script>
      {include file="_partials/javascript.tpl" javascript=$javascript.bottom}
      {* Dopo il bundle CCC — evita cache JS obsoleta (come custom.css in head.tpl) *}
      <script src="{$urls.base_url}themes/barbaraalvisi/assets/js/barbaraalvisi-theme.js?v=2.8.3" defer></script>
    {/block}

    <a
      class="barbaraalvisi-whatsapp-float"
      href="https://wa.me/393522766033"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="{if $language.iso_code == 'it'}Scrivici su WhatsApp{else}Write to us on WhatsApp{/if}"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>

    {block name='hook_before_body_closing_tag'}
      {hook h='displayBeforeBodyClosingTag'}
    {/block}
  </body>

</html>
