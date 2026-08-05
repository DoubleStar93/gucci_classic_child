{**
 * Barbara Alvisi — registrazione
 *}
{extends file='parent:customer/registration.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Crea un account{else}{l s='Create an account' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-auth-page">
    {block name='register_form_container'}
      {$hook_create_account_top nofilter}
      <section class="register-form barbaraalvisi-auth-form">
        <p class="barbaraalvisi-auth-alt">
          {if $language.iso_code == 'it'}Hai già un account?{else}{l s='Already have an account?' d='Shop.Theme.Customeraccount'}{/if}
          <a href="{$urls.pages.authentication}">{if $language.iso_code == 'it'}Accedi{else}{l s='Log in instead!' d='Shop.Theme.Customeraccount'}{/if}</a>
        </p>
        {render file='customer/_partials/customer-form.tpl' ui=$register_form}
      </section>
    {/block}
  </div>
{/block}
