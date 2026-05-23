{**
 * Classic Gucci — newsletter footer stile gucci.com
 *}
<div class="gucci-footer-newsletter block_newsletter" id="blockEmailSubscription_{$hookName}">
  <h3 class="gucci-footer-heading" id="block-newsletter-label">
    {if $language.iso_code == 'it'}Registrati per ricevere aggiornamenti{else}{l s='Get our latest news and special sales' d='Shop.Theme.Global'}{/if}
  </h3>
  <form class="gucci-footer-newsletter-form" action="{$urls.current_url}#blockEmailSubscription_{$hookName}" method="post">
    <div class="gucci-footer-newsletter-row">
      <input
        name="email"
        type="email"
        value="{$value}"
        class="gucci-footer-input"
        placeholder="{if $language.iso_code == 'it'}Indirizzo e-mail{else}{l s='Your email address' d='Shop.Forms.Labels'}{/if}"
        aria-labelledby="block-newsletter-label"
        required
      >
      <button class="gucci-footer-submit btn-unstyle" name="submitNewsletter" type="submit">
        {if $language.iso_code == 'it'}Iscriviti{else}{l s='Subscribe' d='Shop.Theme.Actions'}{/if}
      </button>
    </div>
    <input type="hidden" name="blockHookName" value="{$hookName}">
    <input type="hidden" name="action" value="0">
    {if $conditions}
      <p class="gucci-footer-newsletter-note">{$conditions}</p>
    {/if}
    {if $msg}
      <p class="gucci-footer-newsletter-msg {if $nw_error}is-error{else}is-success{/if}">{$msg}</p>
    {/if}
    {hook h='displayNewsletterRegistration'}
    {if isset($id_module)}
      {hook h='displayGDPRConsent' id_module=$id_module}
    {/if}
  </form>
</div>
