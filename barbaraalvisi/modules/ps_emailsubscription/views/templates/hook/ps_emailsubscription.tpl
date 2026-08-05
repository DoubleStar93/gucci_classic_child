{**
 * Barbara Alvisi — newsletter nel footer (stile luxury reference)
 *}
<div class="barbaraalvisi-footer-newsletter email_subscription block_newsletter" id="blockEmailSubscription">
  <p class="barbaraalvisi-footer-heading">
    {if $language.iso_code == 'it'}Iscriviti alla newsletter{else}{l s='Newsletter' d='Shop.Theme.Global'}{/if}
  </p>

  {if $msg && isset($nw_error) && !$nw_error}
    <div class="barbaraalvisi-footer-newsletter-feedback barbaraalvisi-footer-newsletter-feedback--ok" role="status">
      <p class="barbaraalvisi-footer-newsletter-msg barbaraalvisi-footer-newsletter-msg--ok">{$msg}</p>
    </div>
  {else}
    {if $msg}
      <div class="barbaraalvisi-footer-newsletter-feedback barbaraalvisi-footer-newsletter-feedback--error" role="alert">
        <p class="barbaraalvisi-footer-newsletter-msg barbaraalvisi-footer-newsletter-msg--error">{$msg}</p>
      </div>
    {/if}

    <form action="{$urls.current_url}" method="post">
      <input type="hidden" name="blockHookName" value="displayFooter">
      <div class="barbaraalvisi-footer-newsletter-row">
        <input
          type="email"
          name="email"
          class="barbaraalvisi-footer-input"
          value="{$value|escape:'html':'UTF-8'}"
          placeholder="{if $language.iso_code == 'it'}Indirizzo e-mail{else}{l s='Your email address' d='Shop.Forms.Labels'}{/if}"
          aria-label="{if $language.iso_code == 'it'}Indirizzo e-mail{else}{l s='Your email address' d='Shop.Forms.Labels'}{/if}"
          required
        >
        <button class="barbaraalvisi-footer-submit btn-unstyle" name="submitNewsletter" type="submit" value="1">
          {if $language.iso_code == 'it'}Iscriviti{else}{l s='Subscribe' d='Shop.Theme.Actions'}{/if}
        </button>
      </div>
    </form>
  {/if}

  {if $conditions}
    <p class="barbaraalvisi-footer-newsletter-note">{$conditions nofilter}</p>
  {/if}
</div>
