{**
 * Barbara Alvisi — login
 *}
{extends file='parent:customer/authentication.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Accedi al tuo account{else}{l s='Log in to your account' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-auth-page">
    {block name='login_form_container'}
      <section class="login-form barbaraalvisi-auth-form">
        {render file='customer/_partials/login-form.tpl' ui=$login_form}
      </section>
      {block name='display_after_login_form'}
        {hook h='displayCustomerLoginFormAfter'}
      {/block}
      <div class="barbaraalvisi-auth-alt">
        <a href="{$urls.pages.register}" data-link-action="display-register-form">
          {if $language.iso_code == 'it'}Non hai un account? Registrati{else}{l s='No account? Create one here' d='Shop.Theme.Customeraccount'}{/if}
        </a>
      </div>
    {/block}
  </div>
{/block}
