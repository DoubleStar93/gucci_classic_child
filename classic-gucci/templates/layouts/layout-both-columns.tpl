{**
 * Classic Gucci — layout base full-bleed (no container Bootstrap 960px)
 *}
{include file='_partials/helpers.tpl'}

<!doctype html>
<html lang="{$language.locale}">

  <head>
    {block name='head'}
      {include file='_partials/head.tpl'}
    {/block}
  </head>

  <body id="{$page.page_name}" class="{$page.body_classes|classnames} gucci-body gucci-is-loading">

    {include file='_partials/gucci-page-loader.tpl'}

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
        <div class="container-fluid gucci-page-container px-0">
          {block name='breadcrumb'}
            {include file='_partials/breadcrumb.tpl'}
          {/block}

          <div class="row gucci-page-row mx-0">
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
      <script src="{$urls.base_url}themes/classic-gucci/assets/js/gucci-theme.js?v=2.5.2" defer></script>
    {/block}

    {block name='hook_before_body_closing_tag'}
      {hook h='displayBeforeBodyClosingTag'}
    {/block}
  </body>

</html>
