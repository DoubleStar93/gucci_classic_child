{**
 * Classic Gucci — newsletter nel footer (stile gucci.com)
 *}
<div class="gucci-footer-newsletter email_subscription block_newsletter" id="blockEmailSubscription">
  <p class="gucci-footer-heading">
    {if $language.iso_code == 'it'}Iscriviti alla newsletter{else}{l s='Newsletter' d='Shop.Theme.Global'}{/if}
  </p>

  {if $msg}
    <p class="gucci-footer-newsletter-msg{if $nw_error} gucci-footer-newsletter-msg--error{else} gucci-footer-newsletter-msg--ok{/if}" role="status">
      {$msg nofilter}
    </p>
  {/if}

  <form action="{$urls.current_url}" method="post">
    <input type="hidden" name="blockHookName" value="displayFooter">
    <div class="gucci-footer-newsletter-row">
      <input
        type="email"
        name="email"
        class="gucci-footer-input"
        value="{$value|escape:'html':'UTF-8'}"
        placeholder="{if $language.iso_code == 'it'}Indirizzo e-mail{else}{l s='Your email address' d='Shop.Forms.Labels'}{/if}"
        aria-label="{if $language.iso_code == 'it'}Indirizzo e-mail{else}{l s='Your email address' d='Shop.Forms.Labels'}{/if}"
        required
      >
      <button class="gucci-footer-submit btn-unstyle" name="submitNewsletter" type="submit" value="1">
        {if $language.iso_code == 'it'}Iscriviti{else}{l s='Subscribe' d='Shop.Theme.Actions'}{/if}
      </button>
    </div>
  </form>

  {if $conditions}
    <p class="gucci-footer-newsletter-note">{$conditions nofilter}</p>
  {/if}
</div>
